# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component           | Category | Instances | Key Classes                                        |
| ------------------- | -------- | --------- | -------------------------------------------------- |
| **Logo**            | unknown  | 50×       | `.logo`                                            |
| **Menu Item**       | card     | 12×       | `.menu-item`                                       |
| **Body**            | unknown  | 9×        | `._body`, `.content-wrapper-section`               |
| **Sup Title**       | unknown  | 5×        | `._sup-title`                                      |
| **Highlight**       | unknown  | 5×        | `.highlight`                                       |
| **Content Wrapper** | unknown  | 5×        | `.content-wrapper`                                 |
| **Content**         | unknown  | 5×        | `._content`                                        |
| **Button**          | button   | 4×        | `.button`, `.isCTA`, `.signup-button`              |
| **Menu**            | unknown  | 4×        | `._menu`, `.content-layout-block`                  |
| **Head**            | card     | 4×        | `._head`, `.menu-item-section`                     |
| **Title**           | unknown  | 4×        | `._title`                                          |
| **Action**          | unknown  | 4×        | `._action`                                         |
| **A**               | unknown  | 3×        |                                                    |
| **Menu**            | unknown  | 3×        | `._menu`, `.desktop-window-section`                |
| **Head**            | unknown  | 3×        | `._head`, `.content-wrapper-section`, `.isCentred` |
| **Body**            | card     | 3×        | `._body`, `._item-content`                         |
| **Overlay**         | unknown  | 3×        | `._overlay`                                        |
| **Meta**            | unknown  | 3×        | `._meta`                                           |
| **Quote**           | unknown  | 3×        | `._quote`                                          |
| **Button**          | button   | 3×        | `.button`, `.isSmall`, `.isSub`                    |

## Cards

### Menu Item

**Instances found:** 12

**CSS classes:** `.menu-item`

**HTML structure:**

```html
<div class="menu-item ">
  <div class="icon">
    <div class="icon-inbox">
      <span class="path"></span><span class="path1"></span
      ><span class="path2"></span><span class="path3"></span
      ><span class="path4"></span><span class="path5"></span
      ><span class="path6"></span><span class="path7"></span
      ><span class="path8"></span><span class="path9"></span>
    </div>
  </div>
</div>
```

**Base styles (from design tokens):**

````css
.menu-item {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 9px;
  padding: 10px;
}```

### Head

**Instances found:** 4

**CSS classes:** `._head` `.menu-item-section`

**HTML structure:**

```html
<div class="menu-item-section _head"><div class="menu-item-block _icon"><div class="icon"><div class="icon-apps"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span></div></div></div></div>
````

**Base styles (from design tokens):**

````css
._head {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 9px;
  padding: 10px;
}```

### Body

**Instances found:** 3

**CSS classes:** `._body` `._item-content`

**HTML structure:**

```html
<div class="_item-content _body" role="img" aria-label="Yazan &amp; Mawaheb's story background" style="background-image: url(&quot;https://cdn.builder.io/api/v1/image/assets%2F01e4388314244b52988ebaae14b10f10%2F743529d90eaa43dc85ea235192fb2113?format=webp&amp;width=720&quot;);"><span class="_overlay" style="background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(33, 42, 75) 60%);"></span><div class="_content"><div class="_meta"><div role="img" aria-label="Yazan &amp; Mawaheb's company logo" style="background-image: url(&quot;https://cdn.builder.io/api/v1/image/assets%2F01e4388314244b52988ebaae14b
````

**Base styles (from design tokens):**

````css
._body {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 9px;
  padding: 10px;
}```

## Buttons

### Button

**Instances found:** 4

**CSS classes:** `.button` `.isCTA` `.signup-button`

**HTML structure:**

```html
<a href="https://app.plutio.com/signup" class="button signup-button isCTA" target="_blank" rel="noreferrer noopener" data-cta="TopSection"><span class="link-content"><span>Try Plutio Free</span><div class="icon"><div class="icon-arrow-right"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></div></div></span></a>
````

**Base styles (from design tokens):**

````css
.button {
  background: #ffb800;
  color: #ffffff;
  border-radius: 9px;
  padding: 5px 10px;
  cursor: pointer;
}```

### Button

**Instances found:** 3

**CSS classes:** `.button` `.isSmall` `.isSub`

**HTML structure:**

```html
<a href="/stories/yaz-marketing" class="button isSub isSmall" target="_blank" rel="noreferrer noopener"><span class="link-content"><span>Read Story</span><div class="icon"><div class="icon-arrow-top-right"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></div></div></span></a>
````

**Base styles (from design tokens):**

````css
.button {
  background: #ffb800;
  color: #ffffff;
  border-radius: 9px;
  padding: 5px 10px;
  cursor: pointer;
}```

## Other Components

### Logo

**Instances found:** 50

**CSS classes:** `.logo`

**HTML structure:**

```html
<div class="logo"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style="width: 100%; height: 100%;"><title>Basecamp</title><path d="M12.6516 22.453c-4.0328 0-7.575-1.5542-10.244-4.4946a1.11 1.11 0 0 1-.219-1.1338c.7008-1.8884 2.5935-6.2808 5.0205-6.2948h.0125c1.219 0 2.1312.9655 2.8648 1.7412.2192.2324.555.5875.7818.7611.5656-.5587 1.6775-2.4158 2.5422-4.2779.259-.5567.9203-.7985 1.4765-.5402.557.2584.7988.919.5404 1.4762-2.6217 5.6503-4.019 5.6503-4.478 5.6503-1.022 0-1.7628-.7843-2.4791-1.5422-.3208-.339-.9878-1.045-1.2482-1.045h-.0004c-.5665.095-1
````

**Base styles (from design tokens):**

````css
.logo {
  background: #1a1a1a;
  padding: 5px;
}```

### Body

**Instances found:** 9

**CSS classes:** `._body` `.content-wrapper-section`

**HTML structure:**

```html
<div class="content-wrapper-section _body"><div class="demo-window hasTabs "><div class="content-layout-block _menu"><div class="menu-items"><div><a class="menu-item active"><div class="menu-item-section _head"><div class="menu-item-block _icon"><div class="icon"><div class="icon-apps"><span class="path"></span><span class="path1"></span><span class="path2"></span></div></div></div></div></a></div></div></div></div></div>
````

**Base styles (from design tokens):**

````css
._body {
  background: #1a1a1a;
  padding: 5px;
}```

### Sup Title

**Instances found:** 5

**CSS classes:** `._sup-title`

**HTML structure:**

```html
<div class="_sup-title"><p>One App. One AI. Zero Busywork.</p></div>
````

**Base styles (from design tokens):**

````css
._sup-title {
  background: #1a1a1a;
  padding: 5px;
}```

### Highlight

**Instances found:** 5

**CSS classes:** `.highlight`

**HTML structure:**

```html
<span class="highlight">run</span>
````

**Base styles (from design tokens):**

````css
.highlight {
  background: #1a1a1a;
  padding: 5px;
}```

### Content Wrapper

**Instances found:** 5

**CSS classes:** `.content-wrapper`

**HTML structure:**

```html
<div class="content-wrapper"><div class="content-wrapper-section _body"><div class="demo-window hasTabs "><div class="content-layout-block _menu"><div class="menu-items"><div><a class="menu-item active"><div class="menu-item-section _head"><div class="menu-item-block _icon"><div class="icon"><div class="icon-apps"><span class="path"></span><span class="path1"></span></div></div></div></div></a></div></div></div></div></div></div>
````

**Base styles (from design tokens):**

````css
.content-wrapper {
  background: #1a1a1a;
  padding: 5px;
}```

### Content

**Instances found:** 5

**CSS classes:** `._content`

**HTML structure:**

```html
<div class="_content"><div class="_meta"><div role="img" aria-label="Yazan &amp; Mawaheb's company logo" style="background-image: url(&quot;https://cdn.builder.io/api/v1/image/assets%2F01e4388314244b52988ebaae14b10f10%2F78416d081bab4e4f877c9516542af221?format=webp&amp;width=720&quot;);"></div><p>Yazan &amp; Mawaheb<span>YazMarketing</span></p></div><div class="_quote"><h3>"We boosted our sales pipeline by 80% wi…</h3></div></div>
````

**Base styles (from design tokens):**

````css
._content {
  background: #1a1a1a;
  padding: 5px;
}```

### Menu

**Instances found:** 4

**CSS classes:** `._menu` `.content-layout-block`

**HTML structure:**

```html
<div class="content-layout-block _menu"><div class="menu-items"><div><a class="menu-item active"><div class="menu-item-section _head"><div class="menu-item-block _icon"><div class="icon"><div class="icon-apps"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></div></div></div></div></a></div></div></div>
````

**Base styles (from design tokens):**

````css
._menu {
  background: #1a1a1a;
  padding: 5px;
}```

### Title

**Instances found:** 4

**CSS classes:** `._title`

**HTML structure:**

```html
<h2 class="_title">"I used to waste hours every day on admin… now it’s handled for me.”</h2>
````

**Base styles (from design tokens):**

````css
._title {
  background: #1a1a1a;
  padding: 5px;
}```

### Action

**Instances found:** 4

**CSS classes:** `._action`

**HTML structure:**

```html
<div class="_action"><a href="/stories/yaz-marketing" class="button isSub isSmall" target="_blank" rel="noreferrer noopener"><span class="link-content"><span>Read Story</span><div class="icon"><div class="icon-arrow-top-right"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></div></div></span></a></div>
````

**Base styles (from design tokens):**

````css
._action {
  background: #1a1a1a;
  padding: 5px;
}```

### A

**Instances found:** 3

**HTML structure:**

```html
<a class="" href="/pal"><span class="link-content"><div class="icon"><div class="icon-pal"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span></div></div></span></a>
````

**Base styles (from design tokens):**

````css
.a {
  background: #1a1a1a;
  padding: 5px;
}```

### Menu

**Instances found:** 3

**CSS classes:** `._menu` `.desktop-window-section`

**HTML structure:**

```html
<div class="desktop-window-section _menu"><div class="menu-items"><div class="menu-item active"><div class="icon"><div class="icon-toolkit"><span class="path"></span><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></div></div></div></div></div>
````

**Base styles (from design tokens):**

````css
._menu {
  background: #1a1a1a;
  padding: 5px;
}```

### Head

**Instances found:** 3

**CSS classes:** `._head` `.content-wrapper-section` `.isCentred`

**HTML structure:**

```html
<header class="content-wrapper-section _head isCentred"><div class="content-block"><h2 class="_title">"I used to waste hours every day on admi…</h2><div class="_sub-title"><p><br></p></div></div></header>
````

**Base styles (from design tokens):**

````css
._head {
  background: #1a1a1a;
  padding: 5px;
}```

### Overlay

**Instances found:** 3

**CSS classes:** `._overlay`

**HTML structure:**

```html
<span class="_overlay" style="background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(33, 42, 75) 60%);"></span>
````

**Base styles (from design tokens):**

````css
._overlay {
  background: #1a1a1a;
  padding: 5px;
}```

### Meta

**Instances found:** 3

**CSS classes:** `._meta`

**HTML structure:**

```html
<div class="_meta"><div role="img" aria-label="Yazan &amp; Mawaheb's company logo" style="background-image: url(&quot;https://cdn.builder.io/api/v1/image/assets%2F01e4388314244b52988ebaae14b10f10%2F78416d081bab4e4f877c9516542af221?format=webp&amp;width=720&quot;);"></div><p>Yazan &amp; Mawaheb<span>YazMarketing</span></p></div>
````

**Base styles (from design tokens):**

````css
._meta {
  background: #1a1a1a;
  padding: 5px;
}```

### Quote

**Instances found:** 3

**CSS classes:** `._quote`

**HTML structure:**

```html
<div class="_quote"><h3>"We boosted our sales pipeline by 80% wi…</h3></div>
````

**Base styles (from design tokens):**

````css
._quote {
  background: #1a1a1a;
  padding: 5px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#333333` for all dividers within components
- Use `#ffb800` for all interactive/active states

````
