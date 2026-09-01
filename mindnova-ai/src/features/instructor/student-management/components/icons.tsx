import React from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Download,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Plus,
  Filter,
  LucideProps,
} from "lucide-react";

export function SearchIcon({ size = 15, ...props }: { size?: number } & LucideProps) {
  return <Search size={size} {...props} />;
}

export function BellIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <Bell size={size} {...props} />;
}

export function MessageIcon({ size = 18, ...props }: { size?: number } & LucideProps) {
  return <MessageSquare size={size} {...props} />;
}

export function DownloadIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Download size={size} {...props} />;
}

export function SparklesIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function ChevronDownIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <ChevronDown size={size} {...props} />;
}

export function ChevronLeftIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronLeft size={size} {...props} />;
}

export function ChevronRightIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronRight size={size} {...props} />;
}

export function TrendUpIcon({ size = 12, ...props }: { size?: number } & LucideProps) {
  return <TrendingUp size={size} {...props} />;
}

export function PlusIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Plus size={size} {...props} />;
}

export function FilterIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Filter size={size} {...props} />;
}