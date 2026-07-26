"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { IPasswordChangePayload, IPasswordChangeResult } from "@/types/student";

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface UsePasswordChangeReturn {
  currentPw: string;
  newPw: string;
  confirmPw: string;
  strengthLevel: StrengthLevel;
  requirements: PasswordRequirement[];
  mismatchError: string;
  successMessage: string;
  errorMessage: string | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  setCurrentPw: (v: string) => void;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

function analyzePassword(pw: string): { level: StrengthLevel; requirements: PasswordRequirement[] } {
  const hasMinLength = pw.length >= 8;
  const hasUppercase = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);

  const requirements: PasswordRequirement[] = [
    { label: "Minimum 8 characters", met: hasMinLength },
    { label: "At least 1 uppercase letter", met: hasUppercase },
    { label: "At least 1 number", met: hasNumber },
    { label: "At least 1 special character (!@#$%^&*...)", met: hasSpecial },
  ];

  if (pw.length === 0) return { level: "empty", requirements };

  const metCount = requirements.filter((r) => r.met).length;
  const levelMap: Record<number, StrengthLevel> = {
    0: "weak",
    1: "weak",
    2: "fair",
    3: "good",
    4: "strong",
  };

  return { level: levelMap[metCount], requirements };
}

async function mockChangePasswordApi(payload: IPasswordChangePayload): Promise<IPasswordChangeResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Core Rule: Require correct current password simulation & invalidate all active sessions
  if (payload.currentPassword === "wrongpassword") {
    throw new Error("Current password verification failed. Please try again.");
  }
  return {
    success: true,
    message: "Password updated successfully! All active sessions on other devices have been automatically logged out.",
    sessionsInvalidated: true,
  };
}

export function usePasswordChange(): UsePasswordChangeReturn {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { level: strengthLevel, requirements } = analyzePassword(newPw);

  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = newPw === confirmPw;
  const mismatchError =
    confirmPw.length > 0 && !passwordsMatch ? "New password and confirmation do not match." : "";

  const mutation = useMutation<IPasswordChangeResult, Error, IPasswordChangePayload>({
    mutationFn: mockChangePasswordApi,
    onSuccess: (res) => {
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setErrorMessage(null);
      setSuccessMessage(res.message);
      setTimeout(() => setSuccessMessage(""), 7000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "An error occurred during password change.");
    },
  });

  const canSubmit =
    currentPw.length > 0 &&
    allRequirementsMet &&
    passwordsMatch &&
    confirmPw.length > 0 &&
    !mutation.isPending;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSuccessMessage("");
    setErrorMessage(null);
    mutation.mutate({
      currentPassword: currentPw,
      newPassword: newPw,
      confirmPassword: confirmPw,
    });
  }, [canSubmit, currentPw, newPw, confirmPw, mutation]);

  return {
    currentPw,
    newPw,
    confirmPw,
    strengthLevel,
    requirements,
    mismatchError,
    successMessage,
    errorMessage,
    canSubmit,
    isSubmitting: mutation.isPending,
    setCurrentPw,
    setNewPw,
    setConfirmPw,
    handleSubmit,
  };
}
