import React from "react";
import {
  Lightbulb,
  History,
  FileText,
  PlayCircle,
  Upload,
  MoreVertical,
  Sparkles,
  Bot,
  Send,
  LucideProps,
} from "lucide-react";

export function LightbulbIcon(props: LucideProps) {
  return <Lightbulb size={16} {...props} />;
}

export function HistoryIcon(props: LucideProps) {
  return <History size={16} {...props} />;
}

export function FileTextIcon(props: LucideProps) {
  return <FileText size={16} {...props} />;
}

export function PlayCircleIcon(props: LucideProps) {
  return <PlayCircle size={16} {...props} />;
}

export function UploadIcon(props: LucideProps) {
  return <Upload size={16} {...props} />;
}

export function MoreVerticalIcon(props: LucideProps) {
  return <MoreVertical size={16} {...props} />;
}

export function SparklesIcon(props: LucideProps) {
  return <Sparkles size={16} {...props} />;
}

export function RobotIcon(props: LucideProps) {
  return <Bot size={16} {...props} />;
}

export function SendIcon(props: LucideProps) {
  return <Send size={16} {...props} />;
}
