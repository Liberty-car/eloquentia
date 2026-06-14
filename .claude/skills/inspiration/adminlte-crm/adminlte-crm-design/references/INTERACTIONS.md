# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured       |
| -------------- | ----- | --------------------- |
| Button         | 1     | default, hover, focus |
| Link           | 3     | default, hover, focus |
| Input          | 1     | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: all, 0.3s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Subscribe`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(0, 95, 213) solid 2px;
/* outline-color: rgb(255, 255, 255) → */
outline-color: rgb(0, 95, 213);
```

**Transition:** `all`

## Link Interactions

### Link 1 — `a`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* color: rgb(13, 110, 253) → */
color: rgb(10, 88, 202);
/* border-color: rgb(13, 110, 253) → */
border-color: rgb(10, 88, 202);
/* outline: rgb(13, 110, 253) none 3px → */
outline: rgb(10, 88, 202) none 3px;
/* outline-color: rgb(13, 110, 253) → */
outline-color: rgb(10, 88, 202);
```

**On focus:**

```css
/* outline: rgb(13, 110, 253) none 3px → */
outline: rgb(0, 95, 213) solid 2px;
/* outline-color: rgb(13, 110, 253) → */
outline-color: rgb(0, 95, 213);
```

**Transition:** `all`

### Link 2 — `Home`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* color: rgb(154, 159, 173) → */
color: rgb(255, 255, 255);
/* border-color: rgb(154, 159, 173) → */
border-color: rgb(255, 255, 255);
/* outline: rgb(154, 159, 173) none 3px → */
outline: rgb(255, 255, 255) none 3px;
/* outline-color: rgb(154, 159, 173) → */
outline-color: rgb(255, 255, 255);
```

**On focus:**

```css
/* outline: rgb(154, 159, 173) none 3px → */
outline: rgb(0, 95, 213) solid 2px;
/* outline-color: rgb(154, 159, 173) → */
outline-color: rgb(0, 95, 213);
```

**Transition:** `all, 0.3s`

### Link 3 — `Documents`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* color: rgb(154, 159, 173) → */
color: rgb(255, 255, 255);
/* border-color: rgb(154, 159, 173) → */
border-color: rgb(255, 255, 255);
/* outline: rgb(154, 159, 173) none 3px → */
outline: rgb(255, 255, 255) none 3px;
/* outline-color: rgb(154, 159, 173) → */
outline-color: rgb(255, 255, 255);
```

**On focus:**

```css
/* outline: rgb(154, 159, 173) none 3px → */
outline: rgb(0, 95, 213) solid 2px;
/* outline-color: rgb(154, 159, 173) → */
outline-color: rgb(0, 95, 213);
```

**Transition:** `all, 0.3s`

## Input Interactions

### Input 1 — `Email Address`

**States:**

- Default: `../screens/states/input-1-default.png`
- Hover: `../screens/states/input-1-hover.png`
- Focus: `../screens/states/input-1-focus.png`

**On focus:**

```css
/* outline: rgb(216, 218, 223) none 3px → */
outline: rgb(0, 95, 213) solid 2px;
/* outline-color: rgb(216, 218, 223) → */
outline-color: rgb(0, 95, 213);
```

**Transition:** `all`

## Interaction Rules

- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.3s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled
