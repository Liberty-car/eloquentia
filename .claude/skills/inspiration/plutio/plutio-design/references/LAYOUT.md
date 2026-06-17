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

| Element                                   | Direction | Justify       | Align  | Gap  | Children |
| ----------------------------------------- | --------- | ------------- | ------ | ---- | -------- |
| `header.header`                           | row       | —             | —      | —    | 4        |
| `div.content-wrapper`                     | row       | space-between | center | 8px  | 3        |
| `div.footer-wrapper._main`                | column    | —             | center | —    | 4        |
| `div.footer-wrapper._logo`                | column    | —             | center | —    | 1        |
| `nav.main-menu`                           | row       | —             | center | —    | 5        |
| `div.content-wrapper`                     | row       | —             | —      | 60px | 1        |
| `header.content-wrapper-section._main`    | column    | —             | center | —    | 4        |
| `footer.content-wrapper-section._actions` | row       | center        | center | —    | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |
| `div.content-wrapper-section._actions`    | row       | center        | center | —    | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |
| `div.content-wrapper-section._body`       | column    | —             | —      | 60px | 1        |

## Structural Containers

### `<header>` (`header.header`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      —
children:         4
```

### `<main>` (`main.page`)

```
display:          block
max-width:        1440px
children:         2
```

### `<footer>` (`footer#footer-menu.footer`)

```
display:          block
padding:          0px 45px 45px
max-width:        1300px
children:         2
```

### `<nav>` (`nav.main-menu`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      center
children:         5
```

### `<section>` (`section.topSection.isCentred`)

```
display:          block
padding:          60px 0px 0px
children:         1
```

### `<section>` (`section.section.section_socialproof`)

```
display:          block
max-width:        1440px
children:         1
```

### `<section>` (`section.section.section_stats`)

```
display:          block
children:         1
```

### `<section>` (`section.section.section_items`)

```
display:          block
max-width:        1440px
children:         1
```

### `<section>` (`section.section.section_templates`)

```
display:          block
padding:          36px 0px 0px
max-width:        1440px
children:         1
```

### `<header>` (`header.content-wrapper-section._main`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      center
children:         4
```

### `<header>` (`header.content-wrapper-section._head`)

```
display:          block
padding:          0px 0px 45px
children:         1
```

### `<header>` (`header.content-wrapper-section._head`)

```
display:          block
padding:          0px 0px 45px
children:         1
```

## Layout Rules

- **Container max-width:** `1440px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Every spacing value must be a multiple of **5px**
- Never use arbitrary margin/padding values outside the spacing scale
