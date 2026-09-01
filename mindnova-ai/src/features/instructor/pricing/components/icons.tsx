import React from "react";
import {
  Sparkles,
  Save,
  Tag,
  PlusCircle,
  Pencil,
  Trash2,
  TrendingUp,
  Info,
  Gift,
  Check,
  ChevronRight,
  CreditCard,
  Zap,
  X,
  CheckCircle,
  LucideProps,
} from "lucide-react";

export function SparklesIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Sparkles size={size} {...props} />;
}

export function SaveIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Save size={size} {...props} />;
}

export function TagIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <Tag size={size} {...props} />;
}

export function PlusCircleIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <PlusCircle size={size} {...props} />;
}

export function PencilIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Pencil size={size} {...props} />;
}

export function TrashIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Trash2 size={size} {...props} />;
}

export function TrendUpIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <TrendingUp size={size} {...props} />;
}

export function InfoIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Info size={size} {...props} />;
}

export function GiftIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <Gift size={size} {...props} />;
}

export function CheckIcon({ size = 13, ...props }: { size?: number } & LucideProps) {
  return <Check size={size} {...props} />;
}

export function ChevronRightIcon({ size = 14, ...props }: { size?: number } & LucideProps) {
  return <ChevronRight size={size} {...props} />;
}

export function FreeIcon({ size = 22, ...props }: { size?: number } & LucideProps) {
  return <Gift size={size} {...props} />;
}

export function PaidIcon({ size = 22, ...props }: { size?: number } & LucideProps) {
  return <CreditCard size={size} {...props} />;
}

export function SubscribeIcon({ size = 22, ...props }: { size?: number } & LucideProps) {
  return <Zap size={size} {...props} />;
}

export function XIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <X size={size} {...props} />;
}

export function CheckCircleIcon({ size = 16, ...props }: { size?: number } & LucideProps) {
  return <CheckCircle size={size} {...props} />;
}