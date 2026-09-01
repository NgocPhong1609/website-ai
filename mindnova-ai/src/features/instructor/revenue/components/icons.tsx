import React from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  Download,
  Wallet,
  TrendingUp,
  Clock,
  Users,
  Info,
  ChevronDown,
  Filter,
  CheckCircle,
  Landmark,
  ShieldCheck,
  BarChart2,
  Brain,
  Code,
  PieChart,
  Sparkles,
  DollarSign,
  Calendar,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  Pencil,
  ArrowRight,
  BookOpen,
  LucideProps,
} from "lucide-react";

type IconProps = {
  size?: number;
  className?: string;
} & LucideProps;

export function SearchIcon({ size = 15, ...props }: IconProps) {
  return <Search size={size} {...props} />;
}

export function BellIcon({ size = 18, ...props }: IconProps) {
  return <Bell size={size} {...props} />;
}

export function MessageIcon({ size = 18, ...props }: IconProps) {
  return <MessageSquare size={size} {...props} />;
}

export function SettingsIcon({ size = 18, ...props }: IconProps) {
  return <Settings size={size} {...props} />;
}

export function DownloadIcon({ size = 14, ...props }: IconProps) {
  return <Download size={size} {...props} />;
}

export function WalletIcon({ size = 14, ...props }: IconProps) {
  return <Wallet size={size} {...props} />;
}

export function TrendUpIcon({ size = 12, ...props }: IconProps) {
  return <TrendingUp size={size} {...props} />;
}

export function ClockIcon({ size = 12, ...props }: IconProps) {
  return <Clock size={size} {...props} />;
}

export function UsersIcon({ size = 12, ...props }: IconProps) {
  return <Users size={size} {...props} />;
}

export function InfoCircleIcon({ size = 12, ...props }: IconProps) {
  return <Info size={size} {...props} />;
}

export function ChevronDownIcon({ size = 12, ...props }: IconProps) {
  return <ChevronDown size={size} {...props} />;
}

export function FilterIcon({ size = 14, ...props }: IconProps) {
  return <Filter size={size} {...props} />;
}

export function CheckCircleIcon({ size = 16, ...props }: IconProps) {
  return <CheckCircle size={size} {...props} />;
}

export function BuildingBankIcon({ size = 16, ...props }: IconProps) {
  return <Landmark size={size} {...props} />;
}

export function ShieldCheckIcon({ size = 14, ...props }: IconProps) {
  return <ShieldCheck size={size} {...props} />;
}

export function BarChartIcon({ size = 14, ...props }: IconProps) {
  return <BarChart2 size={size} {...props} />;
}

export function BrainIcon({ size = 14, ...props }: IconProps) {
  return <Brain size={size} {...props} />;
}

export function CodeIcon({ size = 14, ...props }: IconProps) {
  return <Code size={size} {...props} />;
}

export function PieChartIcon({ size = 14, ...props }: IconProps) {
  return <PieChart size={size} {...props} />;
}

export function SparklesIcon({ size = 14, ...props }: IconProps) {
  return <Sparkles size={size} {...props} />;
}

export function DollarSignIcon({ size = 20, ...props }: IconProps) {
  return <DollarSign size={size} {...props} />;
}

export function CalendarIcon({ size = 14, ...props }: IconProps) {
  return <Calendar size={size} {...props} />;
}

export function GridIcon({ size = 16, ...props }: IconProps) {
  return <Grid size={size} {...props} />;
}

export function ChevronLeftIcon({ size = 12, ...props }: IconProps) {
  return <ChevronLeft size={size} {...props} />;
}

export function ChevronRightIcon({ size = 12, ...props }: IconProps) {
  return <ChevronRight size={size} {...props} />;
}

export function TrendRightIcon({ size = 12, ...props }: IconProps) {
  return <TrendingUp size={size} {...props} />;
}

export function XIcon({ size = 16, ...props }: IconProps) {
  return <X size={size} {...props} />;
}

export function LockIcon({ size = 14, ...props }: IconProps) {
  return <Lock size={size} {...props} />;
}

export function PencilIcon({ size = 14, ...props }: IconProps) {
  return <Pencil size={size} {...props} />;
}

export function ArrowRightIcon({ size = 14, ...props }: IconProps) {
  return <ArrowRight size={size} {...props} />;
}

export function BookOpenIcon({ size = 14, ...props }: IconProps) {
  return <BookOpen size={size} {...props} />;
}