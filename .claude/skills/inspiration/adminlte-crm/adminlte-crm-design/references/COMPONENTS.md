# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component                   | Category | Instances | Key Classes                                                  |
| --------------------------- | -------- | --------- | ------------------------------------------------------------ |
| **Toc Subitem**             | card     | 24×       | `.toc__subitem`                                              |
| **Wp Block Heading**        | unknown  | 24×       | `.wp-block-heading`                                          |
| **Wp Block Image**          | unknown  | 18×       | `.wp-block-image`                                            |
| **Template Card**           | card     | 18×       | `.template-card`                                             |
| **Template Card Meta**      | card     | 18×       | `.template-card__meta`                                       |
| **Template Card Badge**     | card     | 18×       | `.template-card__badge`, `.template-card__badge--stack`      |
| **Template Card Badge**     | card     | 18×       | `.template-card__badge`, `.template-card__badge--best-for`   |
| **Template Card Highlight** | card     | 18×       | `.template-card__highlight`                                  |
| **Blog Btn**                | button   | 18×       | `.blog-btn`                                                  |
| **Primary Btn**             | button   | 18×       | `.primary-btn`, `.prw`                                       |
| **Template Card Badge**     | card     | 11×       | `.template-card__badge`, `.template-card__badge--price-free` |
| **Dwn**                     | button   | 10×       | `.dwn`, `.primary-btn`                                       |
| **Dwn**                     | button   | 8×        | `.dwn`, `.primary-btn`                                       |
| **Template Card Badge**     | card     | 6×        | `.template-card__badge`, `.template-card__badge--price-paid` |
| **Quick Picks Item**        | card     | 5×        | `.quick-picks__item`                                         |
| **Wp Block Heading**        | unknown  | 4×        | `.wp-block-heading`                                          |
| **Container**               | unknown  | 3×        | `.container`                                                 |
| **Col Md 4**                | unknown  | 3×        | `.col-md-4`                                                  |
| **Related Item**            | card     | 3×        | `.related__item`                                             |
| **Related Item Pic**        | card     | 3×        | `.related__item__pic`                                        |

## Cards

### Toc Subitem

**Instances found:** 24

**CSS classes:** `.toc__subitem`

**HTML structure:**

```html
<li class="toc__subitem"><a href="#section-2">1. Apex Dashboard</a></li>
```

**Base styles (from design tokens):**

````css
.toc__subitem {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card

**Instances found:** 18

**CSS classes:** `.template-card`

**HTML structure:**

```html
<div class="template-card"> <div class="template-card__meta"> <span class="template-card__badge template-card__badge--stack">Next.js 16 + React 19 + TypeScript 5 + T…</span><br> <span class="template-card__badge template-card__badge--price-paid">From $69</span><br> <span class="template-card__badge template-card__badge--best-for">Best for: Teams needing a polished, CRM-…</span> </div> <p class="template-card__highlight"><strong>Why we like it:</strong> The CRM dashboard packs real sales pipeline intelligence — deal stage funnels, quarterly target trackers, and per-rep performance cards — not j
````

**Base styles (from design tokens):**

````css
.template-card {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Meta

**Instances found:** 18

**CSS classes:** `.template-card__meta`

**HTML structure:**

```html
<div class="template-card__meta"> <span class="template-card__badge template-card__badge--stack">Next.js 16 + React 19 + TypeScript 5 + T…</span><br> <span class="template-card__badge template-card__badge--price-paid">From $69</span><br> <span class="template-card__badge template-card__badge--best-for">Best for: Teams needing a polished, CRM-…</span> </div>
````

**Base styles (from design tokens):**

````css
.template-card__meta {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Badge

**Instances found:** 18

**CSS classes:** `.template-card__badge` `.template-card__badge--stack`

**HTML structure:**

```html
<span class="template-card__badge template-card__badge--stack">Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4 + shadcn/ui</span>
````

**Base styles (from design tokens):**

````css
.template-card__badge {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Badge

**Instances found:** 18

**CSS classes:** `.template-card__badge` `.template-card__badge--best-for`

**HTML structure:**

```html
<span class="template-card__badge template-card__badge--best-for">Best for: Teams needing a polished, CRM-ready Next.js admin with 6 dashboard variants</span>
````

**Base styles (from design tokens):**

````css
.template-card__badge {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Highlight

**Instances found:** 18

**CSS classes:** `.template-card__highlight`

**HTML structure:**

```html
<p class="template-card__highlight"><strong>Why we like it:</strong> The CRM dashboard packs real sales pipeline intelligence — deal stage funnels, quarterly target trackers, and per-rep performance cards — not just generic chart widgets rebranded as “CRM.”</p>
````

**Base styles (from design tokens):**

````css
.template-card__highlight {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Badge

**Instances found:** 11

**CSS classes:** `.template-card__badge` `.template-card__badge--price-free`

**HTML structure:**

```html
<span class="template-card__badge template-card__badge--price-free">Free / AGPL-3.0</span>
````

**Base styles (from design tokens):**

````css
.template-card__badge {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Template Card  Badge

**Instances found:** 6

**CSS classes:** `.template-card__badge` `.template-card__badge--price-paid`

**HTML structure:**

```html
<span class="template-card__badge template-card__badge--price-paid">From $69</span>
````

**Base styles (from design tokens):**

````css
.template-card__badge {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Quick Picks  Item

**Instances found:** 5

**CSS classes:** `.quick-picks__item`

**HTML structure:**

```html
<li class="quick-picks__item"><strong>Best overall CRM template:</strong> <a href="#apex">Apex Dashboard</a> — 125+ pages, dedicated CRM variant with pipeline KPIs, deal funnels, and per-rep performance cards</li>
````

**Base styles (from design tokens):**

````css
.quick-picks__item {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Related  Item

**Instances found:** 3

**CSS classes:** `.related__item`

**HTML structure:**

```html
<div class="related__item"> <div class="related__item__pic"> <a href="https://adminlte.io/blog/adminlte-upgrading-from-v3-to-v4/"> <img width="300" height="175" src="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png" class="attachment-medium size-medium wp-post-image" alt="" decoding="async" srcset="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png 300w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-1024x596.png 1024w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-768x447.png 768w, https://adminlte.io/wp-co
````

**Base styles (from design tokens):**

````css
.related__item {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

### Related  Item  Pic

**Instances found:** 3

**CSS classes:** `.related__item__pic`

**HTML structure:**

```html
<div class="related__item__pic"> <a href="https://adminlte.io/blog/adminlte-upgrading-from-v3-to-v4/"> <img width="300" height="175" src="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png" class="attachment-medium size-medium wp-post-image" alt="" decoding="async" srcset="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png 300w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-1024x596.png 1024w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-768x447.png 768w, https://adminlte.io/wp-content/uploads/2026/03/adminl
````

**Base styles (from design tokens):**

````css
.related__item__pic {
  background: #000000;
  border-radius: 2px;
  padding: 10px;
}```

## Buttons

### Blog Btn

**Instances found:** 18

**CSS classes:** `.blog-btn`

**HTML structure:**

```html
<div class="blog-btn"> <a class="primary-btn dwn" href="https://dashboardpack.com/theme-details/apex-dashboard-nextjs/?utm_source=adminlte&amp;utm_medium=blog&amp;utm_content=crm-dashboard-templates" target="_blank" rel="nofollow noopener">Info / Download</a> <a class="primary-btn prw" href="https://dashboardpack.com/live-demo-preview/?livedemo=391333" target="_blank" rel="nofollow noopener">Preview</a> </div>
````

**Base styles (from design tokens):**

````css
.blog-btn {
  color: #ffffff;
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
}```

### Primary Btn

**Instances found:** 18

**CSS classes:** `.primary-btn` `.prw`

**HTML structure:**

```html
<a class="primary-btn prw" href="https://dashboardpack.com/live-demo-preview/?livedemo=391333" target="_blank" rel="nofollow noopener">Preview</a>
````

**Base styles (from design tokens):**

````css
.primary-btn {
  color: #ffffff;
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
}```

### Dwn

**Instances found:** 10

**CSS classes:** `.dwn` `.primary-btn`

**HTML structure:**

```html
<a class="primary-btn dwn" href="https://github.com/twentyhq/twenty" target="_blank" rel="nofollow noopener">GitHub (40.5K <img draggable="false" role="img" class="emoji" alt="⭐" src="https://s.w.org/images/core/emoji/17.0.2/svg/2b50.svg">)</a>
````

**Base styles (from design tokens):**

````css
.dwn {
  color: #ffffff;
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
}```

### Dwn

**Instances found:** 8

**CSS classes:** `.dwn` `.primary-btn`

**HTML structure:**

```html
<a class="primary-btn dwn" href="https://dashboardpack.com/theme-details/apex-dashboard-nextjs/?utm_source=adminlte&amp;utm_medium=blog&amp;utm_content=crm-dashboard-templates" target="_blank" rel="nofollow noopener">Info / Download</a>
````

**Base styles (from design tokens):**

````css
.dwn {
  color: #ffffff;
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
}```

## Other Components

### Wp Block Heading

**Instances found:** 24

**CSS classes:** `.wp-block-heading`

**HTML structure:**

```html
<h3 class="wp-block-heading" id="section-2">1. Apex Dashboard</h3>
````

**Base styles (from design tokens):**

````css
.wp-block-heading {
  background: #000000;
  padding: 5px;
}```

### Wp Block Image

**Instances found:** 18

**CSS classes:** `.wp-block-image`

**HTML structure:**

```html
<figure class="wp-block-image"><img decoding="async" src="https://adminlte.io/wp-content/uploads/2026/03/crm-dashboard-templates-apex.jpg" alt="Apex CRM dashboard template showing sales pipeline KPIs, deal stage funnels, and quarterly target tracking"></figure>
````

**Base styles (from design tokens):**

````css
.wp-block-image {
  background: #000000;
  padding: 5px;
}```

### Wp Block Heading

**Instances found:** 4

**CSS classes:** `.wp-block-heading`

**HTML structure:**

```html
<h2 class="wp-block-heading" id="section-1">Best CRM Dashboard Templates</h2>
````

**Base styles (from design tokens):**

````css
.wp-block-heading {
  background: #000000;
  padding: 5px;
}```

### Container

**Instances found:** 3

**CSS classes:** `.container`

**HTML structure:**

```html
<div class="container"> <div class="row d-flex justify-content-center"> <!-- Reading progress bar --> <div class="reading-progress" id="reading-progress"></div> <div class="col-lg-10 col-xl-10"> <div class="blog__details__content"> <!-- Article header --> <div class="blog__details__header"> <div class="blog__details__meta"> <span><i class="ti-calendar" aria-hidden="true"></i> 21 May, 2026</span> <span class="meta__divider"></span> <span><i class="ti-timer" aria-hidden="true"></i> 16 min read</span> <span class="meta__divider"></span> </div> </div> <!-- Article layout: sidebar TOC + content -->
````

**Base styles (from design tokens):**

````css
.container {
  background: #000000;
  padding: 5px;
}```

### Col Md 4

**Instances found:** 3

**CSS classes:** `.col-md-4`

**HTML structure:**

```html
<div class="col-md-4"> <div class="related__item"> <div class="related__item__pic"> <a href="https://adminlte.io/blog/adminlte-upgrading-from-v3-to-v4/"> <img width="300" height="175" src="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png" class="attachment-medium size-medium wp-post-image" alt="" decoding="async" srcset="https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-300x175.png 300w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-1024x596.png 1024w, https://adminlte.io/wp-content/uploads/2026/03/adminlte-preview-768x447.png 768w, ht
````

**Base styles (from design tokens):**

````css
.col-md-4 {
  background: #000000;
  padding: 5px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure

````
