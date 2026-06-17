# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component                 | Category | Instances | Key Classes                                                    |
| ------------------------- | -------- | --------- | -------------------------------------------------------------- |
| **Flex**                  | unknown  | 17×       | `.flex`, `.flex-col`, `.w-full`                                |
| **Duration 500**          | card     | 17×       | `.duration-500`, `.ease-in-cubic`, `.flex`                     |
| **Font Medium**           | unknown  | 17×       | `.font-medium`, `.leading-[10px]`, `.text-[#242629]`           |
| **Inline Flex**           | unknown  | 14×       | `.inline-flex`, `.relative`, `.text-white-800`                 |
| **Div**                   | unknown  | 12×       |                                                                |
| **Active:Duration 50**    | button   | 8×        | `.active:duration-50`, `.border`, `.button-outline`            |
| **Container**             | unknown  | 7×        | `.container`                                                   |
| **Flex**                  | unknown  | 7×        | `.flex`, `.pl-[8px]`, `.relative`                              |
| **Relative**              | unknown  | 5×        | `.relative`                                                    |
| **Active:Duration 50**    | button   | 4×        | `.active:duration-50`, `.border`, `.button-outline`            |
| **Active:Duration 50**    | button   | 4×        | `.active:duration-50`, `.border`, `.button-primary`            |
| **Flex**                  | card     | 4×        | `.flex`, `.items-center`                                       |
| **Inline Flex**           | unknown  | 3×        | `.inline-flex`, `.relative`, `.text-white-800`                 |
| **Overflow Hidden**       | unknown  | 3×        | `.overflow-hidden`, `.relative`, `.w-full`                     |
| **Bg Primary Background** | button   | 3×        | `.bg-primary-background`, `.border-b`, `.border-subtle-stroke` |
| **Flex**                  | card     | 3×        | `.flex`, `.items-center`, `.justify-center`                    |
| **Font Medium**           | unknown  | 3×        | `.font-medium`, `.leading-[10px]`, `.text-[7px]`               |
| **Flex**                  | unknown  | 3×        | `.flex`, `.flex-col`, `.w-full`                                |
| **Flex**                  | card     | 3×        | `.flex`, `.gap-[6px]`, `.items-center`                         |
| **Flex**                  | card     | 3×        | `.flex`, `.gap-[2px]`, `.items-center`                         |

## Cards

### Duration 500

**Instances found:** 17

**CSS classes:** `.duration-500` `.ease-in-cubic` `.flex` `.gap-[3px]` `.h-[14px]` `.items-center`

**HTML structure:**

```html
<div class="flex h-[14px] items-center gap-[3px] rounded-[4.5px] px-[4px] lg:h-[28px] lg:gap-[6px] lg:rounded-[9px] lg:px-[8px] transition-colors duration-500 ease-in-cubic"><svg class="size-[7px] shrink-0 lg:size-[14px]" viewBox="0 0 14 14" fill="none"><path d="M8.06958 11.8779C8.20948 11.6399 8.51513 11.5604 8.75317 11.7002C8.99086 11.8402 9.07063 12.1459 8.93091 12.3838C8.86917 12.4888 8.79983 12.5894 8.7229 12.6826C8.31268 13.1797 7.69409 13.4999 7.00024 13.5C6.17538 13.5 5.45986 13.0474 5.06958 12.3838C4.92978 12.1458 5.00931 11.8401 5.24731 11.7002C5.48536 11.5604 5.79101 11.6399 5.93091
```

**Base styles (from design tokens):**

````css
.duration-500 {
  background: #1a2233;
  border: 1px solid #505967;
  border-radius: 12px;
  padding: 8px;
}```

### Flex

**Instances found:** 4

**CSS classes:** `.flex` `.items-center`

**HTML structure:**

```html
<div class="flex items-center"><div class="flex shrink-0 items-center justify-center h-[10px] min-w-[10px] rounded-[3px] px-[2px] lg:h-[20px] lg:min-w-[20px] lg:rounded-[6px] lg:px-[4px]"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[7px] lg:size-[14px]"><path d="M8.14648 3.14673C8.34175 2.95147 8.65825 2.95147 8.85352 3.14673C9.04863 3.342 9.04873 3.65855 8.85352 3.85376L5.70703 7.00024L8.85352 10.1467C9.04863 10.342 9.04873 10.6585 8.85352 10.8538C8.6583 11.049 8.34176 11.0489 8.14648 10.8538L4.64648 7.35376C4.45122 7.1585 4.45122
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  border: 1px solid #505967;
  border-radius: 12px;
  padding: 8px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.items-center` `.justify-center` `.px-[0.5px]` `.shrink-0`

**HTML structure:**

```html
<div class="flex shrink-0 items-center justify-center px-[0.5px] lg:px-px"><span class="font-medium text-[7px] text-[rgba(0,0,0,0.55)] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">Configure</span></div>
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  border: 1px solid #505967;
  border-radius: 12px;
  padding: 8px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.gap-[6px]` `.items-center` `.justify-between` `.pl-[3px]` `.pr-[5px]`

**HTML structure:**

```html
<div class="flex items-center justify-between gap-[6px] rounded-[5px] py-[3px] pr-[5px] pl-[3px] lg:gap-[12px] lg:rounded-[10px] lg:py-[6px] lg:pr-[10px] lg:pl-[6px]"><div class="flex items-center gap-[2px] lg:gap-[4px]"><div class="flex shrink-0 items-center justify-center size-[10px] min-w-[10px] rounded-[3px] lg:size-[20px] lg:min-w-[20px] lg:rounded-[6px]"><div class="rounded-full size-[4px] lg:size-[8px]" style="background-color: rgb(245, 163, 0);"></div></div><span class="font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  border: 1px solid #505967;
  border-radius: 12px;
  padding: 8px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.gap-[2px]` `.items-center`

**HTML structure:**

```html
<div class="flex items-center gap-[2px] lg:gap-[4px]"><div class="flex shrink-0 items-center justify-center size-[10px] min-w-[10px] rounded-[3px] lg:size-[20px] lg:min-w-[20px] lg:rounded-[6px]"><div class="rounded-full size-[4px] lg:size-[8px]" style="background-color: rgb(245, 163, 0);"></div></div><span class="font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px] line-through opacity-30">Basepoint x Stripe</span></div>
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  border: 1px solid #505967;
  border-radius: 12px;
  padding: 8px;
}```

## Buttons

### Active:Duration 50

**Instances found:** 8

**CSS classes:** `.active:duration-50` `.border` `.button-outline` `.cursor-pointer` `.disabled:cursor-default` `.disabled:pointer-events-none`

**HTML structure:**

```html
<button class="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[&gt;svg:last-child,&gt;img:last-child]:pr-2 has-[&gt;svg:first-child,&gt;img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[&gt;svg:last-child,&gt;img:last-child]:pr-3 max-lg:has-[&gt;svg:first-child,&gt;img:first-child]:pl-3 button-outline max-md:hidden" data-
````

**Base styles (from design tokens):**

````css
.active:duration-50 {
  color: #cad0d9;
  border-radius: 12px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Active:Duration 50

**Instances found:** 4

**CSS classes:** `.active:duration-50` `.border` `.button-outline` `.cursor-pointer` `.disabled:cursor-default` `.disabled:pointer-events-none`

**HTML structure:**

```html
<a href="https://app.attio.com/" class="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[&gt;svg:last-child,&gt;img:last-child]:pr-2 has-[&gt;svg:first-child,&gt;img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[&gt;svg:last-child,&gt;img:last-child]:pr-3 max-lg:has-[&gt;svg:first-child,&gt;img:first-child]:pl-3 button-out
````

**Base styles (from design tokens):**

````css
.active:duration-50 {
  color: #cad0d9;
  border-radius: 12px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Active:Duration 50

**Instances found:** 4

**CSS classes:** `.active:duration-50` `.border` `.button-primary` `.cursor-pointer` `.disabled:cursor-default` `.disabled:pointer-events-none`

**HTML structure:**

```html
<a href="https://app.attio.com/welcome/sign-in" class="relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm has-[&gt;svg:last-child,&gt;img:last-child]:pr-2 has-[&gt;svg:first-child,&gt;img:first-child]:pl-2 max-lg:h-11.5 max-lg:gap-x-2 max-lg:rounded-xl max-lg:px-3.5 max-lg:text-base max-lg:has-[&gt;svg:last-child,&gt;img:last-child]:pr-3 max-lg:has-[&gt;svg:first-child,&gt;img:first-child]:
````

**Base styles (from design tokens):**

````css
.active:duration-50 {
  color: #cad0d9;
  border-radius: 12px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Bg Primary Background

**Instances found:** 3

**CSS classes:** `.bg-primary-background` `.border-b` `.border-subtle-stroke` `.cursor-pointer` `.duration-150` `.ease-out`

**HTML structure:**

```html
<button type="button" class="flex h-16 w-full items-center justify-center border-subtle-stroke border-b bg-primary-background px-4 font-medium text-[15px] text-accent-foreground leading-5 cursor-pointer hover:text-secondary-foreground transition-colors duration-150 ease-out">Data model</button>
````

**Base styles (from design tokens):**

````css
.bg-primary-background {
  color: #cad0d9;
  border-radius: 12px;
  padding: 4px 8px;
  cursor: pointer;
}```

## Other Components

### Flex

**Instances found:** 17

**CSS classes:** `.flex` `.flex-col` `.w-full`

**HTML structure:**

```html
<div class="flex w-full flex-col"><div class="flex h-[14px] items-center gap-[3px] rounded-[4.5px] px-[4px] lg:h-[28px] lg:gap-[6px] lg:rounded-[9px] lg:px-[8px] transition-colors duration-500 ease-in-cubic bg-[#EEEFF1]"><svg class="size-[7px] shrink-0 lg:size-[14px]" viewBox="0 0 14 14" fill="none"><path d="M5.41699 1.14917C6.33787 0.395804 7.66213 0.395804 8.58301 1.14917L11.8994 3.86304C12.5957 4.43275 12.9999 5.28467 13 6.18433V9.99976C13 11.6566 11.6569 12.9998 10 12.9998H4C2.34315 12.9998 1 11.6566 1 9.99976V6.18433C1.0001 5.28467 1.40429 4.43275 2.10059 3.86304L5.41699 1.14917ZM7.9502 1
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  padding: 4px;
}```

### Font Medium

**Instances found:** 17

**CSS classes:** `.font-medium` `.leading-[10px]` `.text-[#242629]` `.text-[7px]` `.tracking-[-0.14px]`

**HTML structure:**

```html
<span class="font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.28px]">Notifications</span>
````

**Base styles (from design tokens):**

````css
.font-medium {
  background: #1a2233;
  padding: 4px;
}```

### Inline Flex

**Instances found:** 14

**CSS classes:** `.inline-flex` `.relative` `.text-white-800`

**HTML structure:**

```html
<span class="relative inline-flex text-white-800" style="color: rgb(202, 208, 217);">“When<span class="">&nbsp;</span></span>
````

**Base styles (from design tokens):**

````css
.inline-flex {
  background: #1a2233;
  padding: 4px;
}```

### Div

**Instances found:** 12

**HTML structure:**

```html
<div class=""><div class="grid grid-cols-12 justify-items-center py-25"><div class="col-[2/-2]"><div class="grid max-w-7xl grid-cols-6 gap-x-8 gap-y-4.5 max-xl:grid-cols-4 max-xl:gap-y-5 max-lg:gap-x-5 max-lg:gap-y-3 max-md:grid-cols-3 max-md:gap-x-4 max-md:gap-y-2 max-md:[&amp;&gt;*:nth-child(1n+10)]:hidden"><img alt="" loading="lazy" width="172" height="60" decoding="async" data-nimg="1" class="size-full object-contain nth-[n+7]:hidden h-13 max-md:nth-8:hidden max-md:nth-9:hidden max-xl:nth-8:block max-xl:nth-9:block max-xl:h-11" src="https://a.storyblok.com/f/234930/172x60/fcdb777219/granol
````

**Base styles (from design tokens):**

````css
.div {
  background: #1a2233;
  padding: 4px;
}```

### Container

**Instances found:** 7

**CSS classes:** `.container`

**HTML structure:**

```html
<div class="container"><div class="flex flex-col items-center relative mt-24 mb-18 max-xl:mt-20 max-lg:mt-20 max-lg:mb-16"><div data-visual-test="blackout"><a href="https://atlas.attio.com" class="relative block border border-weak-stroke active:border-subtle-stroke transition-colors duration-300 ease-in-out" style="border-radius: 13px;"><div class="absolute -inset-px" style="opacity: 1;"><div class="h-full w-full bg-[conic-gradient(from_var(--angle)_at_var(--x)_var(--y),#A3ECE900,#A3ECE9_20deg,#709FF5_100deg,#709FF5_120deg,#0000_83deg)]" style="border-radius: 13px; --angle: 100deg; --x: 244.61
````

**Base styles (from design tokens):**

````css
.container {
  background: #1a2233;
  padding: 4px;
}```

### Flex

**Instances found:** 7

**CSS classes:** `.flex` `.pl-[8px]` `.relative`

**HTML structure:**

```html
<div class="relative flex pl-[8px] lg:pl-[16px]"><div class="absolute left-[7px] h-[14.5px] w-px -translate-y-[1px] bg-[#D1D3D6] opacity-40 lg:left-[14px] lg:h-[29px] lg:-translate-y-[2px]"></div><div class="flex w-full flex-col"><div class="flex h-[14px] items-center gap-[3px] rounded-[4.5px] px-[4px] lg:h-[28px] lg:gap-[6px] lg:rounded-[9px] lg:px-[8px] transition-colors duration-500 ease-in-cubic"><svg class="size-[7px] shrink-0 lg:size-[14px]" viewBox="0 0 14 14" fill="none"><g clip-path="url(#clip0_19835_2442)"><path d="M0.909424 2.94067C0.263132 1.64598 1.64375 0.276495 2.93286 0.933838L
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  padding: 4px;
}```

### Relative

**Instances found:** 5

**CSS classes:** `.relative`

**HTML structure:**

```html
<div class="relative"><div class="grid w-full grid-cols-2 gap-x-px bg-subtle-stroke lg:grid-cols-4"><div class="relative w-full overflow-hidden"><button type="button" class="flex h-16 w-full items-center justify-center border-subtle-stroke border-b px-4 font-medium text-[15px] leading-5 cursor-pointer hover:text-secondary-foreground transition-colors duration-150 ease-out bg-secondary-background text-secondary-foreground">Ask Attio</button><div class="absolute inset-x-0 bottom-0 h-[3px] bg-subtle-stroke" style="transform: none;"><div class="h-full bg-black-100" style="width: 12.0162%;"></div><
````

**Base styles (from design tokens):**

````css
.relative {
  background: #1a2233;
  padding: 4px;
}```

### Inline Flex

**Instances found:** 3

**CSS classes:** `.inline-flex` `.relative` `.text-white-800`

**HTML structure:**

```html
<span class="relative inline-flex text-white-800" style="color: rgb(202, 208, 217);">CRM.”</span>
````

**Base styles (from design tokens):**

````css
.inline-flex {
  background: #1a2233;
  padding: 4px;
}```

### Overflow Hidden

**Instances found:** 3

**CSS classes:** `.overflow-hidden` `.relative` `.w-full`

**HTML structure:**

```html
<div class="relative w-full overflow-hidden"><button type="button" class="flex h-16 w-full items-center justify-center border-subtle-stroke border-b bg-primary-background px-4 font-medium text-[15px] text-accent-foreground leading-5 cursor-pointer hover:text-secondary-foreground transition-colors duration-150 ease-out">Data model</button></div>
````

**Base styles (from design tokens):**

````css
.overflow-hidden {
  background: #1a2233;
  padding: 4px;
}```

### Font Medium

**Instances found:** 3

**CSS classes:** `.font-medium` `.leading-[10px]` `.text-[7px]` `.text-[rgba(0,0,0,0.55)]` `.tracking-[-0.07px]`

**HTML structure:**

```html
<span class="font-medium text-[7px] text-[rgba(0,0,0,0.55)] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">Configure</span>
````

**Base styles (from design tokens):**

````css
.font-medium {
  background: #1a2233;
  padding: 4px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.flex-col` `.w-full`

**HTML structure:**

```html
<div class="flex w-full flex-col"><div class="flex h-[14px] items-center gap-[3px] rounded-[4.5px] px-[4px] lg:h-[28px] lg:gap-[6px] lg:rounded-[9px] lg:px-[8px] transition-colors duration-500 ease-in-cubic"><svg class="size-[7px] shrink-0 lg:size-[14px]" viewBox="0 0 14 14" fill="none"><path d="M3.80469 1.13867C4.18661 1.10126 4.55892 1.2251 4.93945 1.40527C5.32254 1.58669 5.79059 1.86365 6.375 2.20898L10.2578 4.50293C10.8248 4.83799 11.2802 5.10682 11.6152 5.34863C11.9487 5.5893 12.23 5.8495 12.3818 6.19434C12.6078 6.7077 12.6078 7.2923 12.3818 7.80566C12.23 8.15046 11.9487 8.41071 11.6152 8
````

**Base styles (from design tokens):**

````css
.flex {
  background: #1a2233;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#505967` for all dividers within components

````
