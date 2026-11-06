# vCraft — Vietnamese Ceramics Design System

Status: implementation specification · Version 1.0 · 6 November 2026

This master defines the public pottery exhibition and brand experience: handcrafted ceramics, clay cookware, and pottery art. It extends vCraft's confirmed focus on artisan stories, provenance, and wholesale coordination. It does not establish a new legal brand, change product permissions, or assume that retail checkout exists. Operational BQL screens may reuse the tokens, with compact sans-serif typography and conventional task layouts.

## 1. Design intent

**Từ tốn:** measured, mindful, organic, rooted, timeless. Artisanal Wabi-Sabi meets warm editorial: precise interfaces around objects that retain their handmade character. Let photography express material irregularity; keep text, alignment, navigation, and controls dependable.

- Men Lam cobalt provides identity, navigation, and the primary action.
- Fired-clay terracotta adds warmth in small quantities: a category detail, a quote rule, a secondary action.
- Rice-paper and unglazed ceramic surfaces provide breathing room.
- Literary serif headings introduce stories; a clear Vietnamese sans-serif carries UI and practical information.
- Asymmetric magazine layouts frame makers and objects without obstructing the reading order.

Avoid nested cards, hard drop shadows, fluorescent accents, gradients used as decoration, glass panels, dashboard gridlines on editorial pages, faux brushstroke fonts, and ornamental pseudo-Vietnamese motifs. Do not turn every image into an arch or every button into a pill. Avoid sales countdowns, fabricated scarcity, and automatic carousels.

### Reference interpretation and cultural boundaries

[Yên Lam's homepage](https://www.gomsuyenlam.vn/) connects craft narratives, workshop identity, product browsing, and journal content. Its writing about unhurried making informs this system's pacing; this is an interpretation of its content hierarchy, not a claim to have measured its computed styles. Do not copy its logo, photography, prose, partner marks, or business claims.

Bát Tràng heritage and cobalt glaze are the requested creative inspiration. Do not label a maker, product, or manufacturing process as Bát Tràng-origin, certified, traditional, food-safe, or sustainable without supporting product data. Yên Lam's own southern Vietnamese workshop history must not be recast as Bát Tràng history.

## 2. Research decisions

UI UX Pro Max was run locally with these searches:

| Search                                                | Verified result                                                   | Decision                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `handcrafted pottery warm editorial --design-system`  | Generic Swiss/minimal system with pink accent                     | Poor domain fit; not adopted                                                              |
| `artisan ceramics --design-system`                    | Craft typography but generic blue/orange tech palette             | Poor fit; not adopted                                                                     |
| `organic earthy mineral --domain color`, then `earth` | No initial match; retry returned Agriculture/Farm Tech green/gold | No verified pottery/mineral palette match; use the explicit brief and custom tokens below |
| `heritage editorial serif --domain typography`        | Editorial Classic and News Editorial pairings                     | Supports literary hierarchy; no cramped display metrics adopted                           |
| `Lora --domain typography`                            | Wellness Calm: organic serif with sans-serif                      | Adopt Lora; substitute Be Vietnam Pro for the requested Vietnamese UI role                |
| `responsive theme tokens --stack html-tailwind`       | CSS-first semantic theme tokens and static utility names          | Adopt for the repository's Tailwind v4                                                    |

These are curated decisions, not an unedited generated recommendation. [Lora's Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/lora/METADATA.pb) and [Be Vietnam Pro's metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/METADATA.pb) list Vietnamese support. [Be Vietnam Pro's authors](https://github.com/bettergui/BeVietnamPro) describe their diacritic and readability work. Configuration follows the official [Tailwind theme documentation](https://tailwindcss.com/docs/theme).

## 3. Token architecture

Use three layers: **primitive → semantic → component**. Primitive colors describe materials; semantic names describe purpose; component variables handle recurring dimensions. Components consume semantic tokens rather than raw hex values. The CSS in section 9 is the executable source for every value below.

### Primitive palette

| Family    | Steps and values                                                                        | Intent                           |
| --------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| Lam       | 50 `#EDF1F5`, 100 `#DCE5EE`, 500 `#3D5F83`, 700 `#264364`, 800 `#1D3557`, 900 `#172B46` | Glaze and cobalt                 |
| Clay      | 50 `#F7ECE6`, 100 `#EED9CE`, 500 `#B45339`, 700 `#8C442D`, 800 `#723622`                | Fired earth                      |
| Paper     | 50 `#FAF8F5`, 100 `#F3EFEA`, 200 `#E8E0D7`                                              | Rice-paper, linen, unglazed ware |
| Ash       | 100 `#E6DFD7`, 400 `#8C8076`, 600 `#655D57`, 800 `#3A3533`, 900 `#242120`               | Wood ash and soot                |
| Botanical | Ink `#4C6554`, wash `#EAF0E8`                                                           | Success                          |
| Ochre     | Ink `#805D26`, wash `#F5EBD8`                                                           | Warning                          |
| Iron      | Ink `#963E35`, wash `#F7E9E5`                                                           | Error                            |

### Semantic palette

| Token / utility suffix                         | Maps to              | Use                                     |
| ---------------------------------------------- | -------------------- | --------------------------------------- |
| `canvas`                                       | Paper 50             | Page background                         |
| `surface`                                      | Paper 100            | Product images, grouped form areas      |
| `surface-raised`                               | Paper 50             | Dialog, popover, card surface           |
| `surface-deep`                                 | Paper 200            | Small neutral bands, skeletons          |
| `ink`                                          | Ash 900              | Body and headlines                      |
| `ink-secondary`                                | Ash 800              | Supporting paragraphs                   |
| `ink-muted`                                    | Ash 600              | Metadata, helper text                   |
| `primary` / `primary-hover` / `primary-active` | Lam 700 / 800 / 900  | Main CTA and navigation                 |
| `on-primary`                                   | Paper 50             | Text/icons on cobalt                    |
| `primary-soft`                                 | Lam 50               | Selected filters and informational wash |
| `accent` / `accent-hover` / `accent-active`    | Clay 500 / 700 / 800 | Limited warm filled actions             |
| `accent-ink`                                   | Clay 700             | Terracotta text on all light surfaces   |
| `accent-soft`                                  | Clay 50              | Warm editorial callout                  |
| `on-accent`                                    | Paper 50             | Labels on solid clay fill               |
| `border`                                       | Ash 100              | Decorative card outline, quiet divider  |
| `border-strong`                                | Ash 400              | Necessary control outline               |
| `focus`                                        | Lam 700              | Keyboard focus on light backgrounds     |
| `success` / `success-soft`                     | Botanical ink / wash | Confirmed result                        |
| `warning` / `warning-soft`                     | Ochre ink / wash     | Attention or pending condition          |
| `danger` / `danger-soft`                       | Iron ink / wash      | Error, destructive action               |
| `disabled` / `disabled-ink`                    | Paper 200 / Ash 600  | Inactive controls                       |

Aim for roughly 75–85% paper surfaces, 10–15% text/photography framing, and 5–10% cobalt/clay interface color. This is compositional guidance, not a rigid quota. Photography supplies the richer material palette.

### Measured accessible pairs

Ratios below were calculated from the opaque sRGB hex values. Retest if opacity, images, overlays, or colors change.

| Foreground / background        | Ratio   | Approved role                               |
| ------------------------------ | ------- | ------------------------------------------- |
| Ash 900 / Paper 50             | 15.08:1 | All text                                    |
| Ash 600 / Paper 100            | 5.63:1  | Metadata and helper text                    |
| Lam 700 / Paper 50             | 9.57:1  | Links, focus, text                          |
| Paper 50 / Lam 700             | 9.57:1  | Primary button label                        |
| Paper 50 / Clay 500            | 4.68:1  | Accent button label; keep fully opaque      |
| Clay 500 / Paper 100           | 4.33:1  | Fails normal text; use `accent-ink` instead |
| Ash 400 / Paper 50             | 3.63:1  | Control boundaries; not normal text         |
| Botanical ink / Botanical wash | 5.50:1  | Success text                                |
| Ochre ink / Ochre wash         | 5.06:1  | Warning text                                |
| Iron ink / Iron wash           | 5.84:1  | Error text                                  |

Ash 100 borders are decorative only. Inputs and interactive outlines use `border-strong`. Require normal text ≥4.5:1, large text ≥3:1, meaningful graphics/control boundaries ≥3:1. Keep muted text readable rather than lowering whole-component opacity.

## 4. Typography and Vietnamese typesetting

**Headings:** Lora, weight 400–500, italic 400 for occasional quotations. **Body/UI:** Be Vietnam Pro, 400 body, 500 labels, 600 emphasis. Do not load unused weights. Fallbacks: Lora → Georgia → serif; Be Vietnam Pro → system-ui → sans-serif.

| Role                  | Size                                        | Line height | Weight / tracking                   |
| --------------------- | ------------------------------------------- | ----------- | ----------------------------------- |
| Display               | `clamp(2.5rem, 1.65rem + 3.4vw, 5rem)`      | 1.25        | Lora 400 / −0.02em                  |
| H1                    | `clamp(2.125rem, 1.5rem + 2.5vw, 4rem)`     | 1.28        | Lora 400 / −0.015em                 |
| H2                    | `clamp(1.75rem, 1.3rem + 1.8vw, 3rem)`      | 1.32        | Lora 400 / −0.01em                  |
| H3 / quote            | `clamp(1.375rem, 1.1rem + 1.1vw, 2rem)`     | 1.4         | Lora 500 / normal                   |
| Lead                  | `clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)` | 1.8         | Be Vietnam Pro 400                  |
| Body                  | 1rem (16px at default settings)             | 1.75        | Be Vietnam Pro 400                  |
| UI / product metadata | 0.875rem                                    | 1.6         | Be Vietnam Pro 400–500              |
| Caption / eyebrow     | 0.8125rem                                   | 1.6         | Be Vietnam Pro 500; eyebrow +0.04em |

- Use sentence case: “Câu chuyện người làm gốm”, not stretched all-caps Vietnamese. Do not remove accents.
- Test `Ấm trà men lam — Bát Tràng`, `Nồi đất giữ hương vị`, `Từ tốn trong từng nét vuốt`, and `Ắ Ằ Ẳ Ẵ Ặ Ế Ề Ể Ễ Ệ Ớ Ờ Ở Ỡ Ợ Ứ Ừ Ử Ữ Ự Đ` at every shipped weight.
- Never clip heading or label containers. No fixed text heights, compressed line-height, negative vertical padding, or forced word breaking. Wrap long product names; show complete names on product details.
- Body measure 60–68ch; lead/quote 36–48ch; display 12–18ch. Left aligned body, no justified paragraphs. Mobile reading width follows the viewport gutter.
- Use semantic h1–h6 independently of visual sizing, one page h1, and native `blockquote`/`cite` for real quotes.
- Host verified Latin + Vietnamese WOFF2 subsets with their OFL files in production, retain correct unicode ranges, and use `font-display: swap`. Preload only the critical face(s). A Latin-only font download is not acceptable.
- For prototypes, link the Google Fonts CSS in the document head: `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap`. The system does not install font packages or assume local font files exist.

## 5. Spatial, shape, and layering tokens

| Concern         | Values / rule                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Spacing unit    | 4px via Tailwind `--spacing: 0.25rem`                                                                                               |
| Scale           | 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px (`0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`) |
| Page gutter     | 20px mobile, 32px tablet, 48px desktop                                                                                              |
| Section rhythm  | 64px mobile → 96px tablet → 128px wide                                                                                              |
| Container       | 80rem maximum including horizontal gutters                                                                                          |
| Reading width   | 65ch maximum                                                                                                                        |
| Control heights | 44px compact, 48px default, 56px prominent                                                                                          |
| Icon size       | 16px inline, 20px UI, 24px navigation; 1.5px consistent SVG stroke                                                                  |
| Radius          | 4px controls, 8px cards/media, 12px dialogs, 9999px status chip only                                                                |
| Borders         | 1px default; 2px selected controls and focus indicator                                                                              |
| Shadow          | None on normal cards; soft dialog/popover only                                                                                      |
| Z-index         | base 0, raised content 10, header 20, scrim 40, dialog 50, notification 60                                                          |

Organic does not mean randomized: subtle corners, linen surfaces, and real clay texture carry the idea. Never jitter alignment or distort reading surfaces to imitate handmade work.

## 6. Layout and image direction

### Responsive rules

Use mobile first. Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Test at 320, 375, 768, 1024, and 1440px, plus 200% zoom and reflow at 400%.

- Catalog: one column by default; two from 40rem; three from 64rem. Use 24px mobile and 32px desktop gaps. A featured collection can use two large cards at desktop; do not force four tight tiles.
- Editorial story: one column on mobile; a 5:7 or 7:5 split on a twelve-column grid from 64rem, with a 48–80px gap and modest vertical offset of 32–64px. Maintain DOM order: introduction → quote/context → related image/caption. Do not reverse essential reading order with CSS.
- Hero: one clear headline, concise context, one primary action, a quiet optional secondary link, and a dominant real image. Mobile height follows content, not a fixed `100vh` crop.
- Stories alternate full-width material photographs, constrained reading columns, and asymmetric maker portraits. Use intentional whitespace rather than empty filler cards.
- Navigation condenses to an accessible menu on smaller screens. Preserve visible page identity, search, and the main route back. No horizontally clipped nav labels.

### Photography

Natural side light, neutral daylight color balance, real clay grain, glaze pooling, wheel marks, tool traces, and hands at work. Product packshots: soft linen/paper grounds with honest color; no heavy sepia filter. Editorial images: workshop context, artisan portrait, macro glaze, clay and firing process. Do not invent provenance through generated documentary images.

Use 4:5 product frames, 3:2 editorial images, 4:5 portraits, and 16:9 wide stories. `object-fit: contain` for silhouette-critical product views; `cover` for narrative photographs with a deliberate focal point. Preserve handle, lid, spout, and rim. Do not crop away product defects that buyers need to assess.

Supply responsive AVIF/WebP with fallback, explicit dimensions/aspect ratio, useful alt text, empty alt for purely decorative duplicates, and credited captions where required. Hero/LCP images load eagerly; below-fold media load lazily. Texture is an optional static, decorative asset at ≤3% visual strength, outside text and controls, never a moving noise filter.

## 7. Component styling contracts

### Buttons and text links

Default button: 48px minimum height, 20px horizontal padding, 8px icon gap, 4px radius, UI font 14px/1.6 at 500. Use one dominant action per section. Compact controls remain ≥44px; icon-only controls have a 44×44px minimum hit area and accessible names.

| Variant     | Rest                                    | Hover / pressed                      | Notes                                                      |
| ----------- | --------------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| Primary     | Cobalt fill, paper label                | Lam 800 / Lam 900                    | Main invitation or submit                                  |
| Accent      | Clay 500 fill, paper label              | Clay 700 / Clay 800                  | Use sparingly; never compete with adjacent primary         |
| Secondary   | Transparent, cobalt text, strong border | Lam 50 fill / Lam 100 fill           | Alternatives                                               |
| Text link   | Cobalt, persistent underline in prose   | Lam 800, thicker underline           | Navigation uses current-page underline and `aria-current`  |
| Destructive | Iron fill, paper label                  | Underline label or add inner outline | Explicit destructive verbs and confirmation when warranted |

Focus: 2px cobalt outline with 3px separation on light surfaces. On cobalt/clay use paper outline; verify contrast against both component and surroundings. Disabled: paper-200 fill, ash-600 label, no interaction or hover. Loading retains width, announces busy state, and prevents duplicate submission; success/error follows with explicit text. Never use a hover-only affordance or animation to reveal the only CTA.

### Product / exhibition card

- One `article` with one media frame and one information area; 1px `border-border`, 8px corner radius, no shadow. Use 16–24px media breathing room and 24px information padding. Keep frame background `surface` and card background `canvas`.
- Title: Lora 20–24px, line-height 1.4. Metadata: Be Vietnam Pro 14px in `ink-muted`. Price only if confirmed data exists; provenance and maker remain meaningful even without a price.
- Primary linked title and image lead to the same detail route. If there is a separate favorite/action button, it is a sibling control, never nested inside a link. Avoid a whole-card anchor wrapping other controls.
- Hover on hover-capable fine pointers: image scale 1.025 over 400ms ease-out, clipped only by its media frame; title underlines. No card lift or expanding shadow. Keyboard focus shows the link outline without requiring zoom. Touch sees the complete resting card.
- Selected filter/card state uses text plus icon/check and a cobalt boundary. “One of a kind”, stock, dimensions, capacity, and maker claims must come from real data.
- Loading reserves the full image and title area with static paper-200 placeholders. Error uses a stable fallback with descriptive text; empty collections explain the result and offer reset filters.

### Artisan story and quotation

Use an unboxed editorial split, a 24–32px Lora quote, thin clay vertical rule, quiet maker credit, and a macro image with caption. Keep quotes authentic and attributed; never fabricate an artisan quotation. Mobile stacks naturally. Long stories use short headings and reading-width paragraphs; no text overlay on busy clay imagery.

### Product detail and provenance

Desktop image gallery + calm reading column; mobile gallery then title, maker, specifications, origin, care and inquiry action. Gallery thumbnails are real buttons with labels and selected state; enlarged view is an accessible dialog. No automatic image cycling.

Provenance uses an ordered timeline/list with explicit stages, dates, source, and verification status where available. Missing data reads “Chưa có thông tin”, not “Đã xác minh”. QR codes have a readable link alternative. Cooking/food-contact/heat-resistance claims require actual evidence; do not infer safe usage from clay appearance.

### Forms, search, and wholesale inquiries

Visible label above field; 16px input text, 48px minimum height, 12–16px horizontal padding, 4px radius, canvas fill and `border-strong`. Helper text uses `ink-muted`; placeholder is an example, never a label. Textarea minimum six lines, vertically resizable. Read-only fields stay legible and explain their state.

Focus uses the shared ring. Errors use iron boundary, icon, and specific text linked with `aria-describedby`/`aria-invalid`. Preserve entered values; after invalid submit focus a linked error summary for multiple errors. Successful inquiries show what was saved/sent, only promise a response time if confirmed. Search supports Enter, clear, result count, empty state and retry without losing the query. Bulk-order quantities and units must be explicit; do not assume payment or allocation rules.

### Filters, tabs, badges, and accordions

Filters: visible labels, 44px minimum controls, selected count, reset, keyboard-operable chips with remove labels; mobile filters open in a dialog/sheet. Tabs use proper tab keyboard behavior only for in-page panels; use links for route navigation. Badges are small quiet washes with readable text and icons when status matters, never terracotta text on linen if it fails contrast. Accordions use native buttons with `aria-expanded`; no animated height required.

### Header, footer, overlays, and feedback

Header: paper canvas, subtle bottom divider, 72px desktop / 64px mobile baseline, content allowed to grow under zoom. Sticky header must leave focused controls and anchored headings visible. Footer: paper-100 or cobalt with paper text; only real contact details, policies and credits.

Dialog/sheet: paper canvas, 12px radius, 24px mobile / 32px desktop padding, soft shadow, scrim. Label and describe appropriately, trap focus, Escape closes, return focus to trigger. Offer an explicit close button; prevent background scrolling. Toasts should not hold essential information; use inline confirmation and one polite status region for changes. Error messages remain until resolved.

Operational tables, if later needed by BQL: sans-serif, clear column headings, tabular numbers, subtle horizontal separators, no enclosing card inside card, and an accessible narrow-screen alternative. The marketing layout does not prescribe business workflow.

## 8. Motion, voice, and accessibility

Motion tokens: instant 0ms, feedback 120ms, standard 200ms, panel 280ms, product image 400ms. Ease-out `cubic-bezier(0.22, 1, 0.36, 1)` for images and entrance; standard `cubic-bezier(0.2, 0, 0, 1)` for color/opacity. Keep feedback immediate; slow brand pacing does not mean slow input response. Animate transform/opacity only, no scroll hijacking, parallax, looping pottery rotations, or reveal animations that hide initial content.

Under `prefers-reduced-motion: reduce`, eliminate zoom, translate, reveal and smooth scrolling. Use static final states. Loading remains understandable without a spinner or shimmer.

Voice: warm, plain, specific, unhurried. Invite exploration with “Khám phá bộ sưu tập”, “Gặp người làm gốm”, or “Tìm hiểu nguồn gốc”. These are sample labels, not proof of existing pages. Prefer “Gửi yêu cầu mua buôn” to an ambiguous “Bắt đầu”. Avoid invented heritage dates, certifications, maker biographies, glowing testimonials, and promises of lifetime durability.

Use `lang="vi"` for Vietnamese pages and mark other-language passages. Keep complete diacritics, Vietnamese names, local measurements, and locale-aware formatting (`Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` for verified prices). Global multilingual support remains a product decision.

Keyboard order follows reading order; include a skip link. Focus remains visible and unobscured. All meaningful controls have names, roles and state, ≥44px preferred touch targets and 8px separation. Information never depends on color, hover, drag or gesture alone. Support text enlargement, password managers and paste wherever authentication exists. Test contrast on actual image overlays; default to text beside photographs.

## 9. Tailwind v4 configuration — copy-ready

The repository uses Tailwind v4 with `@tailwindcss/vite`. Use this CSS-first configuration in `src/styles.css` when implementing the system; a legacy `tailwind.config.js` is not required. This document specifies the configuration without applying it to the running UI. Keep the existing Vite plugin and Start stylesheet link.

```css
@import 'tailwindcss';

:root {
  /* Primitives */
  --lam-50: #edf1f5;
  --lam-100: #dce5ee;
  --lam-500: #3d5f83;
  --lam-700: #264364;
  --lam-800: #1d3557;
  --lam-900: #172b46;
  --clay-50: #f7ece6;
  --clay-100: #eed9ce;
  --clay-500: #b45339;
  --clay-700: #8c442d;
  --clay-800: #723622;
  --paper-50: #faf8f5;
  --paper-100: #f3efea;
  --paper-200: #e8e0d7;
  --ash-100: #e6dfd7;
  --ash-400: #8c8076;
  --ash-600: #655d57;
  --ash-800: #3a3533;
  --ash-900: #242120;

  /* Component and behavior tokens */
  --control-height: 3rem;
  --control-compact: 2.75rem;
  --control-prominent: 3.5rem;
  --card-padding: 1.5rem;
  --focus-width: 2px;
  --focus-offset: 3px;
  --duration-instant: 0ms;
  --duration-feedback: 120ms;
  --duration-standard: 200ms;
  --duration-panel: 280ms;
  --duration-image: 400ms;
  --z-base: 0;
  --z-content: 10;
  --z-header: 20;
  --z-scrim: 40;
  --z-dialog: 50;
  --z-toast: 60;
}

@theme inline {
  /* Clear inherited color utilities so the material palette stays deliberate. */
  --color-*: initial;
  --color-canvas: var(--paper-50);
  --color-surface: var(--paper-100);
  --color-surface-raised: var(--paper-50);
  --color-surface-deep: var(--paper-200);
  --color-ink: var(--ash-900);
  --color-ink-secondary: var(--ash-800);
  --color-ink-muted: var(--ash-600);
  --color-primary: var(--lam-700);
  --color-primary-hover: var(--lam-800);
  --color-primary-active: var(--lam-900);
  --color-on-primary: var(--paper-50);
  --color-primary-soft: var(--lam-50);
  --color-primary-soft-active: var(--lam-100);
  --color-accent: var(--clay-500);
  --color-accent-hover: var(--clay-700);
  --color-accent-active: var(--clay-800);
  --color-accent-ink: var(--clay-700);
  --color-accent-soft: var(--clay-50);
  --color-on-accent: var(--paper-50);
  --color-border: var(--ash-100);
  --color-border-strong: var(--ash-400);
  --color-focus: var(--lam-700);
  --color-success: #4c6554;
  --color-success-soft: #eaf0e8;
  --color-warning: #805d26;
  --color-warning-soft: #f5ebd8;
  --color-danger: #963e35;
  --color-danger-soft: #f7e9e5;
  --color-disabled: var(--paper-200);
  --color-disabled-ink: var(--ash-600);
  --color-scrim: rgb(36 33 32 / 48%);

  --font-display: 'Lora', Georgia, serif;
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;

  --text-display: clamp(2.5rem, 1.65rem + 3.4vw, 5rem);
  --text-display--line-height: 1.25;
  --text-display--letter-spacing: -0.02em;
  --text-title: clamp(2.125rem, 1.5rem + 2.5vw, 4rem);
  --text-title--line-height: 1.28;
  --text-title--letter-spacing: -0.015em;
  --text-section: clamp(1.75rem, 1.3rem + 1.8vw, 3rem);
  --text-section--line-height: 1.32;
  --text-section--letter-spacing: -0.01em;
  --text-subtitle: clamp(1.375rem, 1.1rem + 1.1vw, 2rem);
  --text-subtitle--line-height: 1.4;
  --text-lead: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
  --text-lead--line-height: 1.8;
  --text-body: 1rem;
  --text-body--line-height: 1.75;
  --text-ui: 0.875rem;
  --text-ui--line-height: 1.6;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.6;

  --spacing: 0.25rem;
  --container-page: 80rem;
  --container-reading: 65ch;
  --radius-control: 0.25rem;
  --radius-card: 0.5rem;
  --radius-dialog: 0.75rem;
  --shadow-dialog: 0 16px 48px rgb(36 33 32 / 12%);
  --shadow-popover: 0 8px 24px rgb(36 33 32 / 8%);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-organic: cubic-bezier(0.22, 1, 0.36, 1);

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
}

@layer base {
  html {
    color-scheme: light;
    scroll-padding-top: 6rem;
  }
  body {
    margin: 0;
    background: var(--paper-50);
    color: var(--ash-900);
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.75;
  }
  h1,
  h2,
  h3 {
    font-family: var(--font-display);
    font-weight: 400;
    text-wrap: balance;
  }
  p {
    text-wrap: pretty;
  }
  :focus-visible {
    outline: var(--focus-width) solid var(--lam-700);
    outline-offset: var(--focus-offset);
  }
  :where(button, [role='button']):not(:disabled):not([aria-disabled='true']) {
    cursor: pointer;
  }
  ::selection {
    color: var(--lam-900);
    background: var(--lam-100);
  }
}

@layer components {
  .page-shell {
    width: 100%;
    max-width: 80rem;
    margin-inline: auto;
    padding-inline: 1.25rem;
  }
  .section-space {
    padding-block: 4rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: var(--control-height);
    padding: 0.625rem 1.25rem;
    border: 1px solid transparent;
    border-radius: var(--radius-control);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.6;
    text-align: center;
    text-decoration: none;
    transition:
      background-color var(--duration-feedback) var(--ease-standard),
      color var(--duration-feedback) var(--ease-standard),
      border-color var(--duration-feedback) var(--ease-standard);
  }
  .btn-primary {
    background: var(--lam-700);
    color: var(--paper-50);
  }
  .btn-primary:not(:disabled):active {
    background: var(--lam-900);
  }
  .btn-primary:focus-visible {
    /* Paper gap separates the cobalt button from its cobalt focus outline. */
    box-shadow: 0 0 0 var(--focus-offset) var(--paper-50);
  }
  .btn:disabled {
    background: var(--paper-200);
    color: var(--ash-600);
    cursor: not-allowed;
  }
  .product-card {
    border: 1px solid var(--ash-100);
    border-radius: var(--radius-card);
    background: var(--paper-50);
  }
  .product-media {
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: var(--radius-card) var(--radius-card) 0 0;
    background: var(--paper-100);
  }
  .product-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
    transition: transform var(--duration-image) var(--ease-organic);
  }
  .product-info {
    padding: var(--card-padding);
  }
  .field {
    width: 100%;
    min-height: var(--control-height);
    border: 1px solid var(--ash-400);
    border-radius: var(--radius-control);
    background: var(--paper-50);
    color: var(--ash-900);
    padding: 0.625rem 1rem;
    font: inherit;
  }
  .field::placeholder {
    color: var(--ash-600);
    opacity: 1;
  }
  .field[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
  @media (min-width: 48rem) {
    .page-shell {
      padding-inline: 2rem;
    }
    .section-space {
      padding-block: 6rem;
    }
  }
  @media (min-width: 64rem) {
    .page-shell {
      padding-inline: 3rem;
    }
  }
  @media (min-width: 80rem) {
    .section-space {
      padding-block: 8rem;
    }
  }
  @media (hover: hover) and (pointer: fine) {
    .btn-primary:not(:disabled):hover {
      background: var(--lam-800);
    }
    .btn-primary:not(:disabled):active {
      background: var(--lam-900);
    }
    .product-card:hover .product-image {
      transform: scale(1.025);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-feedback: 0ms;
    --duration-standard: 0ms;
    --duration-panel: 0ms;
    --duration-image: 0ms;
  }
  html {
    scroll-behavior: auto;
  }
  .product-image {
    transform: none !important;
  }
}
```

Use `text-title font-display`, `text-body font-sans`, `bg-canvas text-ink`, `border-border`, `border-border-strong`, `rounded-card`, `max-w-page`, `max-w-reading`, `ease-organic` and `duration-(--duration-image)`. Never reintroduce default `bg-white`, `text-gray-*`, or `border-stone-200`: `border-border` is the warm material equivalent of the requested stone outline. Transparent/current-color utilities remain available from Tailwind. Keep class names complete/static in React variant maps.

Component classes above are starter recipes, not an installed component library. For a secondary button, use `.btn` with complete utility classes `border-border-strong text-primary hover:bg-primary-soft active:bg-primary-soft-active`. On a cobalt footer use `focus-visible:outline-on-primary` for links and controls. Use `z-(--z-dialog)` rather than arbitrary stacking values. Do not apply opacity to disabled wrappers containing explanatory text.

### React composition example

```tsx
<article className="product-card">
  <a href={product.href} className="block rounded-card">
    <div className="product-media">
      <img
        className="product-image"
        src={product.image.src}
        alt={product.image.alt}
        width={800}
        height={1000}
        loading="lazy"
      />
    </div>
    <div className="product-info">
      <h3 className="font-display text-subtitle">{product.name}</h3>
      <p className="mt-2 text-ui text-ink-muted">{product.maker}</p>
      <span className="mt-4 inline-block text-ui text-primary underline underline-offset-4">
        Xem tác phẩm
      </span>
    </div>
  </a>
</article>
```

Use the router's `Link` for known internal routes during implementation. The example presumes real product data and a valid detail destination. Above-fold priority images should not inherit `loading="lazy"` indiscriminately.

## 10. Delivery and acceptance checklist

- [ ] Real pottery photography leads the composition; sources/credits and permissions are recorded.
- [ ] Every color and repeated component dimension maps to this master; page exceptions are documented explicitly.
- [ ] Vietnamese glyphs render in all shipped fonts, weights, normal and italic; no accents clip under zoom.
- [ ] Card image hover is 400ms, fine-pointer only; no card lift or hard shadow; reduced motion is static.
- [ ] Normal text, UI boundaries, focus indicators and status pairs meet their distinct contrast requirements.
- [ ] Keyboard-only navigation, mobile menu, filters, gallery, forms and dialogs work with correct focus handling.
- [ ] Product labels, quotes, dimensions, cooking claims, prices and origin data have real sources.
- [ ] At 320/375/768/1024/1440px and enlarged text, reading order stays coherent and no page-level horizontal scrolling appears.
- [ ] Loading, empty, error, unavailable and success states preserve layout and offer an appropriate next action.
- [ ] Images have responsive sources, reserved dimensions, appropriate loading priority and meaningful alternatives.
- [ ] Fonts retain Vietnamese coverage; no unnecessary font weights or JavaScript animation dependencies ship.
- [ ] Run production build, typecheck, lint, keyboard/screen-reader checks, and rendered visual review when implementing UI.

This delivery is a specification only. Rendered UI, font-file loading, image rights and interactive behavior must be validated when the system is implemented. The comp-first project preference remains in `.impeccable/config.json`; this master does not change that workflow setting or rewrite PRODUCT.md.
