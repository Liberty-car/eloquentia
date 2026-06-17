# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured       |
| -------------- | ----- | --------------------- |
| Button         | 1     | default, hover, focus |
| Link           | 1     | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition:
  color 0.2s,
  border-color 0.2s,
  background 0.2s;
transition:
  filter 0.2s,
  transform 0.2s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Close announcement`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* background-color: rgba(14, 11, 19, 0.6) → */
background-color: rgba(14, 11, 19, 0.8);
/* border-color: rgba(255, 255, 255, 0.12) → */
border-color: rgba(255, 255, 255, 0.25);
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(167, 139, 250) solid 2px;
/* outline-color: rgb(255, 255, 255) → */
outline-color: rgb(167, 139, 250);
```

**Transition:** `color 0.2s, border-color 0.2s, background 0.2s`

## Link Interactions

### Link 1 — `Get React Bits Pro`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* transform: none → */
transform: matrix(1, 0, 0, 1, 0, -1);
```

**On focus:**

```css
/* outline: rgb(18, 15, 23) none 3px → */
outline: rgb(167, 139, 250) solid 2px;
/* outline-color: rgb(18, 15, 23) → */
outline-color: rgb(167, 139, 250);
```

**Transition:** `filter 0.2s, transform 0.2s`

## Interaction Rules

- Accent color `#b497cf` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.2s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled
