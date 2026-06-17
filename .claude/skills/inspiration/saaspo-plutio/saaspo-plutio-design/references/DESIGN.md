# saaspo-plutio DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 16 · Fonts: 2 · Components: 0
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: none

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![saaspo-plutio Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a warm tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **Plusjakartasans** for display/headings with **Times** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 8, 10, 12, 16, 20, 24px. The accent color **#ff7900** anchors interactive elements (buttons, links, focus rings).

---

## 2. Color Palette & Roles

| Token        | Hex       | Role         | Use                                     |
| ------------ | --------- | ------------ | --------------------------------------- |
| background   | `#000000` | background   | Page background, darkest surface        |
| surface      | `#222d38` | surface      | Card and panel backgrounds              |
| text-primary | `#ffffff` | text-primary | Headings and body text                  |
| text-muted   | `#404040` | text-muted   | Captions, placeholders, secondary info  |
| border       | `#595959` | border       | Dividers, card borders, outlines        |
| accent       | `#ff7900` | accent       | CTAs, links, focus rings, active states |
| danger       | `#de5052` | danger       | Error states, destructive actions       |
| success      | `#0af395` | success      | Success states, positive indicators     |
| info         | `#0051c3` | info         | Informational highlights                |
| unknown      | `#0b0f14` | unknown      | Palette color                           |
| unknown      | `#333333` | unknown      | Palette color                           |
| unknown      | `#dddddd` | unknown      | Palette color                           |
| unknown      | `#0ce48d` | unknown      | Palette color                           |
| unknown      | `#ebebeb` | unknown      | Palette color                           |
| unknown      | `#521010` | unknown      | Palette color                           |
| unknown      | `#f63a22` | unknown      | Palette color                           |

---

## 3. Typography Rules

**Font Stack:**

- **Times** — Heading 1, Heading 2, Heading 3
- **Plusjakartasans** — Body, Caption

| Role      | Font            | Size           | Weight |
| --------- | --------------- | -------------- | ------ |
| Heading 1 | Times           | 48px / 3rem    | 700    |
| Heading 2 | Times           | 32px / 2rem    | 600    |
| Heading 3 | Times           | 24px / 1.5rem  | 600    |
| Body      | Plusjakartasans | 16px / 1rem    | 400    |
| Caption   | Plusjakartasans | 12px / 0.75rem | 400    |

**Typographic Rules:**

- Limit to 2 font families max per screen
- Use **Times** for body/UI text, **Plusjakartasans** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes

---

## 4. Component Stylings

No components detected. Scan `src/components/` or `components/` to populate this section.

---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 8, 10, 12, 16, 20, 24, 30, 40, 60, 96
- **Border radius:** 2px, 4px, 5px 5px 0px 0px, 6px, 8px, 10px, 16px, 48px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |

---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `rgba(0, 0, 0, 0.4) 0px -1px 1px 0px inset`

---

## 8. Do's and Don'ts

### Do's

- Use `#ff7900` for interactive elements (buttons, links, focus rings)
- Use `#000000` as the primary page background
- Pair **Times** (body) with **Plusjakartasans** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 4px, 5px 5px 0px 0px, 6px, 8px

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Times and Plusjakartasans
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No gradient backgrounds
- No blur or backdrop-blur effects
- No zebra striping on tables/lists

---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #222d38
Border: 1px solid #595959
Radius: 8px
Padding: 16px
Font: Times
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ff7900, text white
Ghost: bg transparent, border #595959
Padding: 8px 16px
Radius: 8px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ff7900
```

### Build a Page Layout

```
Background: #000000
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #222d38
Label: #404040 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #000000
Input border: 1px solid #595959
Focus: border-color #ff7900
Label: #404040 12px
Spacing: 16px between fields
Radius: 8px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Times, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
