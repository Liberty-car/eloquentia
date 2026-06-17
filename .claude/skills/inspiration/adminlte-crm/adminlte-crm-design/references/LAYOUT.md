# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 5px

**Scale:** `5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75` px

| Spacing | Semantic Use                   |
| ------- | ------------------------------ |
| 5px     | Tight — within a component     |
| 10px    | Medium — between sibling items |
| 20px    | Wide — between sections        |
| 40px    | Vast — major section breaks    |

## Flex Layouts

| Element          | Direction | Justify | Align | Gap | Children |
| ---------------- | --------- | ------- | ----- | --- | -------- |
| `div.row`        | row       | —       | —     | —   | 2        |
| `div.row.d-flex` | row       | center  | —     | —   | 2        |
| `div.row`        | row       | —       | —     | —   | 4        |
| `div.row`        | row       | —       | —     | —   | 2        |
| `div.row`        | row       | —       | —     | —   | 3        |

## Grid Layouts

| Element                     | Template Columns | Gap  | Children |
| --------------------------- | ---------------- | ---- | -------- |
| `div.blog__details__layout` | `200px 678px`    | 48px | 2        |

## Structural Containers

### `<header>` (`header.header.header-normal`)

```
display:          block
padding:          20px 0px 25px
children:         1
```

### `<main>` (`main#main-content`)

```
display:          block
children:         1
```

### `<footer>` (`footer#footerSection.footer`)

```
display:          block
padding:          145px 0px 0px
children:         2
```

### `<section>` (`section.blog-details.spad`)

```
display:          block
padding:          80px 0px 100px
children:         1
```

### `<nav>` (`nav.toc-sidebar__inner`)

```
display:          block
padding:          0px 8px 0px 0px
children:         2
```

## Layout Rules

- **Container max-width:** `1270px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **5px**
- Never use arbitrary margin/padding values outside the spacing scale
