"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  canSubmit: boolean;
  isSubmitting: boolean;
  setCurrentPw: (v: string) => void;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

// ─── Strength Analysis ────────────────────────────────────────────────────────

function analyzePassword(pw: string): { level: StrengthLevel; requirements: PasswordRequirement[] } {
  const hasMinLength = pw.length >= 8;
  const hasUppercase = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);

  const requirements: PasswordRequirement[] = [
    { label: "Minimum 8 characters", met: hasMinLength },
    { label: "At least 1 uppercase letter", met: hasUppercase },
    { label: "At least 1 number", met: hasNumber },
    { label: "At least 1 special character (!@#$%...)", met: hasSpecial },
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePasswordChange(): UsePasswordChangeReturn {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { level: strengthLevel, requirements } = analyzePassword(newPw);

  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = newPw === confirmPw;
  const mismatchError =
    confirmPw.length > 0 && !passwordsMatch ? "Passwords do not match." : "";

  const canSubmit =
    currentPw.length > 0 &&
    allRequirementsMet &&
    passwordsMatch &&
    confirmPw.length > 0 &&
    !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    // In production:
    // 1. POST /api/auth/change-password { currentPassword, newPassword }
    // 2. Server verifies currentPassword hash
    // 3. Server updates password hash
    // 4. Server invalidates ALL active JWT sessions (adds to token blocklist / rotates refresh tokens)
    // 5. Returns 200 OK
    console.info("[Security] Submitting password change. On success, server will invalidate all active sessions.");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setIsSubmitting(false);
    // Core Rule: Notify user all other sessions have been invalidated
    setSuccessMessage("Password updated. All other active sessions have been logged out for your security.");
    setTimeout(() => setSuccessMessage(""), 6000);
  }, [canSubmit]);

  return {
    currentPw,
    newPw,
    confirmPw,
    strengthLevel,
    requirements,
    mismatchError,
    successMessage,
    canSubmit,
    isSubmitting,
    setCurrentPw,
    setNewPw,
    setConfirmPw,
    handleSubmit,
  };
}
