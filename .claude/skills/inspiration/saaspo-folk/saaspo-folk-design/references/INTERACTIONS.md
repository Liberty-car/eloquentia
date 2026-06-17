# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured       |
| -------------- | ----- | --------------------- |
| Role Button    | 2     | default, hover, focus |
| Link           | 3     | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Role Button Interactions

### Role Button 1 — `More`

**States:**

- Default: `../screens/states/role-button-1-default.png`
- Hover: `../screens/states/role-button-1-hover.png`
- Focus: `../screens/states/role-button-1-focus.png`

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(255, 255, 255) none 0px;
```

**Transition:** `all`

### Role Button 2 — `Landing`

**States:**

- Default: `../screens/states/role-button-2-default.png`
- Hover: `../screens/states/role-button-2-hover.png`
- Focus: `../screens/states/role-button-2-focus.png`

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(255, 255, 255) none 0px;
```

**Transition:** `all`

## Link Interactions

### Link 1 — `home`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* outline: rgb(51, 51, 51) none 3px → */
outline: rgb(51, 51, 51) none 0px;
```

**On focus:**

```css
/* outline: rgb(51, 51, 51) none 3px → */
outline: rgb(0, 95, 204) auto 1px;
/* outline-color: rgb(51, 51, 51) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `all`

### Link 2 — `Sections

716`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(255, 255, 255) none 0px;
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(0, 95, 204) auto 1px;
/* outline-color: rgb(255, 255, 255) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `all`

### Link 3 — `OG images

378`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(255, 255, 255) none 0px;
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */
outline: rgb(0, 95, 204) auto 1px;
/* outline-color: rgb(255, 255, 255) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `all`

## Interaction Rules

- Accent color `#ff7900` is used for focus rings, active states, and hover highlights
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled
