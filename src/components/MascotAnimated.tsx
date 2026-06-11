/**
 * 雪地版小雪宝 — SVG 动画角色
 * 包含：呼吸、眨眼、挥手、飘雪花、丝带微动等动画
 */
export default function MascotAnimated({ size = 260 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="小雪宝——穿恐龙帽的可爱角色，正在向你挥手"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Snow ground gradient */}
        <linearGradient id="snow-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDF2F7" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        {/* Body gradient */}
        <radialGradient id="body-grad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F4F8" />
        </radialGradient>
        {/* Ribbon gradient */}
        <linearGradient id="ribbon-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#E8943A" />
        </linearGradient>
        {/* Magnifying glass */}
        <radialGradient id="lens-grad" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="rgba(200,230,255,0.3)" />
          <stop offset="100%" stopColor="rgba(160,210,250,0.15)" />
        </radialGradient>
      </defs>

      <style>{`
        /* Breathing — gentle scale */
        @keyframes breathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.015) translateY(-2px); }
        }
        /* Blinking — eyes close periodically */
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        /* Waving — left arm rotates */
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(5deg); }
          75% { transform: rotate(-10deg); }
        }
        /* Ribbon sway */
        @keyframes ribbon-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        /* Snowflake fall */
        @keyframes snow-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.5; }
          100% { transform: translateY(380px) rotate(360deg); opacity: 0; }
        }
        /* Snowflake drift */
        @keyframes snow-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(15px); }
        }
        /* Cheek glow */
        @keyframes cheek-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.75; }
        }
        /* Magnifier shimmer */
        @keyframes lens-shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .mascot-body {
          animation: breathe 3.5s ease-in-out infinite;
          transform-origin: 200px 320px;
        }
        .mascot-eyes {
          animation: blink 4s ease-in-out infinite;
          transform-origin: 200px 170px;
        }
        .mascot-wave-arm {
          animation: wave 2.5s ease-in-out infinite;
          transform-origin: 120px 240px;
        }
        .mascot-ribbon {
          animation: ribbon-sway 3s ease-in-out infinite;
          transform-origin: 200px 260px;
        }
        .mascot-cheek {
          animation: cheek-glow 3s ease-in-out infinite;
        }
        .snowflake {
          animation: snow-fall linear infinite, snow-drift ease-in-out infinite;
        }
        .lens-glint {
          animation: lens-shimmer 2.5s ease-in-out infinite;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .mascot-body,
          .mascot-eyes,
          .mascot-wave-arm,
          .mascot-ribbon,
          .mascot-cheek,
          .snowflake,
          .lens-glint {
            animation: none !important;
          }
        }
      `}</style>

      {/* === Snowflakes (background) === */}
      {[
        { x: 60, delay: 0, dur: 6, drift: 4, size: 4 },
        { x: 130, delay: 1.2, dur: 7, drift: 5, size: 3 },
        { x: 270, delay: 2.5, dur: 5.5, drift: 3.5, size: 5 },
        { x: 340, delay: 0.8, dur: 6.5, drift: 4.5, size: 3.5 },
        { x: 90, delay: 3.5, dur: 7.5, drift: 3, size: 2.5 },
        { x: 310, delay: 4, dur: 5, drift: 5, size: 3 },
        { x: 180, delay: 1.8, dur: 8, drift: 2.5, size: 2 },
        { x: 360, delay: 2.8, dur: 6, drift: 4, size: 2.5 },
      ].map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={0}
          r={s.size}
          fill="#BEE3F8"
          opacity="0"
          className="snowflake"
          style={{
            animationDelay: `${s.delay}s, ${s.delay + 0.3}s`,
            animationDuration: `${s.dur}s, ${s.drift}s`,
          }}
        />
      ))}

      {/* === Snow ground === */}
      <ellipse cx="200" cy="370" rx="160" ry="25" fill="url(#snow-ground)" opacity="0.6" />

      {/* === Main body group (breathing) === */}
      <g className="mascot-body">

        {/* --- Body --- */}
        <ellipse cx="200" cy="310" rx="75" ry="60" fill="url(#body-grad)" stroke="#CBD5E0" strokeWidth="1.5" />

        {/* --- Legs (small rounded) --- */}
        <ellipse cx="172" cy="362" rx="22" ry="12" fill="#F7FAFC" stroke="#CBD5E0" strokeWidth="1" />
        <ellipse cx="228" cy="362" rx="22" ry="12" fill="#F7FAFC" stroke="#CBD5E0" strokeWidth="1" />

        {/* --- Left arm (waving) --- */}
        <g className="mascot-wave-arm">
          <path
            d="M125 245 Q100 225 85 200 Q80 190 88 186 Q96 182 102 192 L120 225"
            fill="#F7FAFC"
            stroke="#CBD5E0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hand */}
          <circle cx="88" cy="188" r="10" fill="#F7FAFC" stroke="#CBD5E0" strokeWidth="1" />
        </g>

        {/* --- Right arm (holding magnifier) --- */}
        <path
          d="M275 245 Q300 230 310 215"
          fill="none"
          stroke="#CBD5E0"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M275 245 Q300 230 310 215"
          fill="none"
          stroke="#F7FAFC"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Magnifying glass */}
        <g filter="url(#soft-glow)">
          {/* Handle */}
          <line x1="318" y1="207" x2="340" y2="230" stroke="#A0AEC0" strokeWidth="5" strokeLinecap="round" />
          <line x1="318" y1="207" x2="340" y2="230" stroke="#CBD5E0" strokeWidth="3" strokeLinecap="round" />
          {/* Lens ring */}
          <circle cx="305" cy="192" r="22" fill="none" stroke="#A0AEC0" strokeWidth="4" />
          <circle cx="305" cy="192" r="22" fill="none" stroke="#CBD5E0" strokeWidth="2.5" />
          {/* Lens glass */}
          <circle cx="305" cy="192" r="18" fill="url(#lens-grad)" />
          {/* Lens glint */}
          <ellipse cx="298" cy="185" rx="5" ry="3" fill="white" opacity="0.5" className="lens-glint" />
          {/* Snowflake in lens */}
          <g transform="translate(305,192)" opacity="0.35">
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#5BA4D9" strokeWidth="1" />
            <line x1="-6" y1="-3.5" x2="6" y2="3.5" stroke="#5BA4D9" strokeWidth="1" />
            <line x1="-6" y1="3.5" x2="6" y2="-3.5" stroke="#5BA4D9" strokeWidth="1" />
          </g>
        </g>

        {/* --- Dinosaur Hood --- */}
        {/* Hood base (covers head) */}
        <path
          d="M130 200 Q125 140 145 110 Q165 80 200 75 Q235 80 255 110 Q275 140 270 200 Q265 215 250 220 L150 220 Q135 215 130 200Z"
          fill="#F0F4F8"
          stroke="#CBD5E0"
          strokeWidth="1.5"
        />

        {/* Hood top — dinosaur shape */}
        <path
          d="M160 110 Q155 85 165 70 Q175 58 190 60 L195 65 Q185 62 178 72 Q170 85 175 105 Z"
          fill="#E8943A"
          opacity="0.85"
        />
        <path
          d="M240 110 Q245 85 235 70 Q225 58 210 60 L205 65 Q215 62 222 72 Q230 85 225 105 Z"
          fill="#E8943A"
          opacity="0.85"
        />

        {/* Dino eyes on hood */}
        <circle cx="172" cy="95" r="10" fill="#F7FAFC" stroke="#CBD5E0" strokeWidth="1" />
        <circle cx="172" cy="95" r="5" fill="#5D4037" />
        <circle cx="170" cy="93" r="1.5" fill="white" />
        <circle cx="228" cy="95" r="10" fill="#F7FAFC" stroke="#CBD5E0" strokeWidth="1" />
        <circle cx="228" cy="95" r="5" fill="#5D4037" />
        <circle cx="226" cy="93" r="1.5" fill="white" />

        {/* Dino nose */}
        <ellipse cx="200" cy="103" rx="4" ry="3" fill="#333" />

        {/* Orange spots on hood */}
        <circle cx="150" cy="130" r="6" fill="#E8943A" opacity="0.6" />
        <circle cx="250" cy="130" r="6" fill="#E8943A" opacity="0.6" />
        <circle cx="145" cy="160" r="4" fill="#E8943A" opacity="0.45" />
        <circle cx="255" cy="160" r="4" fill="#E8943A" opacity="0.45" />

        {/* Dino spines on top */}
        <path d="M185 68 L190 55 L195 68" fill="#E8943A" opacity="0.7" />
        <path d="M195 65 L200 50 L205 65" fill="#E8943A" opacity="0.8" />
        <path d="M205 68 L210 55 L215 68" fill="#E8943A" opacity="0.7" />

        {/* --- Face (through hood opening) --- */}
        {/* Face area */}
        <ellipse cx="200" cy="175" rx="50" ry="45" fill="#FFF5F0" />

        {/* Eyes (blinking) */}
        <g className="mascot-eyes">
          {/* Left eye — winking */}
          <path
            d="M175 170 Q182 162 190 170"
            fill="none"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Right eye — open */}
          <ellipse cx="218" cy="168" rx="8" ry="9" fill="#2D3748" />
          <ellipse cx="216" cy="165" rx="3" ry="3.5" fill="white" />
        </g>

        {/* Rosy cheeks */}
        <circle cx="170" cy="182" r="10" fill="#FEB2B2" className="mascot-cheek" />
        <circle cx="230" cy="182" r="10" fill="#FEB2B2" className="mascot-cheek" />

        {/* Mouth — big happy smile */}
        <path
          d="M185 190 Q200 205 215 190"
          fill="none"
          stroke="#2D3748"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Tongue */}
        <ellipse cx="200" cy="196" rx="6" ry="4" fill="#FEB2B2" opacity="0.7" />

        {/* --- Orange Ribbon --- */}
        <g className="mascot-ribbon">
          {/* Ribbon loops */}
          <path
            d="M180 255 Q170 240 178 232 Q186 225 195 235 L200 245 L205 235 Q214 225 222 232 Q230 240 220 255"
            fill="url(#ribbon-grad)"
          />
          {/* Ribbon center knot */}
          <circle cx="200" cy="245" r="6" fill="#E8943A" />
          {/* Heart cutout (lighter center) */}
          <path
            d="M196 243 Q198 240 200 243 Q202 240 204 243 Q204 247 200 250 Q196 247 196 243Z"
            fill="#FFF3E0"
            opacity="0.7"
          />
          {/* Ribbon tails */}
          <path d="M188 255 L182 275 L192 265 Z" fill="#E8943A" opacity="0.8" />
          <path d="M212 255 L218 275 L208 265 Z" fill="#E8943A" opacity="0.8" />
        </g>

      </g>
    </svg>
  )
}
