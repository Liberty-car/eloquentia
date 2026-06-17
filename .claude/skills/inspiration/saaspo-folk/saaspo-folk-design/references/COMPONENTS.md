# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component                         | Category | Instances | Key Classes                                  |
| --------------------------------- | -------- | --------- | -------------------------------------------- |
| **Website Grid Dots Wrapper**     | unknown  | 7×        | `.website-grid_dots-wrapper`                 |
| **Website Grid External Wrapper** | unknown  | 7×        | `.website-grid_external-wrapper`             |
| **Website Grid Image**            | unknown  | 7×        | `.website-grid_image`                        |
| **Sponsors Tooltip Wrap**         | unknown  | 6×        | `.sponsors_tooltip-wrap`                     |
| **Sponsors Tooltip**              | unknown  | 6×        | `.sponsors_tooltip`                          |
| **W Dyn Item**                    | card     | 6×        | `.w-dyn-item`                                |
| **Website Grid Item**             | card     | 6×        | `.website-grid_item`                         |
| **W Inline Block**                | unknown  | 6×        | `.w-inline-block`, `.website-grid_nav`       |
| **Website Grid Navbar**           | unknown  | 6×        | `.website-grid_navbar`                       |
| **Website Grid Url**              | unknown  | 6×        | `.website-grid_url`                          |
| **W Inline Block**                | card     | 6×        | `.w-inline-block`, `.website-grid_item-link` |
| **Website Grid Image Wrapper**    | unknown  | 6×        | `.website-grid_image-wrapper`                |
| **Sponsors Item**                 | card     | 5×        | `.sponsors_item`, `.w-inline-block`          |
| **Button**                        | button   | 4×        | `.button`, `.w-button`                       |
| **Nav Link**                      | unknown  | 3×        | `.nav_link`, `.w-inline-block`               |
| **Padding Global**                | unknown  | 3×        | `.padding-global`                            |
| **Container Large**               | unknown  | 3×        | `.container-large`                           |
| **Meta Grid Row**                 | unknown  | 3×        | `.meta-grid_row`                             |
| **Meta Grid First Col**           | unknown  | 3×        | `.meta-grid_first-col`                       |
| **Link**                          | unknown  | 3×        | `.link`                                      |

## Cards

### W Dyn Item

**Instances found:** 6

**CSS classes:** `.w-dyn-item`

**HTML structure:**

```html
<div role="listitem" class="w-dyn-item"><div class="website-grid_item"><a data-w-id="b927e0b7-6274-8304-a9ce-3da433c84b55" href="https://cloud.laravel.com/?ref=saaspo.com" target="_blank" class="website-grid_nav w-inline-block"><div class="website-grid_dots-wrapper"><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot red-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot orange-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot green-dot"></div></div><div class="website-grid_navbar"><div class="website-grid_url
```

**Base styles (from design tokens):**

````css
.w-dyn-item {
  background: #222d38;
  border: 1px solid #595959;
  border-radius: 8px;
  padding: 8px;
}```

### Website Grid Item

**Instances found:** 6

**CSS classes:** `.website-grid_item`

**HTML structure:**

```html
<div class="website-grid_item"><a data-w-id="b927e0b7-6274-8304-a9ce-3da433c84b55" href="https://cloud.laravel.com/?ref=saaspo.com" target="_blank" class="website-grid_nav w-inline-block"><div class="website-grid_dots-wrapper"><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot red-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot orange-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot green-dot"></div></div><div class="website-grid_navbar"><div class="website-grid_url">cloud.laravel.com/</div></div><div sty
````

**Base styles (from design tokens):**

````css
.website-grid_item {
  background: #222d38;
  border: 1px solid #595959;
  border-radius: 8px;
  padding: 8px;
}```

### W Inline Block

**Instances found:** 6

**CSS classes:** `.w-inline-block` `.website-grid_item-link`

**HTML structure:**

```html
<a href="/pages/laravel-cloud-landing-page" class="website-grid_item-link w-inline-block"><div class="website-grid_image-wrapper"><img src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/67bc9e9212c2127a6f116503_take.jpeg" loading="lazy" alt="" class="website-grid_image"></div></a>
````

**Base styles (from design tokens):**

````css
.w-inline-block {
  background: #222d38;
  border: 1px solid #595959;
  border-radius: 8px;
  padding: 8px;
}```

### Sponsors Item

**Instances found:** 5

**CSS classes:** `.sponsors_item` `.w-inline-block`

**HTML structure:**

```html
<a href="https://framer.link/gPSSDYb" target="_blank" class="sponsors_item is-framer w-inline-block"><div class="sponsors_tooltip-wrap"><div class="sponsors_tooltip"><div class="sponsors_tooltip-text">Framer: Build better sites, faster</div></div></div><img src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/639997ad49dddb11d0c0efba/6830eb868e59e4b4471b074d_Framer%20Logo%20(3).svg" loading="lazy" alt="" class="sponsors_image is-full-width"></a>
````

**Base styles (from design tokens):**

````css
.sponsors_item {
  background: #222d38;
  border: 1px solid #595959;
  border-radius: 8px;
  padding: 8px;
}```

## Buttons

### Button

**Instances found:** 4

**CSS classes:** `.button` `.w-button`

**HTML structure:**

```html
<a rel="nofollow" href="https://www.folk.app/?ref=saaspo.com" target="_blank" class="button is-secondary w-button">Visit website</a>
````

**Base styles (from design tokens):**

````css
.button {
  background: #ff7900;
  color: #ffffff;
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
}```

## Other Components

### Website Grid Dots Wrapper

**Instances found:** 7

**CSS classes:** `.website-grid_dots-wrapper`

**HTML structure:**

```html
<div class="website-grid_dots-wrapper"><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot red-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot orange-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot green-dot"></div></div>
````

**Base styles (from design tokens):**

````css
.website-grid_dots-wrapper {
  background: #222d38;
  padding: 4px;
}```

### Website Grid External Wrapper

**Instances found:** 7

**CSS classes:** `.website-grid_external-wrapper`

**HTML structure:**

```html
<div style="color:rgb(34,45,56)" class="website-grid_external-wrapper"><div class="w-embed"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17.333 6.33333L17.333 1M17.333 1H11.9997M17.333 1L10.2219 8.11111M7.55523 2.77778H5.59967C4.1062 2.77778 3.35946 2.77778 2.78903 3.06843C2.28727 3.32409 1.87932 3.73204 1.62366 4.2338C1.33301 4.80423 1.33301 5.55097 1.33301 7.04444V12.7333C1.33301 14.2268 1.33301 14.9735 1.62366 15.544C1.87932 16.0457 2.28727 16.4537 2.78903 16.7094C3.35946 17 4.1062 17 5.59967 17H11.2886C12.782 17 13.5288 17 14.099
````

**Base styles (from design tokens):**

````css
.website-grid_external-wrapper {
  background: #222d38;
  padding: 4px;
}```

### Website Grid Image

**Instances found:** 7

**CSS classes:** `.website-grid_image`

**HTML structure:**

```html
<img loading="lazy" src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/6762bd7aa34f42b39f9d2323_-full_page-true-viewport_width-1440-device_scale_factor-2-format-jpg-image_quality-100-delay-10-cache-false-block_cookie_banners-true.jpeg" alt="" class="website-grid_image">
````

**Base styles (from design tokens):**

````css
.website-grid_image {
  background: #222d38;
  padding: 4px;
}```

### Sponsors Tooltip Wrap

**Instances found:** 6

**CSS classes:** `.sponsors_tooltip-wrap`

**HTML structure:**

```html
<div class="sponsors_tooltip-wrap"><div class="sponsors_tooltip"><div class="sponsors_tooltip-text">Framer: Build better sites, faster</div></div></div>
````

**Base styles (from design tokens):**

````css
.sponsors_tooltip-wrap {
  background: #222d38;
  padding: 4px;
}```

### Sponsors Tooltip

**Instances found:** 6

**CSS classes:** `.sponsors_tooltip`

**HTML structure:**

```html
<div class="sponsors_tooltip"><div class="sponsors_tooltip-text">Framer: Build better sites, faster</div></div>
````

**Base styles (from design tokens):**

````css
.sponsors_tooltip {
  background: #222d38;
  padding: 4px;
}```

### W Inline Block

**Instances found:** 6

**CSS classes:** `.w-inline-block` `.website-grid_nav`

**HTML structure:**

```html
<a data-w-id="b927e0b7-6274-8304-a9ce-3da433c84b55" href="https://cloud.laravel.com/?ref=saaspo.com" target="_blank" class="website-grid_nav w-inline-block"><div class="website-grid_dots-wrapper"><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot red-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot orange-dot"></div><div style="background-color: rgb(34, 45, 56);" class="website-grid_dot green-dot"></div></div><div class="website-grid_navbar"><div class="website-grid_url">cloud.laravel.com/</div></div><div style="color:rgb(34,45,56)" class=
````

**Base styles (from design tokens):**

````css
.w-inline-block {
  background: #222d38;
  padding: 4px;
}```

### Website Grid Navbar

**Instances found:** 6

**CSS classes:** `.website-grid_navbar`

**HTML structure:**

```html
<div class="website-grid_navbar"><div class="website-grid_url">cloud.laravel.com/</div></div>
````

**Base styles (from design tokens):**

````css
.website-grid_navbar {
  background: #222d38;
  padding: 4px;
}```

### Website Grid Url

**Instances found:** 6

**CSS classes:** `.website-grid_url`

**HTML structure:**

```html
<div class="website-grid_url">cloud.laravel.com/</div>
````

**Base styles (from design tokens):**

````css
.website-grid_url {
  background: #222d38;
  padding: 4px;
}```

### Website Grid Image Wrapper

**Instances found:** 6

**CSS classes:** `.website-grid_image-wrapper`

**HTML structure:**

```html
<div class="website-grid_image-wrapper"><img src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/67bc9e9212c2127a6f116503_take.jpeg" loading="lazy" alt="" class="website-grid_image"></div>
````

**Base styles (from design tokens):**

````css
.website-grid_image-wrapper {
  background: #222d38;
  padding: 4px;
}```

### Nav Link

**Instances found:** 3

**CSS classes:** `.nav_link` `.w-inline-block`

**HTML structure:**

```html
<a is-active="false" href="/sections" class="nav_link w-inline-block"><div>Sections</div><div class="new-label">716</div></a>
````

**Base styles (from design tokens):**

````css
.nav_link {
  background: #222d38;
  padding: 4px;
}```

### Padding Global

**Instances found:** 3

**CSS classes:** `.padding-global`

**HTML structure:**

```html
<div class="padding-global"><div class="container-large"><div class="padding-section-small"><div class="page_component"><div class="page_left"><div class="page_left-top"><div class="page_site-icon-wrapper"><img src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/677d00e7a4c34933190f76c3_626f2471e14c39400069b3ea_big.png" loading="lazy" alt="" class="page_site-icon"></div><h1 class="heading-style-h3">Folk Landing Page</h1><div class="text-size-small">folk is a CRM to build genuine client co…</div><a rel="nofollow" href="https:/
````

**Base styles (from design tokens):**

````css
.padding-global {
  background: #222d38;
  padding: 4px;
}```

### Container Large

**Instances found:** 3

**CSS classes:** `.container-large`

**HTML structure:**

```html
<div class="container-large"><div class="padding-section-small"><div class="page_component"><div class="page_left"><div class="page_left-top"><div class="page_site-icon-wrapper"><img src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/677d00e7a4c34933190f76c3_626f2471e14c39400069b3ea_big.png" loading="lazy" alt="" class="page_site-icon"></div><h1 class="heading-style-h3">Folk Landing Page</h1><div class="text-size-small">folk is a CRM to build genuine client co…</div><a rel="nofollow" href="https://www.folk.app/?ref=saaspo.co
````

**Base styles (from design tokens):**

````css
.container-large {
  background: #222d38;
  padding: 4px;
}```

### Meta Grid Row

**Instances found:** 3

**CSS classes:** `.meta-grid_row`

**HTML structure:**

```html
<div class="meta-grid_row"><div class="meta-grid_first-col"><div> Page type</div></div><div id="w-node-_0c81bf8b-eee8-b64e-b182-d18642f27506-8cf3c51d" class="meta-grid_second-col"><a href="/page-types/saas-landing-page-examples" class="link w-inline-block"><div>Landing</div></a></div></div>
````

**Base styles (from design tokens):**

````css
.meta-grid_row {
  background: #222d38;
  padding: 4px;
}```

### Meta Grid First Col

**Instances found:** 3

**CSS classes:** `.meta-grid_first-col`

**HTML structure:**

```html
<div class="meta-grid_first-col"><div> Page type</div></div>
````

**Base styles (from design tokens):**

````css
.meta-grid_first-col {
  background: #222d38;
  padding: 4px;
}```

### Link

**Instances found:** 3

**CSS classes:** `.link`

**HTML structure:**

```html
<a href="https://twitter.com/andy_hooke" target="_blank" class="link">@andy_hooke</a>
````

**Base styles (from design tokens):**

````css
.link {
  background: #222d38;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#595959` for all dividers within components
- Use `#ff7900` for all interactive/active states

````
