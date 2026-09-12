/**
 * Canonical MindNova color tokens, sourced from the student theme in globals.css.
 * Admin, instructor, and remaining student surfaces must reuse these values.
 */
export const palette = {
  primary: "#3B82F6",
  primaryHover: "#2563EB",
  primaryDeep: "#1D4ED8",
  primarySoft: "#EFF6FF",
  primaryTint: "#DBEAFE",
  primaryMid: "#60A5FA",
  bgBase: "#F8FAFC",
  bgSurface: "#FFFFFF",
  borderSubtle: "#F1F5F9",
  borderDefault: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  success: "#10B981",
  successSoft: "#ECFDF5",
  warning: "#F59E0B",
  warningSoft: "#FFFBEB",
} as const;

/** Brand reds from the old TeacherColor theme. Must not appear in product UI. */
export const forbiddenBrandReds = [
  "#C0392B",
  "#A93226",
  "#A02C20",
  "#FADBD8",
  "#E11D48",
] as const;
