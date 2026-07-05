import type { Metadata } from "next";
import { LoginContainer } from "@/src/features/student/auth";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to MindNova AI and continue your personalized AI-powered learning journey.",
};

export default function LoginPage() {
  return <LoginContainer />;
}
