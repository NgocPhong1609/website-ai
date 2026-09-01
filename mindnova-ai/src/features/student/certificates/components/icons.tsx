import React from "react";
import {
  Upload,
  Share2,
  PartyPopper,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Timer,
  Award,
  LucideProps,
} from "lucide-react";

export function UploadIcon(props: LucideProps) {
  return <Upload size={16} {...props} />;
}

export function ShareIcon(props: LucideProps) {
  return <Share2 size={16} {...props} />;
}

export function PartyPopperIcon(props: LucideProps) {
  return <PartyPopper size={16} {...props} />;
}

export function ArrowRightIcon(props: LucideProps) {
  return <ArrowRight size={16} {...props} />;
}

export function VerifiedBadgeIcon(props: LucideProps) {
  return <CheckCircle size={16} {...props} />;
}

export function GraduationCapIcon(props: LucideProps) {
  return <GraduationCap size={16} {...props} />;
}

export function StopwatchIcon(props: LucideProps) {
  return <Timer size={16} {...props} />;
}

export function MedalIcon(props: LucideProps) {
  return <Award size={16} {...props} />;
}
