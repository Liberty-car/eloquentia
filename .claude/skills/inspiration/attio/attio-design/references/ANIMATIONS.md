# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library                           | Type      | Notes               |
| --------------------------------- | --------- | ------------------- |
| **Web Animations API (1 active)** | animation |                     |
| Canvas (5 elements)               | 2D Canvas | 2D canvas rendering |

## Scroll Journey

The page is **12,802px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero

Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section

Scroll position: 2,023px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section

Scroll position: 3,928px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page

Scroll position: 5,951px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content

Scroll position: 7,974px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer

Scroll position: 9,879px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer

Scroll position: 11,902px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Scroll Animation Patterns

| Pattern                  | Library | Element Count | Duration | Delay | Easing |
| ------------------------ | ------- | ------------- | -------- | ----- | ------ |
| parallax / sticky scroll | CSS     | 2             | —        | —     | —      |

### CSS Implementation

## CSS Keyframes (50 extracted)

### `@keyframes pricing-cards-grid-line-appear`

Duration: `1.5s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `both`

Used by: `.pricing-cards-grid-line`, `.pricing-cards-grid-line-vertical`

```css
@keyframes pricing-cards-grid-line-appear {
  100% {
    --pricing-cards-grid-line-position-start: 100%;
    --pricing-cards-grid-line-position-end: 130%;
  }
}
```

### `@keyframes ai-hero-box-gradient-spin`

Duration: `30s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ai-hero-box-gradient-progress`

```css
@keyframes ai-hero-box-gradient-spin {
  0% {
    --ai-hero-box-gradient-angle: 0deg;
  }
  100% {
    --ai-hero-box-gradient-angle: 360deg;
  }
}
```

### `@keyframes rotate-reporting`

Duration: `10s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.reporting-hero-card-reports`

```css
@keyframes rotate-reporting {
  0% {
    --reporting-hero-card-reports-gradient-angle: 0deg;
  }
  100% {
    --reporting-hero-card-reports-gradient-angle: 360deg;
  }
}
```

### `@keyframes rotate`

Duration: `var(--duration)` · Easing: `linear` · Fill: `forwards`

Used by: `.workflows-hero-card`

```css
@keyframes rotate {
  0% {
    --workflows-card-gradient-angle: 0deg;
  }
  18% {
    --workflows-card-gradient-angle: 76deg;
  }
  27% {
    --workflows-card-gradient-angle: 104deg;
  }
  63% {
    --workflows-card-gradient-angle: 256deg;
  }
  72% {
    --workflows-card-gradient-angle: 284deg;
  }
  100% {
    --workflows-card-gradient-angle: 360deg;
  }
}
```

### `@keyframes connection`

Used by: `.workflows-hero-card .workflows-hero-card-connection`

```css
@keyframes connection {
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes running`

Used by: `.workflows-hero-card .workflows-hero-card-running`

```css
@keyframes running {
  0% {
    opacity: 0;
    top: 0px;
  }
  15%,
  85% {
    opacity: 1;
    top: -28px;
  }
  100% {
    opacity: 0;
    top: 0px;
  }
}
```

> Opacity fade

### `@keyframes completed`

Used by: `.workflows-hero-card .workflows-hero-card-completed`

```css
@keyframes completed {
  0%,
  85% {
    opacity: 0;
    top: 0px;
  }
  100% {
    opacity: 1;
    top: -28px;
  }
}
```

> Opacity fade

### `@keyframes data-model-cards-mobile-connection-container`

Duration: `10s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.data-model-cards-mobile-connection-container`

```css
@keyframes data-model-cards-mobile-connection-container {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.99;
  }
}
```

> Opacity fade

### `@keyframes data-model-cards-mobile-connection-forwards`

Used by: `.data-model-cards-mobile-connection-active-forwards`

```css
@keyframes data-model-cards-mobile-connection-forwards {
  0% {
    stroke-dashoffset: 1px;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
```

> SVG stroke animation

### `@keyframes data-model-cards-mobile-connection-backwards`

Used by: `.data-model-cards-mobile-connection-active-backwards`

```css
@keyframes data-model-cards-mobile-connection-backwards {
  0% {
    stroke-dashoffset: -1px;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
```

> SVG stroke animation

### `@keyframes data-model-progress-process`

Duration: `4s` · Easing: `cubic-bezier(0.33, 1, 0.68, 1)` · Delay: `0s` · Iteration: `1` · Fill: `both`

Used by: `.data-model-progress-active`

```css
@keyframes data-model-progress-process {
  0%,
  100% {
    --data-model-progress-color-1: #d2d7de;
    --data-model-progress-color-2: #d2d7de;
    --data-model-progress-color-3: #d2d7de;
  }
  33%,
  66% {
    --data-model-progress-color-1: #f5b900;
    --data-model-progress-color-2: #ff5b59;
    --data-model-progress-color-3: #266df0;
  }
}
```

> Text color shift

### `@keyframes reveal-to-right`

Duration: `1.6s` · Easing: `cubic-bezier(0.38, 0.01, 0.12, 1)` · Delay: `0s` · Iteration: `1` · Fill: `both`

Used by: `.mask-reveal-to-right`

```css
@keyframes reveal-to-right {
  0% {
    -webkit-mask-position-x: 100%;
    -webkit-mask-position-y: 0px;
  }
  100% {
    -webkit-mask-position-x: 0px;
    -webkit-mask-position-y: 0px;
  }
}
```

### `@keyframes reveal-to-bottom`

Duration: `1.6s` · Easing: `cubic-bezier(0.38, 0.01, 0.12, 1)` · Delay: `0s` · Iteration: `1` · Fill: `both`

Used by: `.mask-reveal-to-bottom`

```css
@keyframes reveal-to-bottom {
  0% {
    -webkit-mask-position-x: 0px;
    -webkit-mask-position-y: 100%;
  }
  100% {
    -webkit-mask-position-x: 0px;
    -webkit-mask-position-y: 0px;
  }
}
```

### `@keyframes swipe-out-left`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="left"]`

```css
@keyframes swipe-out-left {
  0% {
    transform: var(--y) translateX(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateX(calc(var(--swipe-amount-x) - 100%));
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
    transform: var(--y) translateX(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateX(calc(var(--swipe-amount-x) + 100%));
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

Used by: `[data-sonner-toast][data-promise="true"] [data-icon] > svg`

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

### `@keyframes fadeIn`

Used by: `[data-vaul-overlay][data-vaul-snap-points="false"][data-state="open"]`

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

### `@keyframes fadeOut`

Used by: `[data-vaul-overlay][data-state="closed"]`

```css
@keyframes fadeOut {
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes slideFromBottom`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="bo`

```css
@keyframes slideFromBottom {
  0% {
    transform: translate3d(0, var(--initial-transform, 100%), 0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToBottom`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="bo`

```css
@keyframes slideToBottom {
  100% {
    transform: translate3d(0, var(--initial-transform, 100%), 0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromTop`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="to`

```css
@keyframes slideFromTop {
  0% {
    transform: translate3d(0, calc(var(--initial-transform, 100%) * -1), 0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToTop`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="to`

```css
@keyframes slideToTop {
  100% {
    transform: translate3d(0, calc(var(--initial-transform, 100%) * -1), 0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromLeft`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="le`

```css
@keyframes slideFromLeft {
  0% {
    transform: translate3d(calc(var(--initial-transform, 100%) * -1), 0, 0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToLeft`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="le`

```css
@keyframes slideToLeft {
  100% {
    transform: translate3d(calc(var(--initial-transform, 100%) * -1), 0, 0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromRight`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="ri`

```css
@keyframes slideFromRight {
  0% {
    transform: translate3d(var(--initial-transform, 100%), 0, 0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToRight`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="ri`

```css
@keyframes slideToRight {
  100% {
    transform: translate3d(var(--initial-transform, 100%), 0, 0);
  }
}
```

> Transform/motion animation

### `@keyframes intercom-lightweight-app-gradient`

Duration: `200ms` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.intercom-lightweight-app-gradient`

```css
@keyframes intercom-lightweight-app-gradient {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes intercom-lightweight-app-messenger`

Duration: `250ms` · Easing: `cubic-bezier(0, 1, 1, 1)` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.intercom-lightweight-app-messenger`

```css
@keyframes intercom-lightweight-app-messenger {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  40% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes spin`

```css
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes pulse`

```css
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
```

> Opacity fade

### `@keyframes enter`

```css
@keyframes enter {
  0% {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(
        var(--tw-enter-translate-x, 0),
        var(--tw-enter-translate-y, 0),
        var(--tw-enter-translate-z, 0)
      )
      scale3d(
        var(--tw-enter-scale, 1),
        var(--tw-enter-scale, 1),
        var(--tw-enter-scale, 1)
      )
      rotateX(var(--tw-enter-rotate-x, 0)) rotateY(var(--tw-enter-rotate-y, 0))
      rotate(var(--tw-enter-rotate, 0));
  }
}
```

> Fade + motion enter animation

### `@keyframes exit`

```css
@keyframes exit {
  100% {
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(
        var(--tw-exit-translate-x, 0),
        var(--tw-exit-translate-y, 0),
        var(--tw-exit-translate-z, 0)
      )
      scale3d(
        var(--tw-exit-scale, 1),
        var(--tw-exit-scale, 1),
        var(--tw-exit-scale, 1)
      )
      rotateX(var(--tw-exit-rotate-x, 0)) rotateY(var(--tw-exit-rotate-y, 0))
      rotate(var(--tw-exit-rotate, 0));
  }
}
```

> Fade + motion enter animation

### `@keyframes navigation-enter-from-right`

```css
@keyframes navigation-enter-from-right {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translate(200px);
  }
  100% {
    opacity: 1;
    filter: blur();
    transform: translate(0px);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes navigation-enter-from-left`

```css
@keyframes navigation-enter-from-left {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translate(-200px);
  }
  100% {
    opacity: 1;
    filter: blur();
    transform: translate(0px);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes navigation-exit-to-right`

```css
@keyframes navigation-exit-to-right {
  0% {
    opacity: 1;
    filter: blur();
    transform: translate(0px);
  }
  100% {
    opacity: 0;
    filter: blur(8px);
    transform: translate(200px);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes navigation-exit-to-left`

```css
@keyframes navigation-exit-to-left {
  0% {
    opacity: 1;
    filter: blur();
    transform: translate(0px);
  }
  100% {
    opacity: 0;
    filter: blur(8px);
    transform: translate(-200px);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes dialog-scale-in`

```css
@keyframes dialog-scale-in {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
}
```

> Fade + motion enter animation

### `@keyframes dialog-scale-out`

```css
@keyframes dialog-scale-out {
  100% {
    opacity: 0;
    transform: scale(0.96);
  }
}
```

> Fade + motion enter animation

### `@keyframes search-shine`

```css
@keyframes search-shine {
  0% {
    transform: translate(-100%);
  }
  100% {
    transform: translate(200%);
  }
}
```

> Transform/motion animation

### `@keyframes productivity-intro-width`

```css
@keyframes productivity-intro-width {
  0% {
    opacity: 0.8;
    width: 0px;
  }
  100% {
    opacity: 0.3;
    width: 100vw;
  }
}
```

> Opacity fade · Dimension expand/collapse

### `@keyframes productivity-intro-height`

```css
@keyframes productivity-intro-height {
  0% {
    opacity: 0.8;
    height: 0px;
  }
  100% {
    height: var(--productivity-intro-height-to);
    opacity: 0.3;
  }
}
```

> Opacity fade · Dimension expand/collapse

### `@keyframes slideDown`

```css
@keyframes slideDown {
  0% {
    height: 0px;
  }
  100% {
    height: var(--radix-accordion-content-height);
  }
}
```

> Dimension expand/collapse

### `@keyframes slideUp`

```css
@keyframes slideUp {
  0% {
    height: var(--radix-accordion-content-height);
  }
  100% {
    height: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes collapsibleSlideDown`

```css
@keyframes collapsibleSlideDown {
  0% {
    height: 0px;
  }
  100% {
    height: var(--radix-collapsible-content-height);
  }
}
```

> Dimension expand/collapse

### `@keyframes collapsibleSlideUp`

```css
@keyframes collapsibleSlideUp {
  0% {
    height: var(--radix-collapsible-content-height);
  }
  100% {
    height: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes intercom-lightweight-app-launcher`

```css
@keyframes intercom-lightweight-app-launcher {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

## Motion Tokens (CSS Variables)

### Duration Tokens

```css
--default-transition-duration: 0.15s;
```

### Easing Tokens

```css
--ease-in: cubic-bezier(0.3, 0, 1, 1);
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
--ease-out: cubic-bezier(0, 0, 0, 1);
--ease-linear: cubic-bezier(0, 0, 1, 1);
--ease-emphasized-in-out: cubic-bezier(0.2, 0, 0, 1);
--ease-in-out: cubic-bezier(0.2, 0, 0, 1);
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out-quad: cubic-bezier(0.45, 0.05, 0.55, 0.95);
--ease-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: transform 0.4s;
transition:
  transform 0.4s,
  opacity 0.4s,
  height 0.4s,
  box-shadow 0.2s;
transition:
  opacity 0.4s,
  box-shadow 0.2s;
transition:
  opacity 0.1s,
  background 0.2s,
  border-color 0.2s;
transition: opacity 0.4s;
transition:
  transform 0.5s,
  opacity 0.2s;
transition:
  opacity 0.2s,
  transform 0.2s;
transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
transition: transform 167ms cubic-bezier(0.33, 0, 0, 1);
transition: transform 250ms cubic-bezier(0.33, 0, 0, 1);
transition: transform 134ms cubic-bezier(0.45, 0, 0.2, 1);
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
    opacity 0.15s cubic-bezier(0.3, 0, 1, 1),
    transform 0.15s cubic-bezier(0.3, 0, 1, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Canvas elements (5)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `.15s` · `0.4s` · `0.2s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`2023px`) → `screens/scroll/scroll-017.png`
- **33%** (`3928px`) → `screens/scroll/scroll-033.png`
- **50%** (`5951px`) → `screens/scroll/scroll-050.png`
- **67%** (`7974px`) → `screens/scroll/scroll-067.png`
- **83%** (`9879px`) → `screens/scroll/scroll-083.png`
- **100%** (`11902px`) → `screens/scroll/scroll-100.png`
