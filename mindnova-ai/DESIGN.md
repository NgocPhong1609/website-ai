---
version: alpha
name: MindNova Blue
description: Canonical visual identity sourced from the student product theme and applied across student, admin, and instructor.
colors:
  primary: "#3B82F6"
  primary-hover: "#2563EB"
  primary-deep: "#1D4ED8"
  primary-soft: "#EFF6FF"
  primary-tint: "#DBEAFE"
  primary-mid: "#60A5FA"
  bg-base: "#F8FAFC"
  bg-surface: "#FFFFFF"
  border-subtle: "#F1F5F9"
  border-default: "#E2E8F0"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#94A3B8"
  success: "#10B981"
  success-soft: "#ECFDF5"
  warning: "#F59E0B"
  warning-soft: "#FFFBEB"
  on-primary: "#FFFFFF"
typography:
  heading:
    fontFamily: Source Sans 3
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.025em
  body:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

## Overview

MindNova is a calm learning product. The student Blue theme is the only brand accent. Admin and instructor reuse the same tokens so the product feels like one system, not three palettes.

Personality: clear, quiet, precise. White surfaces, slate type, one blue for action.

## Colors

Student tokens are the source of truth.

- **Primary (#3B82F6):** Default action, links, active nav, brand mark.
- **Primary hover (#2563EB):** Every hover/focus of a primary control. Never keep the resting red/blue on hover.
- **Primary deep (#1D4ED8):** Pressed state and text on very light blue chips when extra contrast is needed.
- **Primary soft (#EFF6FF):** Selected rows, tinted icon wells, soft badges.
- **Primary tint (#DBEAFE):** Derived blue-100 for hover-on-soft and focus rings.
- **Primary mid (#60A5FA):** Derived blue-400 for charts and gradients on dark sidebars.

Neutrals stay slate: `#F8FAFC` page, `#FFFFFF` card, `#E2E8F0` border, `#0F172A` text.

Success (`#10B981`) and warning (`#F59E0B`) stay semantic. Destructive actions (logout, reject, delete) may keep Tailwind `rose-*`. Do not use `#C0392B` or other teacher reds.

When a darker/lighter blue is needed and no token exists, mix from primary: 8–16% toward white for tints, 8–16% toward `#1D4ED8` for shades. Do not invent a second hue.

## Typography

Source Sans 3 for UI. Headings are semibold/bold with tight tracking. Admin display fonts (Sora / Space Grotesk) may stay on admin chrome only.

## Layout

8px rhythm. Student sidebar 56–224px. Admin content max 1600px with 24–32px page padding. Cards 16–24px radius.

## Elevation & Depth

Hairline borders and a 1–3px slate shadow. No heavy colored glow except a short primary shadow on the main CTA.

## Shapes

Controls 12–16px. Pills 9999px. Icon wells 8–12px.

## Components

- Primary button: `#3B82F6` rest, `#2563EB` hover, white label.
- Sidebar active: `#EFF6FF` fill, `#2563EB` label, 3px primary bar on student.
- Inputs: slate border, focus `border-[#3B82F6]` plus `ring` `#DBEAFE`.
- Icons: Lucide only. No emoji, no dingbat, no one-off SVG copies of Lucide.

## Do's and Don'ts

- Do reuse student hex tokens instead of cyan/indigo/teacher red.
- Do pair every primary rest color with `#2563EB` hover.
- Don't leave `#C0392B`, `#A93226`, `#A02C20`, `#FADBD8`, or `#E11D48` in product UI.
- Don't mix cream (`#FAF7F2`) with the blue system; use slate neutrals.
- Don't add decorative duplicate icons next to Lucide marks.
