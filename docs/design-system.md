# Nutriservice Design System

Reference document comparing the **official brand spec** against the **current landing page implementation**.
Last updated: May 2026. Remaining gaps marked with `⚠️`.

---

## 1. Brand & Positioning

| | Brand Spec | Landing Page |
|---|---|---|
| Logo | N wordmark + "NUTRISERVICE" / "Inteligencia Nutricional Industrial" | `nutriservice_logo_white.png` / `nutriservice_logo_blue.png` ✓ |
| Tagline | Inteligencia Nutricional Industrial | Used verbatim in hero H1 ✓ |
| Positioning copy | "Nutriservice es el laboratorio de nutrición industrial que traduce ciencia compleja en rendimiento confiable para operaciones a escala productiva." | Hero subhead is a variation; exact sentence not used ⚠️ |

---

## 2. Typography ✓

### 2.1 Typefaces — RESOLVED

| Role | Brand Spec | Landing Page |
|---|---|---|
| Primary / Sans | **Suisse Intl** (commercial) | **IBM Plex Sans** — nearest free equivalent, same industrial/technical character ✓ |
| Mono / Data | **IBM Plex Mono** | **IBM Plex Mono** ✓ |

> **Note:** Suisse Intl is a commercial typeface (~$300+/style) from Swiss Typefaces, not available on Google Fonts. IBM Plex Sans is the closest freely available match — same structured, technical character, compatible weight range (Light 300 → Bold 700). If the client acquires a Suisse Intl license, self-host the font files in `/public/fonts/` and swap the CSS variable in `globals.css`.

**Files updated:**
- `app/layout.tsx` — imports `IBM_Plex_Sans` + `IBM_Plex_Mono` via `next/font/google`
- `app/globals.css` — `--font-sans: var(--font-ibm-sans)` · `--font-mono: var(--font-ibm-mono)`

### 2.2 Type Scale

| Token | Usage |
|---|---|
| H1 — extra-large, Light/Regular | Hero headline |
| H2 — 2xl–4xl, Bold | Section headings |
| Body — base/lg, Regular | Paragraphs |
| Mono — IBM Plex Mono | SKU, LOTE, PH, TEMP, technical data values |
| Eyebrow — 10px, Bold, uppercase, tracked | Section kickers (`text-ns-emerald`) |

---

## 3. Color System ✓

### 3.1 Brand Palette

| Name | Hex | CSS Token | Usage |
|---|---|---|---|
| Grafito | `#111111` | `--color-ns-text` · `--color-ns-dark` | Primary text, dark section backgrounds |
| Blanco | `#F5F5F5` | `--color-ns-surface` · `body bg` | Page background, light surfaces |
| Steel | `#9EA3A8` | `--color-ns-muted` | Muted text, inactive states |
| Steel light | `#BFC2C6` | `--color-ns-subtle` | Very subtle text |
| Steel border | `#D4D6D9` | `--color-ns-border` | Borders, dividers |
| Steel surface-alt | `#EAEBEC` | `--color-ns-surface-alt` | Alternate light backgrounds |
| Azul Eléctrico | `#1E6BFF` | `--color-ns-green` · `--color-ns-emerald` | Primary CTA, links, active tags, eyebrows |
| Azul hover | `#5080FF` | `--color-ns-green-light` | Button/link hover state |
| Azul pressed | `#1556D6` | `--color-ns-green-dark` | Button active/pressed state |

> **Token naming note:** `--color-ns-green` and `--color-ns-emerald` were historically named after a wireframe green palette. Values are now set to Azul Eléctrico. Names are kept to avoid breaking the 20+ files that reference them.

### 3.2 Hero Overlay Colors (separate layer — not in core brand palette)

These are specific to the aquatic hero section treatment and do not override brand tokens:

| Value | Token / Location | Usage |
|---|---|---|
| `#030A1C` | `HOME_BLUE_BG` in `home-blue-band.tsx` | Deep navy — hero bg, cert band |
| `slate-950` | Tailwind | Hero section base |
| `rgba(34,211,238,…)` | Hardcoded in Hero_SA.tsx | Cyan glow accents |
| `rgba(125,211,252,…)` | Hardcoded in Hero_SA.tsx | Sky-blue glow accents |
| `blue-600` | Tailwind | Hero eyebrow rule line |

---

## 4. Buttons

| Variant | Brand Spec | Landing Page |
|---|---|---|
| Primary | Blue fill `#1E6BFF`, white label | Now `ns-green` = `#1E6BFF` ✓ |
| Secondary | Outlined, no fill | `border border-white/55 bg-white/10` (on dark) ✓ |
| Dark / Oscuro | Near-black fill, white label | `bg-[#0a192f]` in nav CTA — minor drift ⚠️ |
| Link | Text + arrow →, brand blue | `text-ns-green` = `#1E6BFF` ✓ |

---

## 5. Form Inputs

| Element | Brand Spec | Landing Page |
|---|---|---|
| Search | Rounded, icon prefix | Not used on landing |
| Dropdown | Rounded, chevron | Not used on landing |
| Text input | Rounded, light border `#D4D6D9` | Footer newsletter uses `ns-border` ✓ |

---

## 6. Iconography ✓

| | Brand Spec | Landing Page |
|---|---|---|
| Style | Outlined, consistent stroke weight | `lucide-react` v1.14 — outlined ✓ |

---

## 7. Tags / Labels ⚠️

Not yet implemented as reusable components.

| Tag | Spec style | Status |
|---|---|---|
| Ingrediente | Steel fill, dark text | Not built ⚠️ |
| Aditivo | `#1E6BFF` fill, white text | Not built ⚠️ |
| Mezcla | Grafito fill, white text | Not built ⚠️ |
| Activo | Blue dot + text | Not built ⚠️ |
| Inactivo | Steel dot + text | Not built ⚠️ |

---

## 8. Cards & Data Components

### 8.1 Dark Summary Card ⚠️
- `AquaHeroSideCard` in `Hero_SA.tsx` is a hero-specific dark-glass card. Not a reusable pattern.
- Spec defines a simpler `CARD OSCURA / RESUMEN` with Grafito `#111111` bg, product name, 3 KPI columns, timestamp, arrow CTA.

### 8.2 Process Flow ⚠️
- Spec: 3-step linear flow (Entrada → Tratamiento → Salida), numbered nodes + connectors.
- Landing: SISTEMA section uses a 4-step grid layout. Concept aligned, format differs.

### 8.3 Ficha Técnica Table ⚠️
- Spec: COMPONENTE / MÍNIMO / MÁXIMO / MÉTODO table with AOAC references.
- Landing: Not on homepage. Relevant for `/productos` and `/soluciones` pages.

### 8.4 Dosage Table ⚠️
- Spec: ESPECIE / ETAPA / DOSIS table.
- Landing: Not implemented yet.

---

## 9. Layout & Spacing ✓

| | Spec | Landing Page |
|---|---|---|
| Max content width | — | `max-w-6xl` (1152px) / `max-w-7xl` (1280px) ✓ |
| Horizontal padding | Standard | `px-6 sm:px-10 lg:px-12` ✓ |
| Nav height | — | `min-h-16` (64px), `py-5` ✓ |
| Scroll behaviour | — | `scroll-behavior: smooth` ✓ |

---

## 10. Remaining Gaps (prioritised)

| Priority | Item | Action |
|---|---|---|
| High | Suisse Intl font | Acquire license → self-host in `/public/fonts/` → swap `--font-ibm-sans` |
| High | Nav primary CTA button | Change `bg-[#0a192f]` → `bg-ns-green` (`#1E6BFF`) |
| Medium | Tag/Label component | Build `<Tag variant="ingrediente|aditivo|mezcla|activo|inactivo">` |
| Medium | Reusable dark card | Extract `AquaHeroSideCard` pattern into a generic `<DarkSummaryCard>` |
| Medium | Ficha Técnica table | Build for `/productos` detail pages |
| Low | Positioning copy | Align hero subhead to exact spec sentence |
| Low | Process flow component | Spec-accurate 3-step linear layout |
