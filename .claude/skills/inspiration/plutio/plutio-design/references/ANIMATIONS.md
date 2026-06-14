# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library                           | Type      | Notes |
| --------------------------------- | --------- | ----- |
| **Web Animations API (4 active)** | animation |       |

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

## CSS Keyframes (76 extracted)

### `@keyframes featureMilestonePop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-milestone`, `.canvas-feature .feature-portal_card`, `.canvas-feature .feature-portal_project`, `.canvas-feature .feature-portal_invoice`

```css
@keyframes featureMilestonePop {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes scoreBarFill`

Duration: `0.8s` · Easing: `ease-out` · Delay: `0.4s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-compare .compare-card .compare-card_score-bar-fill`, `.canvas-compare .compare-card._plutio._winner .compare-card_score-bar-fill`, `.canvas-alternative .alternative-card .alternative-card_score-bar-fill`, `.canvas-alternative .alternative-card._winner._selected .alternative-card_score-`

```css
@keyframes scoreBarFill {
  0% {
    width: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes rotate`

Duration: `2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.tool._quiz .tool-block._analyzing .analyzing-loader .icon.isSpinning`, `.place-search .place-search-input .place-search-loader`, `.places-map .places-map-loading .map-loader`

```css
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes featureSpotlightPop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-spotlight_card`, `.canvas-feature .feature-spotlight_value`, `.canvas-feature .feature-spotlight_stat`

```css
@keyframes featureSpotlightPop {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes statFadeIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-cost-of-chaos .cost-of-chaos_stat`, `.canvas-cost-of-chaos .cost-of-chaos_stack`, `.canvas-cost-of-chaos .cost-of-chaos_solution`

```css
@keyframes statFadeIn {
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

### `@keyframes popupOverlayFadeIn`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element .`, `.ui-scene .scene-content .desktop-container .desktop-element .demo-overlay`

```css
@keyframes popupOverlayFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes popupScaleIn`

Duration: `0.25s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element .`, `.ui-scene .scene-content .desktop-container .desktop-element .demo-popup`

```css
@keyframes popupScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.96) translateY(6px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes soundWave`

Duration: `0.8s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`, `.ui-scene .scene-content .desktop-container .desktop-element._ai-indicator .desk`

```css
@keyframes soundWave {
  0%,
  100% {
    height: 3px;
  }
  50% {
    height: 7px;
  }
}
```

> Dimension expand/collapse

### `@keyframes quickPulse`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`, `.ui-scene .scene-content .desktop-container .desktop-element._ai-indicator .desk`

```css
@keyframes quickPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes ripple`

Duration: `0.6s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`, `.ui-scene .scene-content .desktop-container .desktop-element._ai-indicator .desk`

```css
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(8);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes checkmark-appear`

Duration: `0.3s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`, `.ui-scene .scene-content .desktop-container .desktop-element._ai-indicator .desk`

```css
@keyframes checkmark-appear {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes spin`

Duration: `0.8s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`, `.ui-scene .scene-content .desktop-container .desktop-element._ai-indicator .desk`

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes cardPopIn`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-compare .compare-card._compact`, `.canvas-alternative .alternative-card`

```css
@keyframes cardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureJourneyDotPop`

Duration: `0.4s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-journey_dot-circle`, `.canvas-feature .feature-journey_dot._active .feature-journey_dot-circle`

```css
@keyframes featureJourneyDotPop {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureSpotlightFill`

Duration: `0.8s` · Easing: `ease-out` · Delay: `0.3s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-spotlight_progress-fill`, `.canvas-feature .feature-portal_project-fill`

```css
@keyframes featureSpotlightFill {
  0% {
    width: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes featureDashPop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-dashboard_panel`, `.canvas-feature .feature-dashboard_tile`

```css
@keyframes featureDashPop {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes banner-ticker`

Duration: `66s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.announcement-banner .announcement-banner_track`

```css
@keyframes banner-ticker {
  0% {
    transform: translateZ(0px);
  }
  100% {
    transform: translate3d(-100%, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes globe-live-dot-animation`

Duration: `2s` · Iteration: `infinite` · Fill: `forwards`

Used by: `.section.section_stats .content-wrapper .content-wrapper-section .content-layout`

```css
@keyframes globe-live-dot-animation {
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}
```

> Opacity fade

### `@keyframes slideLogos`

Duration: `80s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.demo-window .content-layout-block._menu .menu-items .menu-item .menu-item-secti`

```css
@keyframes slideLogos {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-100%);
  }
}
```

> Transform/motion animation

### `@keyframes revealChar`

Duration: `0.3s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.demo-window .content-layout-block._canvas .desktop-container .desktop-element._`

```css
@keyframes revealChar {
  0% {
    opacity: 0;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
  }
}
```

> Opacity fade · Filter effect (blur/brightness)

### `@keyframes pulse-recording`

Duration: `1.5s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ui-scene .scene-content .desktop-container .desktop-element._plutio-app .deskto`

```css
@keyframes pulse-recording {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
```

> Fade + motion enter animation

### `@keyframes blink`

Duration: `1s` · Easing: `ease` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.ui-scene.ui-scene--voice-to-text .scene-content .reveal-text .typing-cursor`

```css
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes glare`

Duration: `4s` · Easing: `ease-in-out` · Delay: `2s` · Iteration: `infinite` · Fill: `none`

Used by: `.button.isCTA::before, .layout._compare .layout-item .layout-item_content .layou`

```css
@keyframes glare {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
```

### `@keyframes video-popup-fade-in`

Duration: `0.1s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.video-popup`

```css
@keyframes video-popup-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes popup-fade-in`

Duration: `0.15s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.popup-overlay`

```css
@keyframes popup-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes popup-slide-up`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.popup`

```css
@keyframes popup-slide-up {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeA`

Duration: `4s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.zero-page .zero-page-section._hero .zero-page-section-block._story ._4 .possibi`

```css
@keyframes fadeA {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.6;
  }
}
```

> Opacity fade

### `@keyframes fadeB`

Duration: `5s` · Easing: `ease-in-out` · Delay: `1s` · Iteration: `infinite` · Fill: `none`

Used by: `.zero-page .zero-page-section._hero .zero-page-section-block._story ._4 .possibi`

```css
@keyframes fadeB {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.15;
  }
}
```

> Opacity fade

### `@keyframes fadeC`

Duration: `4.5s` · Easing: `ease-in-out` · Delay: `0.5s` · Iteration: `infinite` · Fill: `none`

Used by: `.zero-page .zero-page-section._hero .zero-page-section-block._story ._4 .possibi`

```css
@keyframes fadeC {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.55;
  }
}
```

> Opacity fade

### `@keyframes scrollHint`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.zero-page .zero-page-section._hero .zero-page-section-block._connector .circula`

```css
@keyframes scrollHint {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(8px);
  }
}
```

> Transform/motion animation

### `@keyframes exitFadeIn`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.exit-popup-overlay`

```css
@keyframes exitFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes exitSlideDown`

Duration: `0.3s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.exit-popup`

```css
@keyframes exitSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes pulse`

Duration: `1.5s` · Easing: `ease` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.tool._quiz .tool-block._analyzing p`

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

> Opacity fade

### `@keyframes slideDown`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.nomad-card .nomad-card-details`

```css
@keyframes slideDown {
  0% {
    opacity: 0;
    max-height: 0px;
  }
  100% {
    opacity: 1;
    max-height: 200px;
  }
}
```

> Opacity fade · Dimension expand/collapse

### `@keyframes shimmer`

Duration: `1.5s` · Easing: `ease` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.nomad-card._skeleton ._shimmer`

```css
@keyframes shimmer {
  0% {
    background-position-x: -200px;
    background-position-y: 0px;
  }
  100% {
    background-position-x: 200px;
    background-position-y: 0px;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes plutioCardPopIn`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-compare .compare-card._plutio`

```css
@keyframes plutioCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(30px) rotate(-4deg) translateX(10px);
  }
  100% {
    opacity: 1;
    transform: rotate(-4deg) translateX(10px);
  }
}
```

> Fade + motion enter animation

### `@keyframes plutioWinnerPopIn`

Duration: `0.7s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-compare .compare-card._plutio._winner`

```css
@keyframes plutioWinnerPopIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(40px) rotate(-4deg) translateX(10px);
  }
  60% {
    opacity: 1;
    transform: scale(1.08) translateY(-5px) rotate(-4deg) translateX(10px);
  }
  80% {
    transform: scale(0.98) translateY(2px) rotate(-4deg) translateX(10px);
  }
  100% {
    transform: rotate(-4deg) translateX(10px);
  }
}
```

> Fade + motion enter animation

### `@keyframes competitorCardPopIn`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.15s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-compare .compare-card:not(._plutio)`

```css
@keyframes competitorCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(30px) rotate(3deg) translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: rotate(3deg) translateX(-10px);
  }
}
```

> Fade + motion enter animation

### `@keyframes plutioSectionSlideUp`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.4s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-rivals_plutio-section`

```css
@keyframes plutioSectionSlideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes plutioBadgePop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.6s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-rivals_plutio-badge`

```css
@keyframes plutioBadgePop {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  60% {
    transform: translateX(-50%) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes plutioScoreBarFill`

Duration: `0.8s` · Easing: `ease-out` · Delay: `0.8s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-rivals_plutio-score-bar-fill`

```css
@keyframes plutioScoreBarFill {
  0% {
    width: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes winnerPopIn`

Duration: `0.7s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-alternative .alternative-card._winner._selected`

```css
@keyframes winnerPopIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(40px);
  }
  60% {
    opacity: 1;
    transform: scale(1.08) translateY(-5px);
  }
  80% {
    transform: scale(0.98) translateY(2px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureJourneyCardPop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-journey_card`

```css
@keyframes featureJourneyCardPop {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.88);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureJourneyLineFill`

Duration: `0.7s` · Easing: `ease-out` · Delay: `0.08s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-journey_track-fill`

```css
@keyframes featureJourneyLineFill {
  0% {
    width: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes featureJourneyPulse`

Duration: `0.4s, 2.3s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out` · Delay: `0s, 0.5s` · Iteration: `1, infinite` · Fill: `backwards, none`

Used by: `.canvas-feature .feature-journey_dot._active .feature-journey_dot-circle`

```css
@keyframes featureJourneyPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 var(--primary-shadow);
  }
  50% {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 7px;
  }
}
```

> Shadow pulse/glow effect

### `@keyframes featureFlowNodePop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-flow_node`

```css
@keyframes featureFlowNodePop {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureFlowArrowSlide`

Duration: `0.3s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-flow_arrow`

```css
@keyframes featureFlowArrowSlide {
  0% {
    opacity: 0;
    transform: translateX(-6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureStackPop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature .feature-stack_card`

```css
@keyframes featureStackPop {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(20px) rotate(0deg);
  }
  100% {
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes bundleCardPopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-bundle-offer .bundle-offer_card`

```css
@keyframes bundleCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(25px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes badgePulse`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.canvas-bundle-offer .bundle-offer_badge`

```css
@keyframes badgePulse {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
}
```

> Transform/motion animation

### `@keyframes itemSlideIn`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-bundle-offer .bundle-offer_item`

```css
@keyframes itemSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureBundlePopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature-bundle .feature-bundle_card`

```css
@keyframes featureBundlePopIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(25px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes featureBundleItemSlide`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-feature-bundle .feature-bundle_item`

```css
@keyframes featureBundleItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes statPulse`

Duration: `3s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.canvas-cost-of-chaos .cost-of-chaos_stat-value`

```css
@keyframes statPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
```

> Transform/motion animation

### `@keyframes stackItemSlide`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-cost-of-chaos .cost-of-chaos_stack-item`

```css
@keyframes stackItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineCardPopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.1s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine .magazine-canvas_card`

```css
@keyframes magazineCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineBadgePop`

Duration: `0.5s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine .magazine-canvas_badge`

```css
@keyframes magazineBadgePop {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineTocSlide`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine .magazine-canvas_toc-item`

```css
@keyframes magazineTocSlide {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineStatCount`

Duration: `0.7s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.3s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine .magazine-canvas_stat-value`

```css
@keyframes magazineStatCount {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineOfferCardPopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.2s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine-offer .magazine-offer_card`

```css
@keyframes magazineOfferCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(25px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes magazineOfferBadgePulse`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.canvas-magazine-offer .magazine-offer_badge`

```css
@keyframes magazineOfferBadgePulse {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
}
```

> Transform/motion animation

### `@keyframes magazineOfferBarFill`

Duration: `0.8s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.2s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine-offer .magazine-offer_bar-fill`

```css
@keyframes magazineOfferBarFill {
  0% {
    width: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes magazineOfferItemSlide`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-magazine-offer .magazine-offer_item`

```css
@keyframes magazineOfferItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes reviewCardPopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.1s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-review-stack .review-stack_stack`

```css
@keyframes reviewCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes reviewBadgePulse`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.canvas-review-stack .review-stack_badge`

```css
@keyframes reviewBadgePulse {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
}
```

> Transform/motion animation

### `@keyframes announcementCardPopIn`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.2s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-announcement .announcement_card`

```css
@keyframes announcementCardPopIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(25px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes announcementBadgePulse`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.canvas-announcement .announcement_badge`

```css
@keyframes announcementBadgePulse {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
}
```

> Transform/motion animation

### `@keyframes announcementCountPop`

Duration: `0.6s` · Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` · Delay: `0.3s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-announcement .announcement_count`

```css
@keyframes announcementCountPop {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(10px);
  }
  60% {
    opacity: 1;
    transform: scale(1.08) translateY(-3px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes announcementCategorySlide`

Duration: `0.4s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `backwards`

Used by: `.canvas-announcement .announcement_category`

```css
@keyframes announcementCategorySlide {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes fadeInUp`

```css
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes slideUpBounce`

```css
@keyframes slideUpBounce {
  0% {
    opacity: 0;
    transform: translate3d(0px, 12px, 0px);
  }
  50% {
    opacity: 1;
    transform: translate3d(0px, -2px, 0px);
  }
  100% {
    opacity: 1;
    transform: translateZ(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes bubbleFadeIn`

```css
@keyframes bubbleFadeIn {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes fillIn`

```css
@keyframes fillIn {
  0% {
    opacity: 0;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes cardGlow`

```css
@keyframes cardGlow {
  0%,
  100% {
    box-shadow:
      0 0 0 3px rgba(var(--primary), 0.2),
      0 8px 24px rgba(var(--primary), 0.3),
      0 0 40px rgba(var(--primary), 0.15);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(var(--primary), 0.3),
      0 8px 32px rgba(var(--primary), 0.4),
      0 0 60px rgba(var(--primary), 0.25);
  }
}
```

> Shadow pulse/glow effect

### `@keyframes sparkle1`

```css
@keyframes sparkle1 {
  0%,
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-4px);
    opacity: 0.7;
  }
}
```

> Fade + motion enter animation

### `@keyframes sparkle2`

```css
@keyframes sparkle2 {
  0%,
  100% {
    transform: scale(1) translateX(0px);
    opacity: 0.8;
  }
  50% {
    transform: scale(0.8) translateX(4px);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: 0.09s;
transition:
  transform 0.15s,
  box-shadow 0.15s,
  background-color 0.15s;
transition:
  opacity 0.2s,
  transform 0.2s;
transition: 0.15s;
transition:
  opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
  transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
transition: height 0.15s;
transition: transform 0.2s;
transition: opacity 0.4s;
transition:
  transform 0.4s,
  box-shadow 0.4s;
transition:
  transform 0.5s,
  box-shadow 0.4s;
transition: opacity 0.3s;
transition: 0.3s;
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
    opacity 0.09s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.09s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Duration scale:** `0.09s` · `0.15s` · `0.2s` — use these values, never invent new durations
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
