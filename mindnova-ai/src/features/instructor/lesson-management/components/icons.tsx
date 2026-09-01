import React from "react";
import {
  GripVertical,
  Video,
  FileText,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Plus,
  PlusCircle,
  Clock,
  Sparkles,
  Eye,
  Layers,
  Filter,
  ArrowUpDown,
  MessageCircle,
  Search,
  Bell,
  HelpCircle,
  LucideProps,
} from "lucide-react";

export function GripIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <GripVertical size={size} {...props} />;
}

export function VideoIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Video size={size} {...props} />;
}

export function DocumentIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <FileText size={size} {...props} />;
}

export function PencilIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Pencil size={size} {...props} />;
}

export function TrashIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Trash2 size={size} {...props} />;
}

export function ChevronUpIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronUp size={size} {...props} />;
}

export function ChevronDownIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronDown size={size} {...props} />;
}

export function ChevronLeftIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronLeft size={size} {...props} />;
}

export function PlusIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Plus size={size} {...props} />;
}

export function PlusCircleIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <PlusCircle size={size} {...props} />;
}

export function ClockIcon({ size = 12, ...props }: { size?: number } & LucideProps) {
  return <Clock size={size} {...props} />;
}

export function SparklesIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function EyeIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Eye size={size} {...props} />;
}

export function LayersIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Layers size={size} {...props} />;
}

export function FilterIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Filter size={size} {...props} />;
}

export function SortIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ArrowUpDown size={size} {...props} />;
}

export function MessageCircleIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <MessageCircle size={size} {...props} />;
}

export function SearchIcon({ size = 15, ...props }: { size?: number } & LucideProps) {
  return <Search size={size} {...props} />;
}

export function BellIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <Bell size={size} {...props} />;
}

export function HelpCircleIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <HelpCircle size={size} {...props} />;
}