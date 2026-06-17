# plutio DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 7
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![plutio Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a warm tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **plutio-icons-set** for display/headings with **Roboto** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. The accent color **#ffb800** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token                | Hex       | Role         | Use                                     |
| -------------------- | --------- | ------------ | --------------------------------------- |
| secondary-border     | `#000000` | background   | Page background, darkest surface        |
| surface              | `#1a1a1a` | surface      | Card and panel backgrounds              |
| tile-color           | `#ffffff` | text-primary | Headings and body text                  |
| text-muted           | `#605a90` | text-muted   | Captions, placeholders, secondary info  |
| border               | `#333333` | border       | Dividers, card borders, outlines        |
| accent               | `#ffb800` | accent       | CTAs, links, focus rings, active states |
| danger               | `#ff4757` | danger       | Error states, destructive actions       |
| success              | `#00d26a` | success      | Success states, positive indicators     |
| warning              | `#f4ede4` | warning      | Warning states, caution indicators      |
| primary-label        | `#f5f1ff` | info         | Informational highlights                |
| primary              | `#3d0ebf` | unknown      | Palette color                           |
| borders              | `#d2d2eb` | unknown      | Palette color                           |
| unknown              | `#1a1a2e` | unknown      | Palette color                           |
| unknown              | `#2563eb` | unknown      | Palette color                           |
| unknown              | `#666666` | unknown      | Palette color                           |
| unknown              | `#16213e` | unknown      | Palette color                           |
| borders-dark         | `#bcbcd7` | unknown      | Palette color                           |
| primary-label-border | `#e9e0fa` | unknown      | Palette color                           |
| secondary            | `#100432` | unknown      | Palette color                           |
| grey-label-border    | `#dce3f2` | unknown      | Palette color                           |

### CSS Variable Tokens

```css
--font-secondary: #462dc1;
--font-secondary-light: #bdacff;
--primary: #3d0ebf;
--primary-border: #350cab;
--primary-light: #470fec;
--primary-dark: #370bb4;
--primary-label: #f5f1ff;
--primary-label-border: #e9e0fa;
--primary-label-text: #3d0ebf;
--primary-shadow: #4214c44d;
--primary-shadow-light: #4214c412;
--primary-tint: #6c63ff14;
--secondary: #100432;
--secondary-border: #000;
--secondary-light: #17034d;
--cta-button-border: #2d0a91;
--inner-background: #f1f1f9;
--inner-background-overlay: #f1f1f9e8;
--inner-background-light: #f8f8fc;
--inner-background-dark: #eaeaf6;
```

---

## 3. Typography Rules

**Font Stack:**

- **Roboto** — Heading 1, Heading 2, Heading 3
- **plutio-icons-set** — Body, Caption
- **Roboto Mono** — Code

**Font Sources:**

```css
@font-face {
  font-family: 'plutio-icons-set';
  src: url('https://www.plutio.com/static/icons/icons.woff2?vg3mwv');
  font-weight: 400;
}
@font-face {
  font-family: 'Roboto';
  src: url('https://www.plutio.com/static/font/Roboto-Italic.woff2')
    format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'Roboto';
  src: url('https://www.plutio.com/static/font/Roboto-Bold.woff2')
    format('woff2');
  font-weight: 700;
}
@font-face {
  font-family: 'Inter';
  src: url('https://www.plutio.com/static/font/Inter-Bold.woff2')
    format('woff2');
  font-weight: 700;
}
@font-face {
  font-family: 'Inter';
  src: url('https://www.plutio.com/static/font/Inter-Regular.woff2')
    format('woff2');
  font-weight: 400;
}
```

| Role      | Font             | Size | Weight |
| --------- | ---------------- | ---- | ------ |
| Heading 1 | Roboto           | 5rem | 700    |
| Heading 2 | Roboto           | 56px | 700    |
| Heading 3 | Roboto           | 3rem | 700    |
| Body      | plutio-icons-set | 10px | 400    |
| Caption   | plutio-icons-set | 12px | 400    |
| Code      | Roboto Mono      | 14px | 400    |

**Typographic Rules:**

- Limit to 3 font families max per screen
- Use **Roboto** for body/UI text, **plutio-icons-set** for display/headings
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

**Badge** — `html`

**List** — `html`

### Data Input (1)

**Button** — `html`

- Animation:

### Overlay (1)

**Modal** — `html`

### Media (1)

**Image** — `html`

---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **Border radius:** 4px, 10px, inherit, 1px, 2px, 3px, 5px, 6px, 8px, 9px, 13px, 14px, 18px, 20px, 24px, 40px, 50px, 100%
- **Max content width:** 1300px

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

- `0 2px 0 var(--cta-button-border)`
- `0 1px 0 var(--cta-button-border)`
- `0 1px 2px #0000000d`

### Raised — cards, buttons, interactive elements

- `0 3px 3px 0 var(--shadow-shade)`
- `var(--shadow-shade-s)`
- `0 4px 0 var(--cta-button-border)`

### Floating — dropdowns, popovers, modals

- `0 0 14px 0 var(--shadow-shade)`
- `0 3px 3px 0 0 0 14px 0`
- `0 0 14px 0 var(--shadow-shade-l)`

### Overlay — full-screen overlays, top-level dialogs

- `0 0 0 3px rgba(var(--primary),.2),0 8px 24px rgba(var(--primary),.3),0 0 40px rgba(var(--primary),.15)`
- `0 0 0 3px rgba(var(--primary),.3),0 8px 32px rgba(var(--primary),.4),0 0 60px rgba(var(--primary),.25)`
- `0 8px 24px #0000001f`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 10, 15, 20, 99, 100, 1000, 10000, 10001, 10002`

---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes banner-ticker`
- `@keyframes globe-live-dot-animation`
- `@keyframes slideLogos`
- `@keyframes fadeInUp`
- `@keyframes slideUpBounce`
- `@keyframes bubbleFadeIn`
- `@keyframes revealChar`
- `@keyframes fillIn`

### Animated Components

- **Button**:

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`

---

## 8. Do's and Don'ts

### Do's

- Use `#ffb800` for interactive elements (buttons, links, focus rings)
- Use `#000000` as the primary page background
- Pair **Roboto** (body) with **plutio-icons-set** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 4px, 10px, inherit, 1px, 2px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Roboto and plutio-icons-set and Roboto Mono
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

| Name | Value  | Source |
| ---- | ------ | ------ |
| sm   | 500px  | css    |
| sm   | 640px  | css    |
| md   | 650px  | css    |
| md   | 700px  | css    |
| lg   | 800px  | css    |
| lg   | 870px  | css    |
| lg   | 900px  | css    |
| lg   | 951px  | css    |
| lg   | 991px  | css    |
| lg   | 1000px | css    |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #1a1a1a
Border: 1px solid #333333
Radius: 9px
Padding: 20px
Font: Roboto
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ffb800, text white
Ghost: bg transparent, border #333333
Padding: 10px 20px
Radius: 9px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ffb800
```

### Build a Page Layout

```
Background: #000000
Max-width: 1300px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #1a1a1a
Label: #605a90 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #000000
Input border: 1px solid #333333
Focus: border-color #ffb800
Label: #605a90 12px
Spacing: 20px between fields
Radius: 9px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Roboto, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
