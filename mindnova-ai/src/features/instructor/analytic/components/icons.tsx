import React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  Clock,
  Award,
  Sparkles,
  Mail,
  AlignLeft,
  ChevronDown,
  Brain,
  Database,
  Code,
  CheckCircle,
  LucideProps,
} from "lucide-react";

export function SearchIcon({ size = 15, ...props }: { size?: number } & LucideProps) {
  return <Search size={size} {...props} />;
}

export function BellIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <Bell size={size} {...props} />;
}

export function HelpCircleIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <HelpCircle size={size} {...props} />;
}

export function SettingsIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <Settings size={size} {...props} />;
}

export function ClockIcon({ size = 20, ...props }: { size?: number } & LucideProps) {
  return <Clock size={size} {...props} />;
}

export function AwardIcon({ size = 20, ...props }: { size?: number } & LucideProps) {
  return <Award size={size} {...props} />;
}

export function SparklesIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function MailIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Mail size={size} {...props} />;
}

export function AlignLeftIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <AlignLeft size={size} {...props} />;
}

export function ChevronDownIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronDown size={size} {...props} />;
}

export function BrainIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Brain size={size} {...props} />;
}

export function DatabaseIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Database size={size} {...props} />;
}

export function CodeIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Code size={size} {...props} />;
}

export function CheckCircleIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <CheckCircle size={size} {...props} />;
}