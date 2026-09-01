import React from "react";
import {
  Plus,
  Trash2,
  Download,
  Filter,
  ChevronDown,
  Shield,
  Lock,
  Sparkles,
  RefreshCw,
  LucideProps,
} from "lucide-react";

export function PlusIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Plus size={size} {...props} />;
}

export function TrashIcon({ size = 15, ...props }: { size?: number } & LucideProps) {
  return <Trash2 size={size} {...props} />;
}

export function DownloadIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Download size={size} {...props} />;
}

export function FilterIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Filter size={size} {...props} />;
}

export function ChevronDownIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronDown size={size} {...props} />;
}

export function ShieldIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Shield size={size} {...props} />;
}

export function LockIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Lock size={size} {...props} />;
}

export function SparkleIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function RefreshIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <RefreshCw size={size} {...props} />;
}

export function ChevronDownSmall(props: LucideProps) {
  return <ChevronDown size={12} {...props} />;
}
