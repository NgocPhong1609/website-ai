import React from "react";
import {
  Image as LucideImage,
  PlusCircle,
  Sparkles,
  Plus,
  ArrowRight,
  HelpCircle,
  Bell,
  Check,
  Save,
  BookOpen,
  ChevronDown,
  Bot,
  X,
  Eye,
  Trash2,
  Tag,
  Settings,
  FileEdit,
  Upload,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  LucideProps,
} from "lucide-react";

export function ImageIcon({ size = 32, ...props }: { size?: number } & LucideProps) {
  return <LucideImage size={size} {...props} />;
}

export function PlusCircleIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <PlusCircle size={size} {...props} />;
}

export function SparklesIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function PlusIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Plus size={size} {...props} />;
}

export function ArrowRightIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <ArrowRight size={size} {...props} />;
}

export function HelpCircleIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <HelpCircle size={size} {...props} />;
}

export function BellIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <Bell size={size} {...props} />;
}

export function CheckIcon({ size = 12, ...props }: { size?: number } & LucideProps) {
  return <Check size={size} {...props} />;
}

export function SaveIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Save size={size} {...props} />;
}

export function BookOpenIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <BookOpen size={size} {...props} />;
}

export function ChevronDownIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <ChevronDown size={size} {...props} />;
}

export function RobotIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Bot size={size} {...props} />;
}

export function XIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <X size={size} {...props} />;
}

export function EyeIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Eye size={size} {...props} />;
}

export function TrashIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Trash2 size={size} {...props} />;
}

export function TagIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Tag size={size} {...props} />;
}

export function SettingsIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Settings size={size} {...props} />;
}

export function FileEditIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <FileEdit size={size} {...props} />;
}

export function UploadIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Upload size={size} {...props} />;
}

export function ArrowLeftIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <ArrowLeft size={size} {...props} />;
}

export function CheckCircleIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <CheckCircle size={size} {...props} />;
}

export function PlayCircleIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <PlayCircle size={size} {...props} />;
}