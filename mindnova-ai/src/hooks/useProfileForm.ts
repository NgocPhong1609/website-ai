"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationResult {
  isValid: boolean;
  error: string;
}

interface UseProfileFormReturn {
  fullName: string;
  phone: string;
  bio: string;
  errors: { fullName?: string; phone?: string; bio?: string };
  isDirty: boolean;
  isSaved: boolean;
  setFullName: (v: string) => void;
  setPhone: (v: string) => void;
  setBio: (v: string) => void;
  handleSave: () => void;
  handleDiscard: () => void;
}

// ─── XSS Prevention ───────────────────────────────────────────────────────────
// Strips characters commonly used in XSS attacks from user input.

function sanitizeXSS(input: string): string {
  return input.replace(/[<>"'`=\/\\]/g, "");
}

// ─── Validators ───────────────────────────────────────────────────────────────

function validateFullName(name: string): ValidationResult {
  const sanitized = sanitizeXSS(name);
  if (sanitized !== name) {
    return { isValid: false, error: "Name contains invalid special characters." };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters." };
  }
  if (name.trim().length > 80) {
    return { isValid: false, error: "Name must be under 80 characters." };
  }
  return { isValid: true, error: "" };
}

function validatePhone(phone: string): ValidationResult {
  if (phone.trim() === "") return { isValid: true, error: "" }; // optional field
  const sanitized = sanitizeXSS(phone);
  if (sanitized !== phone) {
    return { isValid: false, error: "Phone number contains invalid characters." };
  }
  // Allow digits, +, -, spaces, parentheses only
  const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: "Phone must contain only digits, +, -, spaces (7–15 chars)." };
  }
  return { isValid: true, error: "" };
}

function validateBio(bio: string): ValidationResult {
  if (bio.length > 500) {
    return { isValid: false, error: "Bio must be under 500 characters." };
  }
  return { isValid: true, error: "" };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfileForm(initial: {
  fullName: string;
  phone: string;
  bio: string;
}): UseProfileFormReturn {
  const [fullName, setFullNameRaw] = useState(initial.fullName);
  const [phone, setPhoneRaw] = useState(initial.phone);
  const [bio, setBio] = useState(initial.bio);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; bio?: string }>({});

  const isDirty =
    fullName !== initial.fullName ||
    phone !== initial.phone ||
    bio !== initial.bio;

  const setFullName = useCallback((v: string) => {
    setFullNameRaw(v);
    const result = validateFullName(v);
    setErrors((prev) => ({ ...prev, fullName: result.error || undefined }));
  }, []);

  const setPhone = useCallback((v: string) => {
    setPhoneRaw(v);
    const result = validatePhone(v);
    setErrors((prev) => ({ ...prev, phone: result.error || undefined }));
  }, []);

  const handleSave = useCallback(() => {
    const nameResult = validateFullName(fullName);
    const phoneResult = validatePhone(phone);
    const bioResult = validateBio(bio);

    const newErrors: { fullName?: string; phone?: string; bio?: string } = {};
    if (!nameResult.isValid) newErrors.fullName = nameResult.error;
    if (!phoneResult.isValid) newErrors.phone = phoneResult.error;
    if (!bioResult.isValid) newErrors.bio = bioResult.error;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // In production: PATCH /api/profile with sanitized payload
    console.info("[Profile] Saving profile:", { fullName, phone, bio });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  }, [fullName, phone, bio]);

  const handleDiscard = useCallback(() => {
    setFullNameRaw(initial.fullName);
    setPhoneRaw(initial.phone);
    setBio(initial.bio);
    setErrors({});
  }, [initial]);

  return {
    fullName,
    phone,
    bio,
    errors,
    isDirty,
    isSaved,
    setFullName,
    setPhone,
    setBio,
    handleSave,
    handleDiscard,
  };
}
