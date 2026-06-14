# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 8, 10, 12, 16, 20, 24, 30, 40, 60, 96` px

| Spacing | Semantic Use                   |
| ------- | ------------------------------ |
| 4px     | Tight — within a component     |
| 8px     | Medium — between sibling items |
| 16px    | Wide — between sections        |
| 32px    | Vast — major section breaks    |

## Flex Layouts

| Element                                                        | Direction | Justify       | Align  | Gap         | Children |
| -------------------------------------------------------------- | --------- | ------------- | ------ | ----------- | -------- |
| `nav#w-node-b5f29dc8-d7e6-f1aa-3856-b4d4c0b1dad1-c0b1dacd.nav` | row       | center        | center | 2px         | 5        |
| `div.floating-nav_container.pointer-events-on`                 | row       | space-between | center | 2px         | 2        |
| `div#w-node-b5f29dc8-d7e6-f1aa-3856-b4d4c0b1daf6-c0b1dacd.nav` | row       | —             | —      | normal 16px | 2        |
| `nav#w-node-f99c36c2-8a64-441b-a609-eda65afbbe18-5afbbe13.nav` | row       | center        | center | 2px         | 3        |
| `div#w-node-f99c36c2-8a64-441b-a609-eda65afbbe3d-5afbbe13.nav` | row       | —             | —      | normal 16px | 2        |
| `div.footer1_bottom-wrapper`                                   | row       | space-between | center | —           | 2        |
| `div.footer1_left-wrapper`                                     | column    | —             | —      | —           | 2        |
| `div.meta-grid_component`                                      | column    | —             | —      | 0px         | 5        |
| `a.website-grid_nav.w-inline-block`                            | row       | space-between | —      | —           | 3        |

## Grid Layouts

| Element                                  | Template Columns                | Gap        | Children |
| ---------------------------------------- | ------------------------------- | ---------- | -------- |
| `div.nav_container`                      | `336px 672px 336px`             | 16px       | 3        |
| `div.w-layout-grid.footer1_top-wrapper`  | `708.484px 472.328px`           | 16px 144px | 2        |
| `div.w-layout-grid.footer1_menu-wrapper` | `220.156px 220.172px`           | 16px 32px  | 2        |
| `div.website-grid_list.w-dyn-items`      | `409.594px 409.609px 409.594px` | 48px       | 6        |
| `div.meta-grid_row`                      | `174.625px 261.938px`           | 0px        | 2        |
| `div.meta-grid_row`                      | `174.625px 261.938px`           | 0px        | 2        |
| `div.meta-grid_row`                      | `174.625px 261.938px`           | 0px        | 2        |
| `div.meta-grid_row`                      | `174.625px 261.938px`           | 0px        | 2        |

## Structural Containers

### `<main>` (`main.main-wrapper`)

```
display:          block
children:         3
```

### `<section>` (`section.section_website-grid`)

```
display:          block
children:         1
```

### `<nav>` (`nav#w-node-b5f29dc8-d7e6-f1aa-3856-b4d4c0b1dad1-c0b1dacd.nav`)

```
display:          flex
flex-direction:   row
justify-content:  center
align-items:      center
gap:              2px
children:         5
```

### `<nav>` (`nav#w-node-f99c36c2-8a64-441b-a609-eda65afbbe18-5afbbe13.nav`)

```
display:          flex
flex-direction:   row
justify-content:  center
align-items:      center
gap:              2px
children:         3
```

## Layout Rules

- **Container max-width:** `1440px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale
