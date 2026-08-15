"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export default function LoginContainer() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main
      className="w-full bg-white"
      style={{ minHeight: "100dvh", height: "100dvh" }}
    >
      <div
        className="relative w-full h-full max-w-[640px] mx-auto"
        style={{ perspective: "1200px" }}
      >
        <div
          className="w-full h-full grid transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front (Login) */}
          <div
            className={`[grid-area:1/1] w-full h-full flex flex-col transition-opacity duration-700 ${
              isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              zIndex: isFlipped ? 0 : 1,
            }}
          >
            <LoginForm onFlipToRegister={() => setIsFlipped(true)} />
          </div>

          {/* Back (Register) */}
          <div
            className={`[grid-area:1/1] w-full h-full flex flex-col transition-opacity duration-700 ${
              !isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              zIndex: !isFlipped ? 0 : 1,
            }}
          >
            <RegisterForm onFlipToLogin={() => setIsFlipped(false)} />
          </div>
        </div>
      </div>
    </main>
  );
}
