from __future__ import annotations

import base64
import datetime as dt
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import subprocess
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterable, Iterator
from uuid import uuid4

import httpx
from fastapi import Cookie, FastAPI, HTTPException, Response
from pydantic import BaseModel, Field


DEFAULT_ROOT = Path(__file__).resolve().parent if os.name == "nt" else Path("/opt/xiaoxuebao-hermes")
ROOT_DIR = Path(os.getenv("XIAOXUEBAO_ROOT", str(DEFAULT_ROOT)))
ENV_PATH = Path(os.getenv("XIAOXUEBAO_ENV_PATH", ROOT_DIR / ".env"))
DATA_DIR = Path(os.getenv("XIAOXUEBAO_GATEWAY_DATA_DIR", ROOT_DIR / "web-gateway" / "data"))
DB_PATH = Path(os.getenv("XIAOXUEBAO_GATEWAY_DB", DATA_DIR / "xiaoxuebao.db"))
COOKIE_NAME = "xxb_session"
UTC = dt.timezone.utc


def load_env_file(path: Path = ENV_PATH) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    with path.open("r", encoding="utf-8") as handle:
        for raw in handle:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def env(name: str, default: str = "") -> str:
    return os.getenv(name) or load_env_file().get(name, default)


def now_utc() -> str:
    return dt.datetime.now(UTC).replace(microsecond=0).isoformat()


def public_date(value: str | None) -> str:
    if not value:
        return "--"
    try:
        return dt.datetime.fromisoformat(value).astimezone(UTC).strftime("%Y-%m-%d")
    except ValueError:
        return value[:10]


def public_time(value: str | None) -> str:
    if not value:
        return "--"
    try:
        return dt.datetime.fromisoformat(value).astimezone(UTC).strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return value[:16]


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    iterations = 260_000
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), iterations)
    return f"pbkdf2_sha256${iterations}${salt}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iteration_text, salt, digest = stored.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        iterations = int(iteration_text)
        candidate = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            iterations,
        ).hex()
    except Exception:
        return False
    return hmac.compare_digest(candidate, digest)


def infer_topic(question: str) -> str:
    checks = [
        ("发烧", ("发烧", "发热", "体温", "感染")),
        ("饮食", ("吃", "饭", "营养", "水果", "食欲")),
        ("心理", ("害怕", "情绪", "心情", "哭", "解释")),
        ("护理", ("PICC", "输液港", "护理", "口腔", "皮肤")),
        ("用药", ("药", "剂量", "甲氨蝶呤", "化疗")),
    ]
    for topic, words in checks:
        if any(word in question for word in words):
            return topic
    return "其他"


def build_hermes_payload(messages: Iterable[dict[str, Any]]) -> dict[str, Any]:
    clean_messages = [
        {
            "role": str(message.get("role", "user")),
            "content": str(message.get("content", "")).strip(),
        }
        for message in messages
        if str(message.get("content", "")).strip()
    ]
    return {
        "model": env("WEB_GATEWAY_MODEL", env("API_SERVER_MODEL_NAME", "xiaoxuebao-web")),
        "messages": clean_messages,
        "temperature": 0.2,
    }


class Database:
    def __init__(self, path: Path = DB_PATH) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._init()

    @contextmanager
    def connect(self) -> Iterator[sqlite3.Connection]:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _init(self) -> None:
        with self.connect() as conn:
            conn.executescript(
                """
                PRAGMA journal_mode=WAL;
                CREATE TABLE IF NOT EXISTS users (
                  id TEXT PRIMARY KEY,
                  phone TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  name TEXT NOT NULL,
                  role TEXT NOT NULL,
                  is_admin INTEGER NOT NULL DEFAULT 0,
                  status TEXT NOT NULL DEFAULT 'active',
                  profile_id TEXT,
                  hermes_base_url TEXT,
                  created_at TEXT NOT NULL,
                  last_active_at TEXT
                );
                CREATE TABLE IF NOT EXISTS history (
                  id TEXT PRIMARY KEY,
                  user_id TEXT NOT NULL,
                  question TEXT NOT NULL,
                  answer TEXT NOT NULL,
                  topic TEXT NOT NULL,
                  created_at TEXT NOT NULL,
                  FOREIGN KEY(user_id) REFERENCES users(id)
                );
                """
            )

    def create_user(
        self,
        phone: str,
        password: str,
        name: str,
        role: str,
        *,
        is_admin: bool = False,
        profile_id: str | None = None,
        hermes_base_url: str | None = None,
    ) -> dict[str, Any]:
        user_id = "u_" + uuid4().hex[:16]
        created_at = now_utc()
        with self.connect() as conn:
            conn.execute(
                """
                INSERT INTO users (
                  id, phone, password_hash, name, role, is_admin, status,
                  profile_id, hermes_base_url, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
                """,
                (
                    user_id,
                    phone,
                    hash_password(password),
                    name,
                    role,
                    1 if is_admin else 0,
                    profile_id,
                    hermes_base_url,
                    created_at,
                ),
            )
        return self.get_user(user_id) or {}

    def get_user(self, user_id: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return self._user_from_row(row) if row else None

    def get_user_by_phone(self, phone: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone()
        return self._user_from_row(row) if row else None

    def authenticate(self, identifier: str, password: str) -> dict[str, Any] | None:
        user = self.get_user_by_phone(identifier)
        if not user or user["status"] != "active":
            return None
        with self.connect() as conn:
            row = conn.execute("SELECT password_hash FROM users WHERE id = ?", (user["id"],)).fetchone()
            if not row or not verify_password(password, row["password_hash"]):
                return None
            conn.execute("UPDATE users SET last_active_at = ? WHERE id = ?", (now_utc(), user["id"]))
        return self.get_user(user["id"])

    def list_users(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute(
                """
                SELECT u.*, COUNT(h.id) AS question_count, MAX(h.created_at) AS latest_history
                FROM users u
                LEFT JOIN history h ON h.user_id = u.id
                GROUP BY u.id
                ORDER BY u.created_at DESC
                """
            ).fetchall()
        return [self._admin_user_from_row(row) for row in rows]

    def set_user_status(self, user_id: str, status: str) -> dict[str, Any] | None:
        if status not in {"active", "inactive"}:
            raise ValueError("Invalid status")
        with self.connect() as conn:
            conn.execute("UPDATE users SET status = ? WHERE id = ?", (status, user_id))
        users = [user for user in self.list_users() if user["id"] == user_id]
        return users[0] if users else None

    def add_history(self, user_id: str, question: str, answer: str, topic: str) -> dict[str, Any]:
        item_id = "h_" + uuid4().hex[:16]
        created_at = now_utc()
        with self.connect() as conn:
            conn.execute(
                "INSERT INTO history (id, user_id, question, answer, topic, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (item_id, user_id, question, answer, topic, created_at),
            )
            conn.execute("UPDATE users SET last_active_at = ? WHERE id = ?", (created_at, user_id))
        return {
            "id": item_id,
            "userId": user_id,
            "date": public_date(created_at),
            "time": dt.datetime.fromisoformat(created_at).strftime("%H:%M"),
            "question": question,
            "answer": answer,
            "topic": topic,
        }

    def list_history(self, user_id: str) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute(
                "SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC",
                (user_id,),
            ).fetchall()
        return [self._history_from_row(row) for row in rows]

    def list_all_history(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute(
                """
                SELECT h.*, u.name AS user_name
                FROM history h
                JOIN users u ON u.id = h.user_id
                ORDER BY h.created_at DESC
                LIMIT 500
                """
            ).fetchall()
        return [
            {
                "id": row["id"],
                "userId": row["user_id"],
                "userName": row["user_name"],
                "time": public_time(row["created_at"]),
                "question": row["question"],
                "answer": row["answer"],
                "topic": row["topic"],
            }
            for row in rows
        ]

    def stats(self) -> dict[str, Any]:
        logs = self.list_all_history()
        users = self.list_users()
        today = dt.datetime.now(UTC).strftime("%Y-%m-%d")
        active_today = sum(1 for user in users if user["lastActive"] == today)
        daily_map: dict[str, int] = {}
        topic_map: dict[str, int] = {}
        for log in logs:
            day = log["time"][:10]
            daily_map[day] = daily_map.get(day, 0) + 1
            topic_map[log["topic"]] = topic_map.get(log["topic"], 0) + 1
        return {
            "statsOverview": {
                "totalUsers": len(users),
                "activeToday": active_today,
                "totalQuestions": len(logs),
                "installedSkills": 1,
                "userGrowth": 0,
                "questionGrowth": 0,
            },
            "dailyQuestions": [
                {"date": key[5:] if len(key) >= 10 else key, "count": value}
                for key, value in sorted(daily_map.items())[-7:]
            ],
            "topicStats": [
                {"topic": key, "count": value}
                for key, value in sorted(topic_map.items(), key=lambda item: item[1], reverse=True)[:5]
            ],
            "recentLogs": logs[:5],
        }

    def _user_from_row(self, row: sqlite3.Row) -> dict[str, Any]:
        return {
            "id": row["id"],
            "phone": row["phone"],
            "name": row["name"],
            "role": row["role"],
            "is_admin": bool(row["is_admin"]),
            "status": row["status"],
            "profile_id": row["profile_id"],
            "hermes_base_url": row["hermes_base_url"],
        }

    def _admin_user_from_row(self, row: sqlite3.Row) -> dict[str, Any]:
        latest = row["latest_history"] or row["last_active_at"]
        return {
            "id": row["id"],
            "phone": row["phone"],
            "name": row["name"],
            "registerDate": public_date(row["created_at"]),
            "questionCount": int(row["question_count"] or 0),
            "lastActive": public_date(latest),
            "status": row["status"],
            "role": row["role"],
        }

    def _history_from_row(self, row: sqlite3.Row) -> dict[str, Any]:
        created_at = row["created_at"]
        return {
            "id": row["id"],
            "userId": row["user_id"],
            "date": public_date(created_at),
            "time": dt.datetime.fromisoformat(created_at).strftime("%H:%M"),
            "question": row["question"],
            "answer": row["answer"],
            "topic": row["topic"],
        }


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1)
    password: str = Field(min_length=1)


class ChatRequest(BaseModel):
    messages: list[dict[str, Any]]


class CreateUserRequest(BaseModel):
    phone: str = Field(min_length=1)
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)
    role: str = "家长"


class StatusRequest(BaseModel):
    status: str


db = Database()
app = FastAPI(title="Xiaoxuebao Web Gateway", version="0.1.0")


def session_secret() -> str:
    secret = env("WEB_GATEWAY_SESSION_SECRET", env("API_SERVER_KEY", ""))
    if not secret:
        raise HTTPException(status_code=500, detail="WEB_GATEWAY_SESSION_SECRET missing")
    return secret


def b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_session(user: dict[str, Any]) -> str:
    payload = {
        "sub": user["id"],
        "admin": bool(user["is_admin"]),
        "exp": int((dt.datetime.now(UTC) + dt.timedelta(days=7)).timestamp()),
        "nonce": secrets.token_hex(8),
    }
    body = b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(session_secret().encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest()
    return body + "." + b64encode(signature)


def read_session(token: str | None) -> dict[str, Any] | None:
    if not token or "." not in token:
        return None
    body, signature = token.split(".", 1)
    expected = hmac.new(session_secret().encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest()
    if not hmac.compare_digest(b64encode(expected), signature):
        return None
    payload = json.loads(b64decode(body))
    if int(payload.get("exp", 0)) < int(dt.datetime.now(UTC).timestamp()):
        return None
    return payload


def current_user(token: str | None) -> dict[str, Any] | None:
    payload = read_session(token)
    if not payload:
        return None
    user = db.get_user(str(payload.get("sub", "")))
    if not user or user["status"] != "active":
        return None
    return user


def require_user(token: str | None) -> dict[str, Any]:
    user = current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="请先登录")
    return user


def require_admin(token: str | None) -> dict[str, Any]:
    user = require_user(token)
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="需要管理员权限")
    return user


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "phone": user["phone"],
        "name": user["name"],
        "role": user["role"],
        "is_admin": bool(user["is_admin"]),
    }


def bootstrap_admin() -> None:
    username = env("WEB_GATEWAY_ADMIN_USERNAME", "")
    password = env("WEB_GATEWAY_ADMIN_PASSWORD", "")
    if not username or not password:
        return
    if not db.get_user_by_phone(username):
        db.create_user(username, password, "管理员", "管理员", is_admin=True)


def user_hermes_config(user: dict[str, Any] | None) -> tuple[str, str]:
    if user and user.get("hermes_base_url") and user.get("profile_id"):
        profile_env = ROOT_DIR / "profiles" / str(user["profile_id"]) / ".env"
        api_key = load_env_file(profile_env).get("API_SERVER_KEY", "")
        if not api_key:
            raise HTTPException(status_code=500, detail="Hermes profile API key missing")
        return str(user["hermes_base_url"]).rstrip("/"), api_key
    base_url = env("WEB_GATEWAY_HERMES_BASE_URL", f"http://127.0.0.1:{env('API_SERVER_PORT', '8650')}/v1")
    api_key = env("API_SERVER_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API_SERVER_KEY missing")
    return base_url.rstrip("/"), api_key


async def call_hermes(messages: list[dict[str, Any]], user: dict[str, Any] | None) -> dict[str, Any]:
    base_url, api_key = user_hermes_config(user)
    payload = build_hermes_payload(messages)
    async with httpx.AsyncClient(timeout=httpx.Timeout(180.0, connect=10.0)) as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json=payload,
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Hermes 返回错误：{response.status_code}")
    return response.json()


def extract_answer(payload: dict[str, Any]) -> str:
    if isinstance(payload.get("answer"), str):
        return str(payload["answer"])
    choices = payload.get("choices")
    if isinstance(choices, list) and choices:
        first = choices[0]
        if isinstance(first, dict):
            message = first.get("message")
            if isinstance(message, dict) and isinstance(message.get("content"), str):
                return message["content"]
    return "小雪宝暂时没有拿到有效回答，请稍后再试。"


def provision_profile_for_user(user_id: str) -> tuple[str | None, str | None]:
    if os.getenv("XIAOXUEBAO_DISABLE_PROFILE_PROVISION") == "1":
        return None, None
    try:
        next_port = 8651
        for item in db.list_users():
            if item["id"] == user_id:
                continue
        with db.connect() as conn:
            rows = conn.execute("SELECT hermes_base_url FROM users WHERE hermes_base_url IS NOT NULL").fetchall()
        used_ports = set()
        for row in rows:
            text = row["hermes_base_url"] or ""
            if ":" in text:
                try:
                    used_ports.add(int(text.rsplit(":", 1)[1].split("/", 1)[0]))
                except ValueError:
                    pass
        while next_port in used_ports:
            next_port += 1
        profile_id = user_id
        api_key = secrets.token_hex(32)
        profile_dir = ROOT_DIR / "profiles" / profile_id
        profile_dir.mkdir(parents=True, exist_ok=True)
        os.chmod(profile_dir, 0o700)
        profile_env = profile_dir / ".env"
        profile_env.write_text(
            "\n".join(
                [
                    "API_SERVER_ENABLED=true",
                    "API_SERVER_HOST=127.0.0.1",
                    f"API_SERVER_PORT={next_port}",
                    f"API_SERVER_KEY={api_key}",
                    f"API_SERVER_MODEL_NAME=小雪宝-Hermes-{profile_id}",
                    "OPENAI_API_KEY=${OPENAI_API_KEY}",
                    "XIAOXUEBAO_ABILITY_PACK=/ability-pack",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        os.chmod(profile_env, 0o600)
        subprocess.run(["docker", "exec", "hermes", "hermes", "profile", "create", profile_id], check=False, timeout=30)
        subprocess.run(["docker", "exec", "hermes", "hermes", "-p", profile_id, "gateway", "start"], check=False, timeout=30)
        return profile_id, f"http://127.0.0.1:{next_port}/v1"
    except Exception:
        return None, None


@app.on_event("startup")
async def on_startup() -> None:
    bootstrap_admin()


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "xiaoxuebao-web-gateway"}


@app.post("/api/auth/login")
async def login(request: LoginRequest, response: Response) -> dict[str, Any]:
    user = db.authenticate(request.identifier.strip(), request.password)
    if not user:
        raise HTTPException(status_code=401, detail="账号或密码错误")
    response.set_cookie(
        COOKIE_NAME,
        create_session(user),
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=7 * 24 * 3600,
        path="/",
    )
    return public_user(user)


@app.post("/api/auth/logout", status_code=204)
async def logout(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/")


@app.get("/api/auth/me")
async def me(xxb_session: str | None = Cookie(default=None)) -> dict[str, Any] | None:
    user = current_user(xxb_session)
    return public_user(user) if user else None


@app.post("/api/chat")
async def chat(request: ChatRequest, xxb_session: str | None = Cookie(default=None)) -> dict[str, Any]:
    user = current_user(xxb_session)
    if not request.messages:
        raise HTTPException(status_code=400, detail="消息不能为空")
    hermes_payload = await call_hermes(request.messages, user)
    answer = extract_answer(hermes_payload)
    question = next((str(item.get("content", "")).strip() for item in reversed(request.messages) if item.get("role") == "user"), "")
    topic = infer_topic(question)
    saved = False
    if user:
        db.add_history(user["id"], question, answer, topic)
        saved = True
    return {"answer": answer, "topic": topic, "saved": saved}


@app.get("/api/history")
async def history(xxb_session: str | None = Cookie(default=None)) -> list[dict[str, Any]]:
    user = require_user(xxb_session)
    return db.list_history(user["id"])


@app.get("/api/admin/users")
async def admin_users(xxb_session: str | None = Cookie(default=None)) -> list[dict[str, Any]]:
    require_admin(xxb_session)
    return db.list_users()


@app.post("/api/admin/users")
async def admin_create_user(request: CreateUserRequest, xxb_session: str | None = Cookie(default=None)) -> dict[str, Any]:
    require_admin(xxb_session)
    if db.get_user_by_phone(request.phone.strip()):
        raise HTTPException(status_code=409, detail="账号已存在")
    temp_user = db.create_user(request.phone.strip(), request.password, request.name.strip(), request.role)
    profile_id, hermes_base_url = provision_profile_for_user(temp_user["id"])
    if profile_id and hermes_base_url:
        with db.connect() as conn:
            conn.execute(
                "UPDATE users SET profile_id = ?, hermes_base_url = ? WHERE id = ?",
                (profile_id, hermes_base_url, temp_user["id"]),
            )
    users = [user for user in db.list_users() if user["id"] == temp_user["id"]]
    return users[0]


@app.patch("/api/admin/users/{user_id}/status")
async def admin_set_user_status(
    user_id: str,
    request: StatusRequest,
    xxb_session: str | None = Cookie(default=None),
) -> dict[str, Any]:
    require_admin(xxb_session)
    try:
        user = db.set_user_status(user_id, request.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="状态不合法") from None
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@app.get("/api/admin/history")
async def admin_history(xxb_session: str | None = Cookie(default=None)) -> list[dict[str, Any]]:
    require_admin(xxb_session)
    return db.list_all_history()


@app.get("/api/admin/stats")
async def admin_stats(xxb_session: str | None = Cookie(default=None)) -> dict[str, Any]:
    require_admin(xxb_session)
    return db.stats()
