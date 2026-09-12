import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === "dist" || entry === "scripts") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, acc);
      continue;
    }
    if (
      /\.(tsx|ts|css|jsx)$/.test(entry) &&
      !entry.endsWith(".test.ts") &&
      !entry.endsWith(".test.tsx") &&
      entry !== "palette.ts"
    ) {
      acc.push(full);
    }
  }
  return acc;
}

function restorePrefixes(text) {
  let next = text;

  next = next.replace(
    /-\[(#[0-9A-Fa-f]{6})\]\/15 -\[(#[0-9A-Fa-f]{6})\] -\[(#[0-9A-Fa-f]{6})\]\/30/g,
    "bg-[$1]/15 text-[$2] border-[$3]/30",
  );

  next = next.replace(
    /hover:-\[(#[0-9A-Fa-f]{6})\]( hover:bg-[^\s]+) hover:-\[(#[0-9A-Fa-f]{6})\]/g,
    "hover:border-[$1]$2 hover:text-[$3]",
  );

  next = next.replace(/focus:-\[(#[0-9A-Fa-f]{6})\]/g, "focus:border-[$1]");

  next = next.replace(/border -\[(#[0-9A-Fa-f]{6})\]/g, "border-[$1]");

  next = next.replace(
    /rounded-2xl -\[(#[0-9A-Fa-f]{6})\] via-sky-400 -\[(#[0-9A-Fa-f]{6})\]/g,
    "rounded-2xl bg-gradient-to-br from-[$1] via-sky-400 to-[$2]",
  );

  next = next.replace(
    /from-sky-500 -\[(#[0-9A-Fa-f]{6})\] -\[(#[0-9A-Fa-f]{6})\]/g,
    "from-sky-500 via-[$1] to-[$2]",
  );

  next = next.replace(
    /rounded-2xl -\[(#[0-9A-Fa-f]{6})\] -\[(#[0-9A-Fa-f]{6})\] px-/g,
    "rounded-2xl bg-gradient-to-r from-[$1] to-[$2] px-",
  );

  next = next.replace(
    /rounded-xl -\[(#[0-9A-Fa-f]{6})\] -\[(#[0-9A-Fa-f]{6})\] px-/g,
    "rounded-xl bg-gradient-to-r from-[$1] to-[$2] px-",
  );

  next = next.replace(
    /(rounded-(?:xl|2xl|full|lg)) -\[(#[0-9A-Fa-f]{6})\]( px-)/g,
    "$1 bg-[$2]$3",
  );

  next = next.replace(
    /(font-(?:semibold|bold|black|medium|extrabold)) -\[(#[0-9A-Fa-f]{6})\]/g,
    "$1 text-[$2]",
  );

  next = next.replace(
    /(tracking-\[[^\]]+\]|tracking-\S+) -\[(#[0-9A-Fa-f]{6})\](\/\d+)?/g,
    "$1 text-[$2]$3",
  );

  next = next.replace(
    /(ring-1 ring-\S+) -\[(#[0-9A-Fa-f]{6})\]/g,
    "$1 text-[$2]",
  );

  next = next.replace(
    /(bg-(?:emerald|cyan|teal|violet|indigo|sky|rose|amber)-\S+) -\[(#[0-9A-Fa-f]{6})\]/g,
    "$1 text-[$2]",
  );

  next = next.replace(
    /hover:-\[(#[0-9A-Fa-f]{6})\]/g,
    "hover:bg-[$1]",
  );

  next = next.replace(
    /(?<![a-zA-Z])-\[(#[0-9A-Fa-f]{6})\](\/\d+)?/g,
    (match, hex, opacity = "", offset, source) => {
      const before = source.slice(Math.max(0, offset - 24), offset);
      if (/(bg|text|border|from|to|via|ring|fill|stroke|outline|shadow)-$/.test(before)) {
        return match;
      }
      if (before.includes("text-white") || /rounded-|px-|py-|shadow-/.test(before.slice(-16))) {
        return `bg-[${hex}]${opacity}`;
      }
      return `text-[${hex}]${opacity}`;
    },
  );

  return next;
}

function mapHoverThenBrand(text) {
  let next = text;

  const hoverTargets = [
    "#C0392B",
    "#c0392b",
    "#A93226",
    "#a93226",
    "#A02C20",
    "#a02c20",
    "#383AB8",
    "#383ab8",
  ];
  for (const hex of hoverTargets) {
    next = next.replaceAll(`hover:bg-[${hex}]`, "hover:bg-[#2563EB]");
    next = next.replaceAll(`hover:text-[${hex}]`, "hover:text-[#2563EB]");
    next = next.replaceAll(`hover:border-[${hex}]`, "hover:border-[#2563EB]");
    next = next.replaceAll(`hover:from-[${hex}]`, "hover:from-[#2563EB]");
    next = next.replaceAll(`hover:to-[${hex}]`, "hover:to-[#1D4ED8]");
    next = next.replaceAll(`hover:via-[${hex}]`, "hover:via-[#2563EB]");
  }

  const replacements = [
    ["#C0392B", "#3B82F6"],
    ["#c0392b", "#3B82F6"],
    ["#A93226", "#2563EB"],
    ["#a93226", "#2563EB"],
    ["#A02C20", "#1D4ED8"],
    ["#a02c20", "#1D4ED8"],
    ["#FADBD8", "#EFF6FF"],
    ["#fadbd8", "#EFF6FF"],
    ["#E11D48", "#2563EB"],
    ["#e11d48", "#2563EB"],
    ["#383AB8", "#2563EB"],
    ["#383ab8", "#2563EB"],
    ["#0ea5e9", "#3b82f6"],
    ["#0EA5E9", "#3B82F6"],
    ["#0891b2", "#2563eb"],
    ["#0891B2", "#2563EB"],
    ["#FAF7F2", "#F8FAFC"],
    ["#faf7f2", "#F8FAFC"],
    ["#FEFCF9", "#F8FAFC"],
    ["#fefcf9", "#F8FAFC"],
    ["#F5F0E8", "#F1F5F9"],
    ["#f5f0e8", "#F1F5F9"],
    ["#E8E2D9", "#E2E8F0"],
    ["#e8e2d9", "#E2E8F0"],
    ["#8A8478", "#64748B"],
    ["#8a8478", "#64748B"],
    ["#B8B0A3", "#94A3B8"],
    ["#b8b0a3", "#94A3B8"],
    ["#2C3039", "#0F172A"],
    ["#2c3039", "#0F172A"],
    ["#464554", "#475569"],
    ["#1A1A2E", "#0F172A"],
  ];

  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to);
  }

  next = next.replace(/rgba\(\s*192\s*,\s*57\s*,\s*43/g, "rgba(59, 130, 246");
  next = next.replace(/rgba\(\s*14\s*,\s*165\s*,\s*233/g, "rgba(59, 130, 246");
  next = next.replace(/rgba\(\s*34\s*,\s*211\s*,\s*238/g, "rgba(96, 165, 250");
  next = next.replace(/rgba\(\s*99\s*,\s*102\s*,\s*241/g, "rgba(37, 99, 235");
  next = next.replace(/rgba\(\s*79\s*,\s*70\s*,\s*229/g, "rgba(37, 99, 235");

  const tw = [
    ["cyan-", "blue-"],
    ["sky-", "blue-"],
    ["indigo-", "blue-"],
  ];
  for (const [from, to] of tw) {
    next = next.replaceAll(from, to);
  }

  return next;
}

const files = walk(join(ROOT, "src")).concat(walk(join(ROOT, "app")));
let changed = 0;
for (const file of files) {
  const original = readFileSync(file, "utf8");
  const updated = mapHoverThenBrand(restorePrefixes(original));
  if (updated !== original) {
    writeFileSync(file, updated);
    changed += 1;
  }
}

console.log(`Updated ${changed} files`);
