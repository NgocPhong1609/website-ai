"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IStudentProfile } from "@/src/types/student";

interface ValidationResult {
  isValid: boolean;
  error: string;
}

interface UseProfileFormReturn {
  fullName: string;
  phone: string;
  bio: string;
  email: string;
  errors: { fullName?: string; phone?: string; bio?: string };
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isSaved: boolean;
  saveError: string | null;
  setFullName: (v: string) => void;
  setPhone: (v: string) => void;
  setBio: (v: string) => void;
  handleSave: () => void;
  handleDiscard: () => void;
}

// ─── XSS Prevention ───────────────────────────────────────────────────────────
// Strips characters commonly used in XSS attacks from personal user input.
function sanitizeXSS(input: string): string {
  return input.replace(/[<>"'`=\/\\]/g, "");
}

// ─── Validators ───────────────────────────────────────────────────────────────
function validateFullName(name: string): ValidationResult {
  const sanitized = sanitizeXSS(name);
  if (sanitized !== name) {
    return { isValid: false, error: "Name contains illegal XSS special characters (<, >, \", ', ;, /)." };
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
  if (phone.trim() === "") return { isValid: true, error: "" };
  const sanitized = sanitizeXSS(phone);
  if (sanitized !== phone) {
    return { isValid: false, error: "Phone number contains invalid XSS characters." };
  }
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

// ─── Mock API Fetcher & Mutator via TanStack React Query ──────────────────────
const MOCK_PROFILE: IStudentProfile = {
  id: "std_01HNG",
  email: "student.dev@mindnova.ai",
  fullName: "Nguyên Văn Sinh",
  phone: "+84 987 654 321",
  bio: "Fullstack AI developer specializing in Next.js 16 and Agentic LLM integrations.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
  enrolledCoursesCount: 8,
  completedCoursesCount: 5,
};

async function fetchStudentProfile(): Promise<IStudentProfile> {
  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulated network latency
  return MOCK_PROFILE;
}

async function updateStudentProfile(updated: Partial<IStudentProfile>): Promise<IStudentProfile> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  Object.assign(MOCK_PROFILE, updated);
  return MOCK_PROFILE;
}

export function useProfileForm(fallbackInitial?: {
  fullName: string;
  phone: string;
  bio: string;
}): UseProfileFormReturn {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error: fetchError } = useQuery<IStudentProfile>({
    queryKey: ["student-profile"],
    queryFn: fetchStudentProfile,
  });

  const initialName = profile?.fullName ?? fallbackInitial?.fullName ?? "";
  const initialPhone = profile?.phone ?? fallbackInitial?.phone ?? "";
  const initialBio = profile?.bio ?? fallbackInitial?.bio ?? "";
  const email = profile?.email ?? "student.dev@mindnova.ai";

  const [fullName, setFullNameRaw] = useState(initialName);
  const [phone, setPhoneRaw] = useState(initialPhone);
  const [bio, setBioRaw] = useState(initialBio);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; bio?: string }>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullNameRaw(profile.fullName);
      setPhoneRaw(profile.phone);
      setBioRaw(profile.bio);
    }
  }, [profile]);

  const isDirty =
    fullName !== initialName ||
    phone !== initialPhone ||
    bio !== initialBio;

  const setFullName = useCallback((v: string) => {
    setFullNameRaw(v);
    setIsSaved(false);
    const result = validateFullName(v);
    setErrors((prev) => ({ ...prev, fullName: result.error || undefined }));
  }, []);

  const setPhone = useCallback((v: string) => {
    setPhoneRaw(v);
    setIsSaved(false);
    const result = validatePhone(v);
    setErrors((prev) => ({ ...prev, phone: result.error || undefined }));
  }, []);

  const setBio = useCallback((v: string) => {
    setBioRaw(v);
    setIsSaved(false);
    const result = validateBio(v);
    setErrors((prev) => ({ ...prev, bio: result.error || undefined }));
  }, []);

  const mutation = useMutation<IStudentProfile, Error, Partial<IStudentProfile>>({
    mutationFn: updateStudentProfile,
    onSuccess: (newData) => {
      queryClient.setQueryData(["student-profile"], newData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 5000);
    },
  });

  const handleSave = useCallback(() => {
    if (Object.values(errors).some((err) => !!err) || !isDirty) return;
    mutation.mutate({ fullName: sanitizeXSS(fullName), phone: sanitizeXSS(phone), bio });
  }, [errors, isDirty, fullName, phone, bio, mutation]);

  const handleDiscard = useCallback(() => {
    setFullNameRaw(initialName);
    setPhoneRaw(initialPhone);
    setBioRaw(initialBio);
    setErrors({});
    setIsSaved(false);
  }, [initialName, initialPhone, initialBio]);

  return {
    fullName,
    phone,
    bio,
    email,
    errors,
    isDirty,
    isLoading,
    isSaving: mutation.isPending,
    isSaved,
    saveError: mutation.error?.message ?? fetchError?.message ?? null,
    setFullName,
    setPhone,
    setBio,
    handleSave,
    handleDiscard,
  };
}
