# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30` px

| Spacing | Semantic Use                   |
| ------- | ------------------------------ |
| 4px     | Tight — within a component     |
| 8px     | Medium — between sibling items |
| 16px    | Wide — between sections        |
| 32px    | Vast — major section breaks    |

## Flex Layouts

| Element                          | Direction   | Justify       | Align   | Gap | Children |
| -------------------------------- | ----------- | ------------- | ------- | --- | -------- |
| `div.flex.min-h-screen`          | column      | space-between | —       | —   | 3        |
| `div.pointer-events-none.fixed`  | row         | start         | —       | —   | 1        |
| `footer.relative.flex`           | column      | space-between | —       | —   | 3        |
| `section#home-bento.flex.w-full` | column      | center        | center  | —   | 1        |
| `div.container.flex`             | column      | —             | —       | —   | 1        |
| `section.flex.w-full`            | column      | center        | center  | —   | 1        |
| `div.relative.flex`              | column      | —             | center  | —   | 1        |
| `div.flex.w-full`                | column      | —             | —       | —   | 1        |
| `div.relative.z-1`               | column      | —             | —       | 0px | 3        |
| `div.mt-4.flex`                  | row         | —             | —       | 8px | 2        |
| `div.relative.flex`              | column      | —             | —       | —   | 5        |
| `div.pt-20.lg:flex`              | column      | —             | center  | —   | 2        |
| `div.flex.flex-col`              | row-reverse | —             | stretch | —   | 6        |
| `div.flex.flex-col`              | column      | —             | —       | —   | 3        |
| `div.relative.flex`              | column      | center        | —       | —   | 2        |

## Grid Layouts

| Element                         | Template Columns                                     | Gap         | Children |
| ------------------------------- | ---------------------------------------------------- | ----------- | -------- |
| `div.grid.grid-cols-12`         | `115.828px 115.828px 115.828px 115.828px 115.828px ` | 48px normal | 2        |
| `div.relative.grid`             | `1440px`                                             | —           | 2        |
| `div.grid.grid-rows-[auto_1fr]` | `1390px`                                             | —           | 3        |

## Structural Containers

### `<main>` (`main.bg-primary-background`)

```
display:          block
children:         16
```

### `<footer>` (`footer.relative.flex`)

```
display:          flex
flex-direction:   column
justify-content:  space-between
align-items:      —
children:         3
```

### `<header>` (`header.border-subtle-stroke.border-b`)

```
display:          block
children:         3
```

### `<section>` (`section#home-bento.flex.w-full`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
max-width:        1440px
children:         1
```

### `<section>` (`section.flex.w-full`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
max-width:        1440px
children:         1
```

### `<nav>` (`nav.pt-2.pb-[7px]`)

```
display:          block
padding:          16px 0px 15px
children:         1
```

## Layout Rules

- **Container max-width:** `1440px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale
