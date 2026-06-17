# reactbits DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 0
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![reactbits Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography pairs **Bricolage Grotesque** for display/headings with **Gochi Hand** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#b497cf** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token                | Hex       | Role         | Use                                     |
| -------------------- | --------- | ------------ | --------------------------------------- |
| tw-ring-offset-color | `#ffffff` | background   | Page background, darkest surface        |
| bg-card              | `#161026` | surface      | Card and panel backgrounds              |
| surface              | `#e2e8f0` | surface      | Card and panel backgrounds              |
| theme-color          | `#120f17` | text-primary | Headings and body text                  |
| text-muted           | `#a6a6a6` | text-muted   | Captions, placeholders, secondary info  |
| text-secondary       | `#f1f5f9` | text-muted   | Captions, placeholders, secondary info  |
| text-muted           | `#988bc7` | text-muted   | Captions, placeholders, secondary info  |
| border-primary       | `#2f293a` | border       | Dividers, card borders, outlines        |
| color-accent         | `#b497cf` | accent       | CTAs, links, focus rings, active states |
| info                 | `#5227ff` | info         | Informational highlights                |
| color-primary        | `#a855f7` | unknown      | Palette color                           |
| unknown              | `#7c3aed` | unknown      | Palette color                           |
| unknown              | `#222222` | unknown      | Palette color                           |
| color-black          | `#000000` | unknown      | Palette color                           |
| unknown              | `#221638` | unknown      | Palette color                           |
| unknown              | `#cccccc` | unknown      | Palette color                           |
| unknown              | `#dad1f6` | unknown      | Palette color                           |
| unknown              | `#78d1e1` | unknown      | Palette color                           |
| unknown              | `#08060c` | unknown      | Palette color                           |
| unknown              | `#c084fc` | unknown      | Palette color                           |

### CSS Variable Tokens

```css
--border-angle: 360deg;
--tw-border-style: solid;
--tw-border-style: none;
--tw-border-style: solid;
--bg-card: #1b1722;
--border-primary: #2f293a;
--border-secondary: #2f293a;
--border-subtle: #2f293a;
--color-primary: #a855f7;
--color-accent: #b497cf;
--color-accent-muted: #b497cf;
--text-primary: #fff;
--text-secondary: #f5f5f5;
--text-muted: #aaa;
--shadow-primary: 0 2px 8px #5227ff66;
```

---

## 3. Typography Rules

**Font Stack:**

- **Gochi Hand** — Heading 1, Heading 2, Heading 3
- **Bricolage Grotesque** — Body, Caption
- **Geist Mono** — Code

**Font Sources:**

```css
@font-face {
  font-family: 'Geist';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-sans/Geist-Variable.woff2')
    format('woff2');
  font-weight: 100;
}
@font-face {
  font-family: 'Geist Mono';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2')
    format('woff2');
  font-weight: 100;
}
@font-face {
  font-family: 'Geist Pixel Square';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2')
    format('woff2');
  font-weight: 500;
}
@font-face {
  font-family: 'Geist Pixel Grid';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2')
    format('woff2');
  font-weight: 500;
}
@font-face {
  font-family: 'Geist Pixel Circle';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-pixel/GeistPixel-Circle.woff2')
    format('woff2');
  font-weight: 500;
}
@font-face {
  font-family: 'Geist Pixel Triangle';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-pixel/GeistPixel-Triangle.woff2')
    format('woff2');
  font-weight: 500;
}
@font-face {
  font-family: 'Geist Pixel Line';
  src: url('https://reactbits.dev/assets/css/geist/dist/fonts/geist-pixel/GeistPixel-Line.woff2')
    format('woff2');
  font-weight: 500;
}
@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvRviyM0.ttf')
    format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvfzlyM0.ttf')
    format('truetype');
  font-weight: 700;
}
@font-face {
  font-family: 'Gochi Hand';
  src: url('https://fonts.gstatic.com/s/gochihand/v25/hES06XlsOjtJsgCkx1PkTo4.ttf')
    format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Press Start 2P';
  src: url('https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK0nS.ttf')
    format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Google Sans Code';
  src: url('https://fonts.gstatic.com/s/googlesanscode/v17/pxijyogzv91QhV44Z_GQBHsGf5PuWEt-oWZnOk-ljWSpwaFB6rqcd6jvHiMYuic98Akn.ttf')
    format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Google Sans Code';
  src: url('https://fonts.gstatic.com/s/googlesanscode/v17/pxijyogzv91QhV44Z_GQBHsGf5PuWEt-oWZnOk-ljWSpwaFB6rqcd6jvHiMYuifa9wkn.ttf')
    format('truetype');
  font-weight: 700;
}
```

| Role      | Font                | Size | Weight |
| --------- | ------------------- | ---- | ------ |
| Heading 1 | Gochi Hand          | 6rem | 700    |
| Heading 2 | Gochi Hand          | 5rem | 700    |
| Heading 3 | Gochi Hand          | 4rem | 700    |
| Body      | Bricolage Grotesque | 13px | 400    |
| Caption   | Bricolage Grotesque | 12px | 400    |
| Code      | Geist Mono          | 14px | 400    |

**Typographic Rules:**

- Limit to 3 font families max per screen
- Use **Gochi Hand** for body/UI text, **Bricolage Grotesque** for display/headings
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
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** .25rem, .5rem, .55rem, 1px, 1rem, 1.25em, 1.25rem, 1.5rem, 2px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 14px, 15px, 16px, 18px, 20px, 22px, 24px, 25px, 27px, 30px, 40px, 50px, 999px, inherit
- **Max content width:** 967px

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

- `0 0 0 1px #00d8ff80`

### Raised — cards, buttons, interactive elements

- `0 0 4px #0000008c`
- `0 2px 4px #0000001a`
- `0 0#a855f773`

### Floating — dropdowns, popovers, modals

- `0 2px 16px #0003,inset 0 .5px #ffffff0f`
- `0 2px 10px #a855f759`
- `0 2px 12px #00000040,inset 0 .5px #ffffff0f`

### Overlay — full-screen overlays, top-level dialogs

- `0 8px 40px #00000080,0 0 0 1px #ffffff08`
- `0 4px 32px #0006,0 0 80px #5227ff26,inset 0 .5px #ffffff0f`
- `0 0 16px rgba(var(--pro-glow,168,85,247),.5),0 0 40px rgba(var(--pro-glow,168,85,247),.2)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 99, 100, 900, 998, 1000, 1001, 1500, 9999, 10000`

---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes search-fade-in`
- `@keyframes search-slide-in`
- `@keyframes announcement-modal-spin`
- `@keyframes ln-pro-flow`
- `@keyframes ln-pro-shine`
- `@keyframes ln-menu-fade-in`
- `@keyframes ln-menu-slide-in`
- `@keyframes marqueeScroll`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`

---

## 8. Do's and Don'ts

### Do's

- Use `#b497cf` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **Gochi Hand** (body) with **Bricolage Grotesque** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .25rem, .5rem, .55rem, 1px, 1rem

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Gochi Hand and Bricolage Grotesque and Geist Mono
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists

---

## 9. Responsive Behavior

| Name | Value  | Source |
| ---- | ------ | ------ |
| sm   | 40rem  | css    |
| md   | 48rem  | css    |
| lg   | 64rem  | css    |
| xl   | 80rem  | css    |
| 2xl  | 96rem  | css    |
| xs   | 375px  | css    |
| xs   | 400px  | css    |
| xs   | 480px  | css    |
| sm   | 600px  | css    |
| sm   | 640px  | css    |
| md   | 768px  | css    |
| lg   | 900px  | css    |
| lg   | 967px  | css    |
| lg   | 999px  | css    |
| lg   | 1000px | css    |
| lg   | 1001px | css    |
| lg   | 1024px | css    |
| xl   | 1100px | css    |
| xl   | 1240px | css    |
| xl   | 1275px | css    |
| 2xl  | 1440px | css    |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #161026
Border: 1px solid #2f293a
Radius: 10px
Padding: 16px
Font: Gochi Hand
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #b497cf, text white
Ghost: bg transparent, border #2f293a
Padding: 8px 16px
Radius: 10px
Hover: opacity 0.9 or lighter shade
Focus: ring with #b497cf
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 967px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #161026
Label: #a6a6a6 (muted, 12px, uppercase)
Value: #120f17 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #2f293a
Focus: border-color #b497cf
Label: #a6a6a6 12px
Spacing: 16px between fields
Radius: 10px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Gochi Hand, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
