# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured       |
| -------------- | ----- | --------------------- |
| Button         | 3     | default, hover, focus |
| Role Button    | 1     | default, hover, focus |
| Link           | 3     | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition:
  color 0.3s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.3s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.3s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.3s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1),
  fill 0.3s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.3s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1);
transition: transform 0.167s cubic-bezier(0.33, 0, 0, 1);
transition: all;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Platform`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: lab(96.1596 -0.0828803 -1.13571);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: lab(14.599 -0.159428 -2.99254);
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: lab(14.599 -0.159428 -2.99254) none 3px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: lab(14.599 -0.159428 -2.99254);
/* transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1) → */
transition:
  color 0.05s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  fill 0.05s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.05s cubic-bezier(0.2, 0, 0, 1);
```

**On focus:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: lab(96.1596 -0.0828803 -1.13571);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: lab(14.599 -0.159428 -2.99254);
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1)`

### Button 2 — `Resources`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: lab(96.1596 -0.0828803 -1.13571);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: lab(14.599 -0.159428 -2.99254);
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: lab(14.599 -0.159428 -2.99254) none 3px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: lab(14.599 -0.159428 -2.99254);
/* transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1) → */
transition:
  color 0.05s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  fill 0.05s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.05s cubic-bezier(0.2, 0, 0, 1);
```

**On focus:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: oklab(0.966998 -0.000296682 -0.00296348 / 0.999973);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: oklab(0.2641 -0.000779235 -0.00795579);
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1)`

### Button 3 — `Talk to sales`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**On hover:**

```css
/* border-color: lab(83.208 -0.844151 -5.26234) → */
border-color: lab(50.3787 -1.31875 -9.56043);
/* transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1) → */
transition:
  color 0.05s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  fill 0.05s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.05s cubic-bezier(0.2, 0, 0, 1);
```

**On focus:**

```css
/* border-color: lab(83.208 -0.844151 -5.26234) → */
border-color: oklab(0.573006 -0.0052601 -0.0255506);
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1)`

## Role Button Interactions

### Role Button 1 — `Open Intercom Messenger`

**States:**

- Default: `../screens/states/role-button-1-default.png`
- Hover: `../screens/states/role-button-1-hover.png`
- Focus: `../screens/states/role-button-1-focus.png`

**On hover:**

```css
/* transform: none → */
transform: matrix(1.1, 0, 0, 1.1, 0, 0);
/* transition: transform 0.167s cubic-bezier(0.33, 0, 0, 1) → */
transition: transform 0.25s cubic-bezier(0.33, 0, 0, 1);
```

**On focus:**

```css
/* box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 6px 0px, rgba(0, 0, 0, 0.16) 0px 2px 32px 0px → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
```

**Transition:** `transform 0.167s cubic-bezier(0.33, 0, 0, 1)`

## Link Interactions

### Link 1 — `Attio homepage`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On focus:**

```css
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(10.7201 -0.0959039 -1.54182) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(10.7201 -0.0959039 -1.54182) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `all`

### Link 2 — `Customers`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: lab(96.1596 -0.0828803 -1.13571);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: lab(14.599 -0.159428 -2.99254);
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: lab(14.599 -0.159428 -2.99254) none 3px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: lab(14.599 -0.159428 -2.99254);
/* transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1) → */
transition:
  color 0.05s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  fill 0.05s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.05s cubic-bezier(0.2, 0, 0, 1);
```

**On focus:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: oklab(0.966998 -0.000296682 -0.00296348 / 0.999971);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: oklab(0.2641 -0.000779238 -0.0079558);
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1)`

### Link 3 — `Pricing`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: lab(96.1596 -0.0828803 -1.13571);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: lab(14.599 -0.159428 -2.99254);
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: lab(14.599 -0.159428 -2.99254) none 3px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: lab(14.599 -0.159428 -2.99254);
/* transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1) → */
transition:
  color 0.05s cubic-bezier(0.2, 0, 0, 1),
  background-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  border-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  outline-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  text-decoration-color 0.05s cubic-bezier(0.2, 0, 0, 1),
  fill 0.05s cubic-bezier(0.2, 0, 0, 1),
  stroke 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-from 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-via 0.05s cubic-bezier(0.2, 0, 0, 1),
  --tw-gradient-to 0.05s cubic-bezier(0.2, 0, 0, 1);
```

**On focus:**

```css
/* background-color: rgba(0, 0, 0, 0) → */
background-color: oklab(0.966998 -0.000296682 -0.00296348 / 0.999971);
/* color: lab(20.5697 -0.638425 -4.44436) → */
color: oklab(0.2641 -0.000779237 -0.0079558);
/* box-shadow: none → */
box-shadow:
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  oklab(0.569989 -0.0314532 -0.207309 / 0.3) 0px 0px 0px 3px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
/* outline: lab(20.5697 -0.638425 -4.44436) none 3px → */
outline: rgb(0, 95, 204) none 1px;
/* outline-color: lab(20.5697 -0.638425 -4.44436) → */
outline-color: rgb(0, 95, 204);
```

**Transition:** `color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1)`

## Interaction Rules

- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.3s`, `0.167s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled
