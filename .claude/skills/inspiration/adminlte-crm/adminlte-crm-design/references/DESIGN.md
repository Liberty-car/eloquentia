# adminlte-crm DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 11
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![adminlte-crm Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a neutral tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **Poppins** for display/headings with **Mulish** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token                      | Hex       | Role         | Use                                    |
| -------------------------- | --------- | ------------ | -------------------------------------- |
| bs-body-color              | `#212529` | background   | Page background, darkest surface       |
| bs-emphasis-color          | `#000000` | surface      | Card and panel backgrounds             |
| bs-emphasis-color          | `#ffffff` | text-primary | Headings and body text                 |
| bs-secondary-border-subtle | `#41464b` | text-muted   | Captions, placeholders, secondary info |
| bs-secondary-text-emphasis | `#a7acb1` | text-muted   | Captions, placeholders, secondary info |
| danger                     | `#ce9178` | danger       | Error states, destructive actions      |
| info                       | `#005fd5` | info         | Informational highlights               |
| bs-secondary               | `#6c757d` | unknown      | Palette color                          |
| bs-secondary-border-subtle | `#c4c8cb` | unknown      | Palette color                          |
| bs-primary                 | `#0d6efd` | unknown      | Palette color                          |
| unknown                    | `#1f3e64` | unknown      | Palette color                          |
| unknown                    | `#032044` | unknown      | Palette color                          |
| unknown                    | `#6b7a90` | unknown      | Palette color                          |
| unknown                    | `#d8d0d0` | unknown      | Palette color                          |
| unknown                    | `#9a9fad` | unknown      | Palette color                          |
| bs-secondary-bg-subtle     | `#e2e3e5` | unknown      | Palette color                          |
| bs-primary-bg-subtle       | `#031633` | unknown      | Palette color                          |
| unknown                    | `#162544` | unknown      | Palette color                          |
| unknown                    | `#f1f5f9` | unknown      | Palette color                          |
| bs-secondary-bg-subtle     | `#161719` | unknown      | Palette color                          |

### CSS Variable Tokens

```css
--bs-primary: #0d6efd;
--bs-secondary: #6c757d;
--bs-primary-rgb: 13, 110, 253;
--bs-secondary-rgb: 108, 117, 125;
--bs-primary-text-emphasis: #052c65;
--bs-secondary-text-emphasis: #2b2f32;
--bs-primary-bg-subtle: #cfe2ff;
--bs-secondary-bg-subtle: #e2e3e5;
--bs-primary-border-subtle: #9ec5fe;
--bs-secondary-border-subtle: #c4c8cb;
--bs-success-border-subtle: #a3cfbb;
--bs-info-border-subtle: #9eeaf9;
--bs-warning-border-subtle: #ffe69c;
--bs-danger-border-subtle: #f1aeb5;
--bs-light-border-subtle: #e9ecef;
--bs-dark-border-subtle: #adb5bd;
--bs-secondary-color: rgba(33, 37, 41, 0.75);
--bs-secondary-color-rgb: 33, 37, 41;
--bs-secondary-bg: #e9ecef;
--bs-secondary-bg-rgb: 233, 236, 239;
```

---

## 3. Typography Rules

**Font Stack:**

- **Mulish** — Heading 1, Heading 2, Heading 3
- **Poppins** — Body, Caption
- **SFMono-Regular** — Code

**Font Sources:**

```css
@font-face {
  font-family: 'Poppins';
  src: url('fonts/Poppins-Bold.ttf') format('truetype');
  font-weight: 700;
}
@font-face {
  font-family: 'Poppins';
  src: url('fonts/Poppins-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Mulish';
  src: url('fonts/Mulish-Bold.ttf') format('truetype');
  font-weight: 700;
}
@font-face {
  font-family: 'Mulish';
  src: url('fonts/Mulish-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'themify';
  src: url('fonts/themify-Regular.woff') format('woff');
  font-weight: 400;
}
@font-face {
  font-family: 'swiper-icons';
  src: url('data:application/font-woff;charset=utf-8;base64, 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');
  font-weight: 400;
}
```

| Role      | Font           | Size   | Weight |
| --------- | -------------- | ------ | ------ |
| Heading 1 | Mulish         | 5rem   | 700    |
| Heading 2 | Mulish         | 4.5rem | 700    |
| Heading 3 | Mulish         | 4rem   | 700    |
| Body      | Poppins        | 14px   | 400    |
| Caption   | Poppins        | 16px   | 400    |
| Code      | SFMono-Regular | 14px   | 400    |

**Typographic Rules:**

- Limit to 3 font families max per screen
- Use **Mulish** for body/UI text, **Poppins** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes

---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`

**Badge** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`

- Animation:

**Input** — `html`

- State: :focus, :placeholder

### Overlay (1)

**Modal** — `html`

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`

---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **Border radius:** 0px 4px 4px 0px, 0px 5px 5px 0px, 0px 0px 5px 5px, .25rem, .25em, .375rem, .75rem, 1rem, 2em, 4px, 5px, inherit, 2px, 3px, 5px 5px 0px 0px, 6px, 8px, 10px, 10px 10px 0px 0px, 12px, 14px, 16px, 50px, 100px, 999px
- **Max content width:** 61.93em

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |

---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 0 0 1px #fff,0 0 0 .25rem rgba(13,110,253,.25)`
- `rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.075) 0px 1px 1px 0px`

### Raised — cards, buttons, interactive elements

- `0 0 0 .25rem rgba(13,110,253,.25)`
- `0 0 0 .25rem rgba(var(--bs-success-rgb),.25)`
- `0 0 0 .25rem rgba(var(--bs-danger-rgb),.25)`

### Floating — dropdowns, popovers, modals

- `0px 7px 18px rgba(0,96,213,.44)`
- `0px 7px 18px rgba(26,188,225,.44)`
- `0 4px 20px rgba(0,95,213,.08)`

### Overlay — full-screen overlays, top-level dialogs

- `inset 0 0 0 9999px var(--bs-table-bg-state,var(--bs-table-bg-type,var(--bs-table-accent-bg)))`
- `0 4px 24px rgba(0,0,0,.04)`
- `0 12px 28px rgba(0,0,0,.06)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 9, 10, 50, 98, 99, 1020, 1030, 1040, 10000, 100000`

---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes progress-bar-stripes`
- `@keyframes spinner-border`
- `@keyframes spinner-grow`
- `@keyframes placeholder-glow`
- `@keyframes placeholder-wave`
- `@keyframes swiper-preloader-spin`

### Animated Components

- **Button**:

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`

---

## 8. Do's and Don'ts

### Do's

- Use `#212529` as the primary page background
- Pair **Mulish** (body) with **Poppins** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 0px 4px 4px 0px, 0px 5px 5px 0px, 0px 0px 5px 5px, .25rem, .25em
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Mulish and Poppins and SFMono-Regular
- Don't use arbitrary spacing values — stick to multiples of 5px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists

---

## 9. Responsive Behavior

| Name | Value      | Source |
| ---- | ---------- | ------ |
| xs   | 21.25em    | css    |
| xs   | 24.37em    | css    |
| sm   | 37.5em     | css    |
| md   | 47.93em    | css    |
| lg   | 61.93em    | css    |
| xl   | 75em       | css    |
| xl   | 79.375em   | css    |
| 2xl  | 103.0625em | css    |
| 2xl  | 103.125em  | css    |
| sm   | 575px      | css    |
| sm   | 575.98px   | css    |
| sm   | 576px      | css    |
| sm   | 600px      | css    |
| md   | 767.98px   | css    |
| md   | 768px      | css    |
| lg   | 991px      | css    |
| lg   | 991.98px   | css    |
| lg   | 992px      | css    |
| xl   | 1199.98px  | css    |
| xl   | 1200px     | css    |
| 2xl  | 1399.98px  | css    |
| 2xl  | 1400px     | css    |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid var(--border)
Radius: 2px
Padding: 20px
Font: Mulish
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border var(--border)
Padding: 10px 20px
Radius: 2px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #212529
Max-width: 61.93em, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #41464b (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #212529
Input border: 1px solid var(--border)
Focus: border-color var(--accent)
Label: #41464b 12px
Spacing: 20px between fields
Radius: 2px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Mulish, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
