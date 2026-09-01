import React from "react";
import {
  Search,
  Bell,
  Settings,
  ArrowLeft,
  Archive,
  MoreHorizontal,
  File,
  Bold,
  Italic,
  Code,
  Link as LucideLink,
  Image as LucideImage,
  Paperclip,
  AtSign,
  Smile,
  Sparkles,
  Send,
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

export function SettingsIcon({ size = 18, ...props }: IconProps) {
  return <Settings size={size} {...props} />;
}

export function ArrowLeftIcon({ size = 14, ...props }: IconProps) {
  return <ArrowLeft size={size} {...props} />;
}

export function ArchiveIcon({ size = 14, ...props }: IconProps) {
  return <Archive size={size} {...props} />;
}

export function MoreHorizontalIcon({ size = 16, ...props }: IconProps) {
  return <MoreHorizontal size={size} {...props} />;
}

export function FileIcon({ size = 18, ...props }: IconProps) {
  return <File size={size} {...props} />;
}

export function BoldIcon(props: IconProps) {
  return <Bold size={14} {...props} />;
}

export function ItalicIcon(props: IconProps) {
  return <Italic size={14} {...props} />;
}

export function CodeIcon(props: IconProps) {
  return <Code size={14} {...props} />;
}

export function LinkIcon({ size = 13, ...props }: IconProps) {
  return <LucideLink size={size} {...props} />;
}

export function ImageIcon(props: IconProps) {
  return <LucideImage size={14} {...props} />;
}

export function PaperclipIcon(props: IconProps) {
  return <Paperclip size={14} {...props} />;
}

export function AtSignIcon(props: IconProps) {
  return <AtSign size={14} {...props} />;
}

export function SmileIcon(props: IconProps) {
  return <Smile size={14} {...props} />;
}

export function SparklesIcon({ size = 14, ...props }: IconProps) {
  return <Sparkles size={size} {...props} />;
}

export function SendIcon({ size = 14, ...props }: IconProps) {
  return <Send size={size} {...props} />;
}