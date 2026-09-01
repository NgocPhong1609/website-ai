import React from "react";
import {
  Sparkles,
  MessageSquare,
  Pencil,
  Plus,
  Upload,
  BookOpen,
  Layers,
  Tag,
  Clock,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Bot,
  DollarSign,
  Settings,
  HelpCircle,
  FileQuestion,
  LucideProps,
} from "lucide-react";

export function SparklesIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function DiscussionsNavIcon(props: LucideProps) {
  return <MessageSquare size={18} {...props} />;
}

export function PencilIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Pencil size={size} {...props} />;
}

export function PlusIcon({ size = 28, ...props }: { size?: number } & LucideProps) {
  return <Plus size={size} {...props} />;
}

export function UploadIcon(props: LucideProps) {
  return <Upload size={14} {...props} />;
}

export function BookOpenIcon(props: LucideProps) {
  return <BookOpen size={14} {...props} />;
}

export function LayersIcon(props: LucideProps) {
  return <Layers size={14} {...props} />;
}

export function TagIcon(props: LucideProps) {
  return <Tag size={14} {...props} />;
}

export function ClockIcon(props: LucideProps) {
  return <Clock size={14} {...props} />;
}

export function BellIcon(props: LucideProps) {
  return <Bell size={18} {...props} />;
}

export function MessageIcon(props: LucideProps) {
  return <MessageSquare size={18} {...props} />;
}

export function SearchIcon(props: LucideProps) {
  return <Search size={16} {...props} />;
}

export function ChevronLeftIcon(props: LucideProps) {
  return <ChevronLeft size={16} {...props} />;
}

export function ChevronRightIcon(props: LucideProps) {
  return <ChevronRight size={16} {...props} />;
}

export function TrendUpIcon(props: LucideProps) {
  return <TrendingUp size={14} {...props} />;
}

export function CourseManagementNavIcon(props: LucideProps) {
  return <BookOpen size={18} {...props} />;
}

export function StudentManagementNavIcon(props: LucideProps) {
  return <Users size={18} {...props} />;
}

export function AITeachingNavIcon(props: LucideProps) {
  return <Bot size={18} {...props} />;
}

export function RevenueNavIcon(props: LucideProps) {
  return <DollarSign size={18} {...props} />;
}

export function SettingsNavIcon(props: LucideProps) {
  return <Settings size={18} {...props} />;
}

export function HelpNavIcon(props: LucideProps) {
  return <HelpCircle size={18} {...props} />;
}

export function QuizNavIcon(props: LucideProps) {
  return <FileQuestion size={18} {...props} />;
}