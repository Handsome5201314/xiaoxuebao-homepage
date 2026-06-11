import tempfile
import unittest
from pathlib import Path

from app import Database, build_hermes_payload


class GatewayDatabaseTests(unittest.TestCase):
    def test_database_does_not_store_hermes_api_keys(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            db = Database(Path(tmp) / "xiaoxuebao.db")

            with db.connect() as conn:
                columns = [row["name"] for row in conn.execute("PRAGMA table_info(users)").fetchall()]

            self.assertNotIn("hermes_api_key", columns)

    def test_history_is_isolated_by_user_id(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            db = Database(Path(tmp) / "xiaoxuebao.db")
            user_a = db.create_user("13800000001", "pw-a", "用户A", "家长")
            user_b = db.create_user("13800000002", "pw-b", "用户B", "家长")

            db.add_history(user_a["id"], "A 的问题", "A 的回答", "护理")
            db.add_history(user_b["id"], "B 的问题", "B 的回答", "饮食")

            self.assertEqual(
                [item["question"] for item in db.list_history(user_a["id"])],
                ["A 的问题"],
            )

    def test_hermes_payload_uses_ordered_chat_messages(self) -> None:
        payload = build_hermes_payload(
            [
                {"role": "assistant", "content": "你好"},
                {"role": "user", "content": "发烧怎么办？"},
            ]
        )

        self.assertEqual(payload["model"], "xiaoxuebao-web")
        self.assertEqual(
            payload["messages"],
            [
                {"role": "assistant", "content": "你好"},
                {"role": "user", "content": "发烧怎么办？"},
            ],
        )


if __name__ == "__main__":
    unittest.main()
