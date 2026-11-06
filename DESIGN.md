---
name: vCraft — The Living Pottery Archive
description: A warm editorial exhibition of pottery, with clearly labelled illustrative content.
colors:
  canvas: '#faf8f5'
  surface: '#f3efea'
  ink: '#242120'
  ink-secondary: '#3a3533'
  ink-muted: '#655d57'
  primary: '#264364'
  primary-hover: '#1d3557'
  primary-active: '#172b46'
  on-primary: '#faf8f5'
  primary-soft: '#edf1f5'
  accent: '#b45339'
  accent-ink: '#8c442d'
  border: '#e6dfd7'
  border-strong: '#8c8076'
  selection: '#dce5ee'
typography:
  display:
    fontFamily: 'Lora, Georgia, serif'
    fontSize: 'clamp(2.125rem, 1.5rem + 2.5vw, 4rem)'
    fontWeight: 400
    lineHeight: 1.28
    letterSpacing: '-0.015em'
  headline:
    fontFamily: 'Lora, Georgia, serif'
    fontSize: 'clamp(1.75rem, 1.3rem + 1.8vw, 3rem)'
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: '-0.01em'
  title:
    fontFamily: 'Lora, Georgia, serif'
    fontSize: 'clamp(1.375rem, 1.1rem + 1.1vw, 2rem)'
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: 'Be Vietnam Pro, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: 'Be Vietnam Pro, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.6
  caption:
    fontFamily: 'Be Vietnam Pro, system-ui, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: '4px'
  card: '8px'
spacing:
  '4': '4px'
  '8': '8px'
  '12': '12px'
  '16': '16px'
  '20': '20px'
  '24': '24px'
  '32': '32px'
  '40': '40px'
  '48': '48px'
  '64': '64px'
  '96': '96px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '10px 20px'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
  button-primary-active:
    backgroundColor: '{colors.primary-active}'
  menu-toggle:
    textColor: '{colors.primary}'
    rounded: '{rounded.control}'
    padding: '8px 12px'
  product-card:
    backgroundColor: '{colors.canvas}'
    rounded: '{rounded.card}'
  product-caption:
    textColor: '{colors.ink}'
    padding: '20px 24px'
  navigation-link:
    textColor: '{colors.ink}'
  archive-note:
    textColor: '{colors.ink-secondary}'
---

# Design System: vCraft

## Overview

**Creative North Star: "The Living Pottery Archive"**

A living archive brings the object, its maker, and its making into view together. vCraft feels unhurried, tactile, and grounded in people. Rice-paper surfaces, literary headings, and natural-light pottery imagery carry the approved warm editorial world; dependable navigation and controls frame the objects.

The first implementation follows the user-selected wide exhibition composition B: an introductory band, panoramic still life, and three curated sample pieces. The present content is explicitly illustrative. Maker stories and provenance remain future content requiring evidence; PRODUCT.md governs product facts.

This record reconciles the approved seed with `src/styles.css`, `src/fonts/styles.css`, `src/routes/__root.tsx`, and `src/routes/home/`. The interface uses ordinary CSS. MASTER.md remains the broader specification; its unimplemented components and Tailwind recipes are not runtime authority. Development screenshots in `.impeccable/review/` support the visual record. The automated comp build gate remains open: component-review capture refused the live TSX target because the pinned snapshot requires its HTML entry; no final receipt is recorded here.

**Key Characteristics:**

- Measured and mindful: “Từ tốn” guides visual pacing without delaying interaction.
- Material warmth: rice paper, cobalt glaze, fired clay, and wood ash.
- Literary clarity: Lora headings and Be Vietnam Pro interface text.
- Honest evidence: illustrative pieces are labelled and missing provenance stays explicit.
- Editorial breathing room: spacious imagery with coherent source and mobile reading order.

**The Material Evidence Rule.** Let pottery imagery express material character; keep typography, alignment, navigation, and controls dependable.

## Colors

The implemented palette is earthy and mineral, with restrained cobalt actions and fired-clay hairlines. Frontmatter values mirror the CSS roles; the unused declared `surface-deep` color is not promoted into a component role. Sidecar tonal ramps are derived preview aids, not additional installed CSS tokens.

### Primary

- **Men Lam — Cobalt Glaze** (`primary`) colors the main action, links, focus outlines, and mobile menu text. `primary-hover` and `primary-active` deepen the action on interaction; `on-primary` supplies the paper label. `primary-soft` is the tap-highlight wash.

### Secondary

- **Đất Nung — Fired Clay** (`accent`) draws the header, navigation, hero-copy, and section-heading rules. **Deep Fired Clay** (`accent-ink`) supplies the skip-link focus outline.

### Neutral

- **Rice Paper** (`canvas`) is the page and card background; **Unglazed Linen** (`surface`) underlies product images.
- **Wood-Ash Charcoal** (`ink`) carries headings and navigation; **Soft Soot** (`ink-secondary`) supports paragraphs; **Warm Ash** (`ink-muted`) carries captions and content-status copy.
- **Warm Outline** (`border`) separates cards, notes, and footer. **Strong Ash** (`border-strong`) defines the mobile menu boundary and scrollbar. `selection` pairs with the active cobalt text color for selected text.

**The Glaze and Ground Rule.** Let paper surfaces and pottery imagery dominate; use cobalt to establish action hierarchy and clay for restrained warm details.

## Typography

**Display Font:** Lora, Georgia, serif. **Body Font:** Be Vietnam Pro, system-ui, sans-serif. Local font files use `font-display: swap`; Be Vietnam Pro 400/500/600, Lora normal 400/500, and Lora italic 400 are loaded. The current visible headings use regular Lora, while controls use medium Be Vietnam Pro.

### Hierarchy

- **Display:** frontmatter `display` maps to `--text-title`, used for the narrow-screen hero and not-found heading. The hero changes to `--text-section` from 64rem, then `clamp(2.125rem, 3.5vw, 4rem)` from 80rem; its line height stays 1.28.
- **Headline:** frontmatter `headline` maps to `--text-section`. The collection heading changes to `clamp(1.75rem, 2.5vw, 3rem)` at 80rem.
- **Title:** `--text-subtitle` serves archive-note headings. Product titles use 1.5rem/1.4 below 80rem, then the subtitle token.
- **Body:** 1rem/1.75; archive paragraphs and the collection note have 65ch maximum widths. Hero copy is capped at 48ch, uses 0.875rem/1.6 from 64rem, then 1.125rem from 80rem.
- **Label:** primary actions are 0.875rem/1.6, weight 500. The wide hero action becomes 1.125rem at 80rem. Navigation uses 0.875rem, weight 500, then 1.125rem at 80rem.
- **Caption:** 0.8125rem for illustration labels, collection disclaimer, and footer copy; product illustration labels become 1rem at 80rem. Content-status paragraphs use 0.875rem.

**The Complete Voice Rule.** Preserve Vietnamese accents and full names; allow headings and body copy to wrap without clipping diacritics.

## Layout

The `.page-shell` is full width with a 104.5rem maximum, centered, with 20px gutters. Gutters become 32px at 48rem, 48px at 64rem, and 4.1vw at 80rem. Recurring spacing is recorded in frontmatter; it is an extracted vocabulary, not an enforced mathematical scale.

Below 64rem, the hero introduction stacks headline, copy, and action with a 24px gap and 40px vertical padding. From 64rem it is a horizontal `1.65fr 1.1fr auto` grid with 32px gaps and padding; from 80rem it uses `1.6fr 1.05fr auto` with 24px vertical padding. Desktop hero copy is separated by a clay rule. The hero image is full bleed, 2170:725 on smaller screens and 1672:325 from 64rem, with a center/48% crop.

The collection has 48px/64px top/bottom padding, changing to 32px/64px at 64rem. Its centered heading sits between fine clay rules. Product columns progress from one to two at 40rem and three at 64rem. Gaps are 24px, increasing to 32px at 80rem. Product media uses 498:217 with `object-fit: contain`. Captions have 20px/24px vertical/horizontal padding, with 16px vertical padding at 80rem.

Archive notes stack with a 48px gap, then form two equal columns with 64px gaps at 64rem. Bottom space grows from 64px to 96px. Header content wraps; its baseline minimum is 72px, 64px below 48rem and at 80rem. Mobile navigation expands in normal flow. Footer content wraps in source order with 32px vertical padding.

**The Reading Order Rule.** Preserve logical source order, keyboard order, and narrow-screen flow when extending editorial layouts.

## Elevation & Depth

The current exhibition has no decorative drop shadows. Photography, tonal image grounds, fine borders, and whitespace create depth. The primary action's `0 0 0 3px var(--color-canvas)` focus shadow is a paper separation gap around the shared cobalt outline, not surface elevation.

**The Quiet Surface Rule.** Keep exhibition cards flat; do not add card lift, hard shadows, glass, gradients, or glow to this world.

## Shapes

Controls use 4px corners and product cards use 8px corners. Product frames clip their upper corners to the card radius. Borders are 1px; horizontal and vertical clay rules establish editorial divisions. Photographs remain rectangular, and there are no pill controls or decorative arch masks in the implementation.

## Components

### Buttons

The primary action is a cobalt, paper-text inline link with 4px corners, a 48px minimum height, 10px/20px padding, and a 12px icon gap. The hero version has a 56px minimum height at 80rem. Hover and active colors deepen over 120ms with `cubic-bezier(0.2, 0, 0, 1)`. Shared focus is a 2px cobalt outline offset by 3px; the primary action adds the paper gap. “Khám phá bộ sưu tập” goes to the collection anchor. No secondary or disabled button variant is implemented.

### Navigation

The Lora wordmark links to `/home`. “Bộ sưu tập”, “Câu chuyện”, and “Nguồn gốc” link to real home-page anchors. Links use charcoal text, cobalt plus underline on hover, visible keyboard focus, and a 44px minimum height. There is no distinct active-link style. Wide navigation has 40px spacing and a clay left rule.

Below 48rem a bordered “Menu”/“Đóng” button controls the stacked navigation with `aria-expanded` and `aria-controls`. Escape closes it and returns focus to the toggle; selecting a link closes it. The skip link “Đến nội dung chính” appears on focus and targets the focusable main region.

### Curated product gallery

Three noninteractive figures show “Bình men lam”, “Ấm gốm”, and “Nồi đất”. Flat paper cards have a warm outline, contained image media, centered Lora names, and “Hình ảnh minh họa” captions. They are sample exhibits, with no fabricated detail link, price, maker, or purchase action. A visible collection disclaimer says they do not represent products offered for sale.

Only hover-capable fine pointers receive the 1.025 image zoom, over 400ms using `cubic-bezier(0.22, 1, 0.36, 1)`. Reduced motion makes both transition durations 0ms and explicitly removes the image transform. Images reserve dimensions, provide Vietnamese alternatives, and use WebP with PNG fallback; product images load lazily while the hero has high fetch priority.

### Archive notes

“Đằng sau một dáng gốm” and “Từ đất đến tác phẩm” are plain editorial columns with top borders, 32px top padding, Lora headings, and 65ch paragraphs. Their status copy explicitly says authenticated artisan stories and provenance are unavailable. These are contextual notes, not implemented artisan or provenance records.

### Footer

The paper footer uses a warm top rule, a 1.75rem Lora wordmark, muted text, and a 44px-high “Về đầu trang” link. It contains only the exhibition description and real navigation. No contact information or policy destinations are invented.

## Do's and Don'ts

### Do

- Do preserve rice-paper grounds, cobalt actions, clay hairlines, and the Lora/Be Vietnam Pro pairing.
- Do label illustrative imagery and sample pieces; keep missing stories and provenance explicit.
- Do preserve Vietnamese diacritics, visible focus, usable targets, and reduced-motion behavior.
- Do retain complete product silhouettes with contained gallery imagery.
- Do keep object, maker, and provenance meaningfully connected when authentic records become available.

### Don't

- Don't invent maker biographies, quotations, prices, certifications, origin, or cooking-safety claims.
- Don't turn static sample figures into apparent product links without real destinations.
- Don't add nested card shells, floating product shadows, fluorescent accents, or decorative heritage motifs.
- Don't hide essential information behind hover or add motion that withholds initial content.
- Don't treat this as-built record or development screenshots as a completed comp review receipt.
