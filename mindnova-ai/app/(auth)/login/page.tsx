import type { Metadata } from "next";
import { LoginContainer } from "@/src/features/student/auth";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to MindNova AI and continue your personalized AI-powered learning journey.",
};

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContainer />
    </Suspense>
  );
}
