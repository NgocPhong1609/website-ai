// Sparkle icon (4-pointed stars, similar to Gemini/AI sparkle)
function SparkleIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
    >
      {/* Large 4-pointed star */}
      <path
        d="M22 4 L24.5 19.5 L40 22 L24.5 24.5 L22 40 L19.5 24.5 L4 22 L19.5 19.5 Z"
        fill="#4648D4"
      />
      {/* Small satellite star */}
      <path
        d="M34 10 L35.2 14.8 L40 16 L35.2 17.2 L34 22 L32.8 17.2 L28 16 L32.8 14.8 Z"
        fill="#4648D4"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Concentric orbit animation with a pulsing center and rotating dots.
 * Purely decorative — no semantic meaning.
 */
export function OrbitAnimation() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 280, height: 280 }}
      aria-hidden="true"
    >
      {/* Outer ring — slow breathe + slow orbit wrapper */}
      <div
        className="absolute rounded-full border border-[#6B6BFF]/25 animate-ring-breathe-slow"
        style={{ width: 268, height: 268 }}
      >
        {/* Orbiting dot 1 */}
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: "9s" }}>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#4648D4]"
            style={{ boxShadow: "0 0 6px #4648D4" }}
          />
        </div>
        {/* Orbiting dot 2 — offset 180° */}
        <div
          className="absolute inset-0 animate-orbit"
          style={{ animationDuration: "9s", animationDelay: "-4.5s" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#6B6BFF]/60"
          />
        </div>
      </div>

      {/* Middle ring — breathe in sync */}
      <div
        className="absolute rounded-full bg-[#F0F0FF]/60 border border-[#6B6BFF]/20 animate-ring-breathe"
        style={{ width: 196, height: 196 }}
      />

      {/* Inner filled circle */}
      <div
        className="absolute rounded-full bg-[#EAEDFF] border border-[#6B6BFF]/20"
        style={{ width: 128, height: 128 }}
      />

      {/* Center: sparkle container */}
      <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-[#D8DAFF]/60">
        <SparkleIcon />
      </div>
    </div>
  );
}
