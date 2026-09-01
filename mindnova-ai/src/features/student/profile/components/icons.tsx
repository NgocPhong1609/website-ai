import React from "react";
import {
  User,
  Shield,
  Settings,
  Check,
  Sparkles,
  Monitor,
  Trash2,
  LucideProps,
} from "lucide-react";

export function PersonalInfoIcon(props: LucideProps) {
  return <User size={16} {...props} />;
}

export function SecurityIcon(props: LucideProps) {
  return <Shield size={16} {...props} />;
}

export function SettingsIcon(props: LucideProps) {
  return <Settings size={16} {...props} />;
}

export function CheckIcon(props: LucideProps) {
  return <Check size={16} {...props} />;
}

export function SparkleIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function MonitorIcon(props: LucideProps) {
  return <Monitor size={16} {...props} />;
}

export function TrashIcon(props: LucideProps) {
  return <Trash2 size={16} {...props} />;
}
