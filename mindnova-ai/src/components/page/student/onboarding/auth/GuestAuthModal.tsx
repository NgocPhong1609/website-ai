"use client";

import { useState, useId, useCallback } from "react";
import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores/onboardingStore";
import type { IAuthModalProps } from "@/src/components/page/student/onboarding/types";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function GuestAuthModal({
  isOpen,
  onClose,
  defaultTab = "register",
  compellingReason = "Log in now to save your amazing learning progress and access AI unlimitedly!",
  onSuccess,
}: IAuthModalProps) {
  const emailId = useId();
  const passwordId = useId();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Real-time validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Brute-force simulation
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Forgot password OTP status
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAuth = useOnboardingStore((s) => s.setAuth);

  const validateEmailRealTime = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError("Email address is required.");
    } else if (!/^\S+@\S+\.\S+$/.test(val)) {
      setEmailError("Please enter a valid email address (e.g. name@example.com).");
    } else {
      setEmailError("");
    }
  };

  const validatePasswordRealTime = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordError("Password cannot be empty.");
      return;
    }
    if (activeTab === "register") {
      const hasUpperCase = /[A-Z]/.test(val);
      const hasLowerCase = /[a-z]/.test(val);
      const hasNumbers = /\d/.test(val);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/?.test(val);
      
      if (val.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else if (!hasUpperCase || !hasLowerCase) {
        setPasswordError("Must include both uppercase and lowercase characters.");
      } else if (!hasNumbers) {
        setPasswordError("Must include at least one numeric digit (0-9).");
      } else if (!hasSpecial) {
        setPasswordError("Must include at least one special character (!@#$%^&*...).");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  const handleGoogleLogin = useCallback(() => {
    setIsSubmitting(true);
    // Simulate OAuth 2.0 automatic linkage / account creation
    setTimeout(() => {
      setIsSubmitting(false);
      setAuth(true);
      onSuccess?.();
      onClose();
    }, 600);
  }, [setAuth, onSuccess, onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (activeTab === "forgot") {
      if (!email || emailError) {
        setEmailError("Please provide a valid email to receive OTP.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setOtpSent(true);
      }, 500);
      return;
    }

    // Run explicit check before submit
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!password || passwordError) {
      if (!passwordError) setPasswordError("Password is required.");
      return;
    }

    // Simulate login attempt with brute force detection
    if (activeTab === "login" && password !== "Admin@1234" && password.length < 6) {
      const newAttempts = attemptCount + 1;
      setAttemptCount(newAttempts);
      if (newAttempts >= 5) {
        setIsLocked(true);
        setPasswordError("Account & IP temporarily locked due to 5 failed attempts (Brute-force protection).");
      } else {
        setPasswordError(`Invalid credentials. Attempt ${newAttempts} of 5 before account lock.`);
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuth(true);
      onSuccess?.();
      onClose();
    }, 500);
  }, [activeTab, email, password, emailError, passwordError, isLocked, attemptCount, setAuth, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-gray-100 overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#6B6BFF] via-[#818CF8] to-[#00C2B3]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="p-7 sm:p-8 flex flex-col gap-6">
          {/* Header & Compelling Reason */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs">
              🚀
            </div>
            <h2 className="text-2xl font-black text-[#131B2E]">
              {activeTab === "register" ? "Create Free Account" : activeTab === "login" ? "Welcome Back to MindNova" : "Reset Your Password"}
            </h2>
            <p className="text-xs text-[#4648D4] font-bold bg-indigo-50/80 border border-indigo-200/60 rounded-xl p-2.5 max-w-sm leading-relaxed">
              ✨ {compellingReason}
            </p>
          </div>

          {activeTab !== "forgot" ? (
            <>
              {/* Prominent Google OAuth 2.0 Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isLocked}
                className="w-full py-3.5 px-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 font-bold text-sm text-gray-700 shadow-xs flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold my-1">
                <div className="flex-1 h-[1px] bg-gray-200" />
                <span>OR WITH EMAIL</span>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </div>

              {/* Form & Real-time Validation */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={emailId} className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => validateEmailRealTime(e.target.value)}
                    disabled={isLocked}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      emailError 
                        ? "border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-300 text-red-900" 
                        : "border-gray-300 focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20"
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs font-semibold animate-pulse">{emailError}</p>
                  )}
                </div>

                {/* Password Field with Eye Toggle & Complexity Validation */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={passwordId} className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    {activeTab === "login" && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("forgot")}
                        className="text-xs text-[#6B6BFF] hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id={passwordId}
                      type={showPassword ? "text" : "password"}
                      placeholder={activeTab === "register" ? "8+ chars (Uppercase, number, symbol)" : "Enter your password"}
                      value={password}
                      onChange={(e) => validatePasswordRealTime(e.target.value)}
                      disabled={isLocked}
                      className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm font-medium transition-all ${
                        passwordError
                          ? "border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-300 text-red-900"
                          : "border-gray-300 focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-xs font-semibold">{passwordError}</p>
                  )}
                </div>

                {/* Brute force lock alert */}
                {isLocked && (
                  <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                    <span>⚠️</span>
                    <span>Account temporarily locked due to excessive failed password attempts.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isLocked || !!emailError || !!passwordError || !email || !password}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                    isSubmitting || isLocked || !!emailError || !!passwordError || !email || !password
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                      : "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Authenticating..." : activeTab === "register" ? "Create Account & Bookmark Roadmap" : "Log In & Continue"}
                </button>
              </form>
            </>
          ) : (
            /* Forgot Password Flow */
            <div className="flex flex-col gap-4">
              {otpSent ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
                  <span className="text-3xl">📧</span>
                  <h3 className="font-bold text-emerald-900">OTP Sent via Email!</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    We sent a secure, time-limited reset link to <strong className="underline">{email}</strong>. This OTP is valid for exactly <strong>15 minutes</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setActiveTab("login"); }}
                    className="mt-2 px-6 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs hover:bg-emerald-100 transition-colors"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Enter the email associated with your account and we will send a 15-minute OTP and Password Reset Link to recover access.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={emailId} className="text-xs font-bold text-gray-700 uppercase">
                      Registered Email
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => validateEmailRealTime(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium ${
                        emailError ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {emailError && <p className="text-red-500 text-xs font-semibold">{emailError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#6B6BFF] hover:bg-[#5858E0] text-white font-bold text-sm shadow-md transition-all"
                  >
                    Send 15-Minute Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 text-center mt-1"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Switcher Tab Footer */}
          {activeTab !== "forgot" && (
            <div className="text-center border-t border-gray-100 pt-5 text-xs text-gray-600 font-medium">
              {activeTab === "register" ? (
                <>
                  Already have a MindNova account?{" "}
                  <button
                    type="button"
                    onClick={() => { setActiveTab("login"); setEmailError(""); setPasswordError(""); }}
                    className="font-bold text-[#6B6BFF] hover:underline"
                  >
                    Log In Here
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => { setActiveTab("register"); setEmailError(""); setPasswordError(""); }}
                    className="font-bold text-[#6B6BFF] hover:underline"
                  >
                    Register for Free
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
