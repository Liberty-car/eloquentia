# attio DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 10
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: yes · Motion: expressive

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a neutral tone. Depth is expressed through layered shadows and subtle surface color variation. Typography uses **inter** throughout — a technical, developer-focused choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token                      | Hex       | Role         | Use                                    |
| -------------------------- | --------- | ------------ | -------------------------------------- |
| color-black-0              | `#000000` | background   | Page background, darkest surface       |
| color-blue-800             | `#1a2233` | surface      | Card and panel backgrounds             |
| color-white-800            | `#cad0d9` | text-primary | Headings and body text                 |
| text-muted                 | `#505154` | text-muted   | Captions, placeholders, secondary info |
| button-primary-border      | `#505967` | border       | Dividers, card borders, outlines       |
| color-red-500              | `#ff5b59` | danger       | Error states, destructive actions      |
| color-yellow-500           | `#f5b900` | warning      | Warning states, caution indicators     |
| color-blue-500             | `#266df0` | info         | Informational highlights               |
| tw-ring-offset-color       | `#ffffff` | unknown      | Palette color                          |
| color-white-200            | `#f5f0ff` | unknown      | Palette color                          |
| color-white-500            | `#e4e7ec` | unknown      | Palette color                          |
| color-black-700            | `#6f7988` | unknown      | Palette color                          |
| color-black-100            | `#1c1d1f` | unknown      | Palette color                          |
| color-black-800            | `#8f99a8` | unknown      | Palette color                          |
| unknown                    | `#18274b` | unknown      | Palette color                          |
| unknown                    | `#9ea1a4` | unknown      | Palette color                          |
| color-blue-100             | `#daf4fc` | unknown      | Palette color                          |
| color-blue-400             | `#70a1f0` | unknown      | Palette color                          |
| color-black-500            | `#383e47` | unknown      | Palette color                          |
| button-primary-bg-hover-to | `#c8dcff` | unknown      | Palette color                          |

### Dark Mode Token Mapping

| Variable                                    | Light                    | Dark                     |
| ------------------------------------------- | ------------------------ | ------------------------ |
| `--button-outline-bg`                       | `var(--color-white-100)` | `var(--color-black-50)`  |
| `--button-outline-border`                   | `var(--color-white-800)` | `var(--color-black-400)` |
| `--button-outline-text`                     | `var(--color-black-400)` | `var(--color-white-400)` |
| `--button-outline-bg-hover`                 | `var(--color-white-100)` | `var(--color-black-100)` |
| `--button-outline-border-hover`             | `var(--color-black-700)` | `var(--color-black-500)` |
| `--button-outline-text-hover`               | `var(--color-black-400)` | `var(--color-white-400)` |
| `--button-outline-bg-focus`                 | `var(--color-white-100)` | `var(--color-black-200)` |
| `--button-outline-border-focus`             | `var(--color-black-700)` | `var(--color-black-600)` |
| `--button-outline-text-focus`               | `var(--color-black-400)` | `var(--color-white-400)` |
| `--button-outline-bg-active`                | `var(--color-white-300)` | `var(--color-black-350)` |
| `--button-outline-border-active`            | `var(--color-black-500)` | `var(--color-white-100)` |
| `--button-outline-text-active`              | `var(--color-black-300)` | `var(--color-white-100)` |
| `--button-outline-bg-disabled`              | `var(--color-white-100)` | `var(--color-black-200)` |
| `--button-outline-border-disabled`          | `var(--color-white-500)` | `var(--color-black-400)` |
| `--button-outline-text-disabled-foreground` | `var(--color-white-800)` | `var(--color-black-500)` |
| `--button-ghost-text`                       | `var(--color-black-400)` | `var(--color-white-500)` |
| `--button-ghost-bg-hover`                   | `var(--color-white-300)` | `var(--color-black-400)` |
| `--button-ghost-text-hover`                 | `var(--color-black-300)` | `var(--color-white-100)` |
| `--button-ghost-bg-focus`                   | `var(--color-white-300)` | `var(--color-black-400)` |
| `--button-ghost-text-focus`                 | `var(--color-black-300)` | `var(--color-white-100)` |

### CSS Variable Tokens

```css
--button-primary-bg-from: var(--button-primary-bg-hover-from);
--button-primary-bg-to: var(--button-primary-bg-hover-to);
--button-primary-bg-from: var(--button-primary-bg-focus-from);
--button-primary-bg-to: var(--button-primary-bg-focus-to);
--button-primary-bg-from: var(--button-primary-bg-active-from);
--button-primary-bg-to: var(--button-primary-bg-active-to);
--button-primary-bg-from: var(--button-primary-bg-disabled-from);
--button-primary-bg-to: var(--button-primary-bg-disabled-to);
--button-primary-bg-from: var(--color-black-200);
--button-primary-bg-to: var(--color-black-200);
--button-primary-bg-fallback: var(--color-black-200);
--button-primary-border: var(--color-black-600);
--button-primary-text: var(--color-white-300);
--button-primary-bg-hover-from: var(--color-black-600);
--button-primary-bg-hover-to: var(--color-black-200);
--button-primary-bg-hover-fallback: var(--color-black-500);
--button-primary-border-hover: var(--color-black-600);
--button-primary-text-hover: var(--color-white-100);
--button-primary-bg-focus-from: var(--color-black-600);
--button-primary-bg-focus-to: var(--color-black-200);
```

---

## 3. Typography Rules

**Font Stack:**

- **inter** — Heading 1, Heading 2, Heading 3
- **JetBrains Mono** — Body, Caption, Code

**Font Sources:**

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('https://attio.com/_next/static/media/13bf9871fe164e7f-s.0s19wthhh_6~m.woff2?dpl=dpl_AsUok5eHy36yBT8disTG2Ch1LHzt');
  font-weight: 100;
}
@font-face {
  font-family: 'inter';
  src: url('https://attio.com/_next/static/media/inter_regular-s.p.14d~dgkwwinsr.woff2?dpl=dpl_AsUok5eHy36yBT8disTG2Ch1LHzt');
  font-weight: 400;
}
@font-face {
  font-family: 'inter';
  src: url('https://attio.com/_next/static/media/inter_bold-s.p.17izycnw7mk7o.woff2?dpl=dpl_AsUok5eHy36yBT8disTG2Ch1LHzt');
  font-weight: 700;
}
@font-face {
  font-family: 'interDisplay';
  src: url('https://attio.com/_next/static/media/inter_display_bold-s.p.08z.2j4gcre0y.woff2?dpl=dpl_AsUok5eHy36yBT8disTG2Ch1LHzt');
  font-weight: 700;
}
@font-face {
  font-family: 'tiemposText';
  src: url('https://attio.com/_next/static/media/tiempos_text_regular-s.p.09inv_nvjux_7.woff2?dpl=dpl_AsUok5eHy36yBT8disTG2Ch1LHzt');
  font-weight: 400;
}
```

| Role      | Font           | Size  | Weight |
| --------- | -------------- | ----- | ------ |
| Heading 1 | inter          | 112px | 700    |
| Heading 2 | inter          | 80px  | 700    |
| Heading 3 | inter          | 72px  | 700    |
| Body      | JetBrains Mono | 12px  | 400    |
| Caption   | JetBrains Mono | 13px  | 400    |
| Code      | JetBrains Mono | 14px  | 400    |

**Typographic Rules:**

- Use **inter** for all text — do not mix font families
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

### Data Display (2)

**Card** — `html`

- Variants: `running`, `completed`, `connection`

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

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** 2px, 2.5px, 3px, 3.5px, 4px, 4.5px, 4.8px, 5px, 6px, 6.5px, 7px, 8px, 9px, 9.5px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 19px, 20px, 22px, 24px, 28px, 30%, 37px, 40px, 100%, inherit
- **Max content width:** 1536px

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

- `0 0 0 1px #fff`

### Raised — cards, buttons, interactive elements

- `0 1px 3px #0000000a,0 0 2px #1c28402e`

### Overlay — full-screen overlays, top-level dialogs

- `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(28, 29, 31, 0.1) 0px 0px 0px 1px, rgba(28, 29, 31, 0.05) 0px 1px 2px 0px, rgba(28, 29, 31, 0.02) 0px 2px 4px -1px, rgba(28, 29, 31, 0.03) 0px 4px 8px -2px, rgba(28, 29, 31, 0.04) 0px 8px 16px -4px, rgba(28, 29, 31, 0.05) 0px 16px 32px -8px, rgba(28, 29, 31, 0.06) 0px 32px 64px -8px`

### Z-Index Scale

`0, 1, 2, 3, 10, 20, 30, 40, 50, 90, 91, 92, 93, 100, 101, 200, 201, 202, 999, 9999, 10000, 2147483647`

---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes ai-hero-box-gradient-spin`
- `@keyframes rotate-reporting`
- `@keyframes pricing-cards-grid-line-appear`
- `@keyframes rotate`
- `@keyframes connection`
- `@keyframes running`
- `@keyframes completed`
- `@keyframes spin`

### Animated Components

- **Button**:

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`

---

## 8. Do's and Don'ts

### Do's

- Use `#000000` as the primary page background
- Use **inter** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 2.5px, 3px, 3.5px, 4px
- Reuse existing components from Section 4 before creating new ones
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use inter consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists

---

## 9. Responsive Behavior

| Name | Value  | Source |
| ---- | ------ | ------ |
| xs   | 375px  | css    |
| xs   | 450px  | css    |
| sm   | 576px  | css    |
| md   | 768px  | css    |
| lg   | 992px  | css    |
| xl   | 1078px | css    |
| xl   | 1199px | css    |
| xl   | 1200px | css    |
| 2xl  | 1320px | css    |
| 2xl  | 1360px | css    |
| 2xl  | 1536px | css    |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #1a2233
Border: 1px solid #505967
Radius: 12px
Padding: 16px
Font: inter
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #505967
Padding: 8px 16px
Radius: 12px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #000000
Max-width: 1536px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #1a2233
Label: #505154 (muted, 12px, uppercase)
Value: #cad0d9 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #000000
Input border: 1px solid #505967
Focus: border-color var(--accent)
Label: #505154 12px
Spacing: 16px between fields
Radius: 12px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: inter, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
