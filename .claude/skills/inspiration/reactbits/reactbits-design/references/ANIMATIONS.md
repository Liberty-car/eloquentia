# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library                           | Type      | Notes |
| --------------------------------- | --------- | ----- |
| **Web Animations API (1 active)** | animation |       |

## Scroll Journey

The page is **900px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero

Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section

Scroll position: 0px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section

Scroll position: 0px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page

Scroll position: 0px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content

Scroll position: 0px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer

Scroll position: 0px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer

Scroll position: 0px

![Scroll 100%](../screens/scroll/scroll-100.png)

## CSS Keyframes (43 extracted)

### `@keyframes ln-menu-slide-in`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.ln-navbar-mobile-menu`, `.ln-navbar-prefs-menu`

```css
@keyframes ln-menu-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes spinCW`

Duration: `20s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-orbit-ring--1`, `.ln-feat-orbit-ring--2 .ln-feat-orbit-node svg`

```css
@keyframes spinCW {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes spinCCW`

Duration: `30s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-orbit-ring--2`, `.ln-feat-orbit-ring--1 .ln-feat-orbit-node svg`

```css
@keyframes spinCCW {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
```

> Transform/motion animation

### `@keyframes rotateBorder`

Duration: `4s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.tool-selector-wrapper::before`, `.tool-selector-wrapper::after`

```css
@keyframes rotateBorder {
  100% {
    --border-angle: 360deg;
  }
}
```

> Border animation

### `@keyframes search-fade-in`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.search-backdrop`

```css
@keyframes search-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes search-slide-in`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.search-dialog`

```css
@keyframes search-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes announcement-modal-spin`

Duration: `8s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.announcement-modal-border`

```css
@keyframes announcement-modal-spin {
  100% {
    --announcement-angle: 360deg;
  }
}
```

### `@keyframes ln-pro-flow`

Duration: `3s` · Easing: `ease` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-navbar-pro`

```css
@keyframes ln-pro-flow {
  0% {
    background-position-x: 0%;
    background-position-y: 50%;
  }
  50% {
    background-position-x: 100%;
    background-position-y: 50%;
  }
  100% {
    background-position-x: 0%;
    background-position-y: 50%;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes ln-pro-shine`

Duration: `10s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-navbar-pro::before`

```css
@keyframes ln-pro-shine {
  0% {
    background-position-x: -200%;
    background-position-y: 0px;
  }
  100% {
    background-position-x: 200%;
    background-position-y: 0px;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes ln-menu-fade-in`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.ln-navbar-mobile-menu-docs`

```css
@keyframes ln-menu-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes marqueeScroll`

Duration: `25s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-marquee-scroll`

```css
@keyframes marqueeScroll {
  0% {
    transform: translate(0px);
  }
  100% {
    transform: translate(-50%);
  }
}
```

> Transform/motion animation

### `@keyframes marqueeScrollRev`

Duration: `28s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-marquee-scroll--rev`

```css
@keyframes marqueeScrollRev {
  0% {
    transform: translate(-50%);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes thinkPulse`

Duration: `1.2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-aichat-thinking span`

```css
@keyframes thinkPulse {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.85);
  }
  50% {
    opacity: 0.7;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes cursorBlink`

Duration: `0.8s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-feat-aichat-cursor`

```css
@keyframes cursorBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes testScrollUp`

Duration: `35s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-test-col-scroll--up`

```css
@keyframes testScrollUp {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-33.333%);
  }
}
```

> Transform/motion animation

### `@keyframes testScrollDown`

Duration: `35s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-test-col-scroll--down`

```css
@keyframes testScrollDown {
  0% {
    transform: translateY(-33.333%);
  }
  100% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes cta-border-spin`

Duration: `8s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-cta-card-border`

```css
@keyframes cta-border-spin {
  100% {
    --cta-angle: 360deg;
  }
}
```

### `@keyframes ln-loader-pulse`

Duration: `1.8s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ln-loader-logo`

```css
@keyframes ln-loader-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.08);
  }
}
```

> Fade + motion enter animation

### `@keyframes shimmer`

Duration: `1s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.skeleton-pulse`

```css
@keyframes shimmer {
  0% {
    background-position-x: -200%;
    background-position-y: 0px;
  }
  100% {
    background-position-x: 200%;
    background-position-y: 0px;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes shimmer-overlay`

Duration: `1s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.skeleton-pulse::before`

```css
@keyframes shimmer-overlay {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
```

### `@keyframes pro-card-promo-spin`

Duration: `4s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.pro-card-promo::before`

```css
@keyframes pro-card-promo-spin {
  100% {
    --pro-promo-angle: 360deg;
  }
}
```

### `@keyframes pro-card-promo-pulse`

Duration: `2.4s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.pro-card-promo`

```css
@keyframes pro-card-promo-pulse {
  0%,
  100% {
    box-shadow: rgba(168, 85, 247, 0.45) 0px 0px;
  }
  50% {
    box-shadow: rgba(168, 85, 247, 0) 0px 0px 0px 4px;
  }
}
```

> Shadow pulse/glow effect

### `@keyframes border-dance`

Duration: `4s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.landing-button::after`

```css
@keyframes border-dance {
  0% {
    background-position-x: 0%;
    background-position-y: center;
  }
  50% {
    background-position-x: 100%;
    background-position-y: center;
  }
  100% {
    background-position-x: 0%;
    background-position-y: center;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes heroTextFadeIn`

Duration: `0.8s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.hero-text-animate`

```css
@keyframes heroTextFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeIn`

Duration: `0.3s` · Easing: `cubic-bezier(0.4, 0, 0.2, 1)` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.skeleton-loader`

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes swipe-out-left`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="left"]`

```css
@keyframes swipe-out-left {
  0% {
    transform: var(--y) translate(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translate(calc(var(--swipe-amount-x) - 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-right`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="right"]`

```css
@keyframes swipe-out-right {
  0% {
    transform: var(--y) translate(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translate(calc(var(--swipe-amount-x) + 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-up`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="up"]`

```css
@keyframes swipe-out-up {
  0% {
    transform: var(--y) translateY(var(--swipe-amount-y));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateY(calc(var(--swipe-amount-y) - 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-down`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="down"]`

```css
@keyframes swipe-out-down {
  0% {
    transform: var(--y) translateY(var(--swipe-amount-y));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateY(calc(var(--swipe-amount-y) + 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-fade-in`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `:where([data-sonner-toast][data-promise="true"]) :where([data-icon]) > svg`

```css
@keyframes sonner-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-fade-out`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.sonner-loading-wrapper[data-visible="false"]`

```css
@keyframes sonner-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-spin`

Duration: `1.2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sonner-loading-bar`

```css
@keyframes sonner-spin {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.15;
  }
}
```

> Opacity fade

### `@keyframes ln-fade-in`

```css
@keyframes ln-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes gradientShift`

```css
@keyframes gradientShift {
  0%,
  100% {
    background-position-x: 0%;
    background-position-y: center;
  }
  50% {
    background-position-x: 100%;
    background-position-y: center;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes glow-pulse`

```css
@keyframes glow-pulse {
  0% {
    filter: brightness() saturate();
  }
  100% {
    filter: brightness(1.1) saturate(1.2);
  }
}
```

> Filter effect (blur/brightness)

### `@keyframes fadeInUp`

```css
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpRotate1`

```css
@keyframes fadeInUpRotate1 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(-13deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(-13deg);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpRotate2`

```css
@keyframes fadeInUpRotate2 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(10deg);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpRotate3`

```css
@keyframes fadeInUpRotate3 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(-5deg);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpMobile`

```css
@keyframes fadeInUpMobile {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpMobileRotate1`

```css
@keyframes fadeInUpMobileRotate1 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(-13deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(-13deg);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpMobileRotate2`

```css
@keyframes fadeInUpMobileRotate2 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(10deg);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUpMobileRotate3`

```css
@keyframes fadeInUpMobileRotate3 {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotate(-5deg);
  }
}
```

> Fade + motion enter animation

## Motion Tokens (CSS Variables)

### Duration Tokens

```css
--chakra-durations-slowest: 500ms;
--chakra-durations-fastest: 50ms;
--chakra-durations-slow: 300ms;
--chakra-durations-fast: 150ms;
--default-transition-duration: 0.15s;
--chakra-durations-moderate: 200ms;
--chakra-durations-faster: 100ms;
--chakra-durations-slower: 400ms;
```

### Easing Tokens

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--chakra-easings-ease-out: cubic-bezier(0, 0, 0.58, 1);
--chakra-easings-ease-in: cubic-bezier(0.42, 0, 1, 1);
--chakra-easings-ease-in-smooth: cubic-bezier(0.32, 0.72, 0, 1);
--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--chakra-easings-ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Tokens

```css
--chakra-animations-bounce: bounce 1s infinite;
--chakra-animations-spin: spin 1s linear infinite;
--chakra-animations-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
--chakra-animations-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Other Tokens

```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: border-color 0.15s;
transition:
  background 0.15s,
  border-color 0.15s;
transition: opacity 0.3s;
transition:
  color 0.2s,
  border-color 0.2s,
  background 0.2s;
transition:
  filter 0.2s,
  transform 0.2s;
transition:
  max-width 0.5s,
  background 0.5s,
  border-color 0.5s,
  padding 0.5s;
transition:
  transform 0.3s,
  width 0.3s,
  height 0.3s,
  opacity 0.2s;
transition: color var(--transition-fast);
transition:
  border-color var(--transition-fast),
  background var(--transition-fast);
transition:
  transform 0.2s,
  box-shadow 0.3s;
transition:
  background var(--transition-fast),
  border-color var(--transition-fast);
transition:
  background 0.2s,
  border-color 0.2s;
```

## How to Recreate This Motion Design

### Step 1 — Install Dependencies

```bash

```

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 500ms cubic-bezier(0.4, 0, 1, 1),
    transform 500ms cubic-bezier(0.4, 0, 1, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Duration scale:** `500ms` · `50ms` · `300ms` · `150ms` · `.15s` · `200ms` · `100ms` · `400ms` · `0.15s` · `0.3s` · `0.2s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`0px`) → `screens/scroll/scroll-017.png`
- **33%** (`0px`) → `screens/scroll/scroll-033.png`
- **50%** (`0px`) → `screens/scroll/scroll-050.png`
- **67%** (`0px`) → `screens/scroll/scroll-067.png`
- **83%** (`0px`) → `screens/scroll/scroll-083.png`
- **100%** (`0px`) → `screens/scroll/scroll-100.png`
