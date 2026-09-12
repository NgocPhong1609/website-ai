import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { forbiddenBrandReds, palette } from "./palette";

const APP_ROOT = join(__dirname, "../../..");

function walkSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === "dist") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkSourceFiles(full, acc);
      continue;
    }
    if (
      /\.(tsx|ts|css)$/.test(entry) &&
      !entry.endsWith(".test.ts") &&
      !entry.endsWith(".test.tsx") &&
      entry !== "palette.ts"
    ) {
      acc.push(full);
    }
  }
  return acc;
}

describe("student palette tokens", () => {
  it("exposes the student primary scale used across the product", () => {
    expect(palette.primary).toBe("#3B82F6");
    expect(palette.primaryHover).toBe("#2563EB");
    expect(palette.primarySoft).toBe("#EFF6FF");
    expect(palette.primaryDeep).toBe("#1D4ED8");
  });

  it("keeps derived tints on the same blue family", () => {
    expect(palette.primaryTint).toBe("#DBEAFE");
    expect(palette.primaryMid).toBe("#60A5FA");
  });
});

describe("brand red purge", () => {
  it("does not leave TeacherColor reds in product source", () => {
    const files = walkSourceFiles(join(APP_ROOT, "src")).concat(
      walkSourceFiles(join(APP_ROOT, "app")),
      [join(APP_ROOT, "src/shared/styles/globals.css")],
    );
    const hits: string[] = [];

    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const red of forbiddenBrandReds) {
        const pattern = new RegExp(red, "i");
        if (pattern.test(text)) {
          hits.push(`${relative(APP_ROOT, file)} contains ${red}`);
        }
      }
    }

    expect(hits).toEqual([]);
  });
});

describe("admin lucide migration", () => {
  it("does not keep unicode nav glyphs in the admin sidebar", () => {
    const sidebar = readFileSync(
      join(APP_ROOT, "src/features/admin/components/AdminSidebar.tsx"),
      "utf8",
    );
    expect(sidebar).toMatch(/from ["']lucide-react["']/);
    expect(sidebar).not.toMatch(/icon: ["'][⌂◌❖◫◈◍▣⬟✦⚑]/);
  });
});
