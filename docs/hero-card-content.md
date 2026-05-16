# Hero side card — content review

Reference for all copy, stats, and chart semantics in the homepage hero side card (`AquaHeroSideCard` in `components/Hero_SA.tsx`).

**Last synced from code:** 2026-05-16 (approved client data)  
**Source constants:** `AQUA_HERO_STAT_SLIDES`, `AQUA_HERO_PILLARS`, `AQUA_HERO_HOVER_TYPEWRITER_MS`

---

## Card structure

| Zone | Behavior | Content type |
|------|----------|--------------|
| **Eyebrow** | Static | `Indicadores en campo` |
| **Top** | Rotates every 5s (pauses on hover) | 3 metrics per slide |
| **Top (hover)** | Full stats collapse | Slide-specific typewriter paragraph (~4.5s) |
| **Center (hover)** | Chart frozen + minified stats inline | Abbrev left (FCR, M, N…) · chart · % right (1,5–3,0%, etc.) |
| **Center (default)** | Synced with active slide | Mini chart (ascending / improvement direction) |
| **Top (default)** | `min-h-[7.25rem]`, text wraps | Full metric labels + values (no crop) |
| **Footnote** | Click toggles | Disclaimer ↔ active slide/pillar `source` |
| **Advance control** | Rotate mode only | Top-right ring + chevron (5s progress, click = next slide) |
| **Bottom** | Clickable pillars | Opens pillar-specific card content (click again to return to rotation) |

---

## Static UI copy

| Key | Text |
|-----|------|
| Eyebrow | Indicadores en campo |
| Footnote | \* Rangos orientativos según literatura y ensayos de campo · ilustrativo |
| Rotation interval | 5 seconds |
| Hover typewriter | 4.5 seconds (`AQUA_HERO_HOVER_TYPEWRITER_MS`) |

---

## Slide 1 — Eficiencia (`id: eficiencia`)

**Center chart:** `efficiency-bars` — ascending bars (improvement over cycles)

### Metrics

| Label | Value |
|-------|-------|
| FCR | 1,5–3,0 % mejora en conversión alimenticia\* |
| Costo alimento / kg | 2–4 % reducción costo alimento por kg producido\* |
| Uniformidad | +3–5 pp uniformidad de peso a cosecha\* |

### Hover paragraph

> Los programas que integran enzimas, prebióticos, nucleótidos y palatantes funcionales permiten extraer más energía y proteína de cada kilo de alimento, sostener mejor el consumo en fases críticas y reducir la variabilidad entre animales. El resultado típico es una mejora medible en conversión alimenticia, costo de alimento por kilo producido y uniformidad de peso a cosecha, especialmente cuando la nutrición va alineada con un buen manejo y bioseguridad.

### Source (shown when footnote is clicked)

Datos de literatura técnica y ensayos de campo con mejoras de FCR asociadas a formulación optimizada y uso de enzimas/probióticos/nucleótidos en aves, cerdos y peces [1][2].

---

## Slide 2 — Salud (`id: salud`)

**Center chart:** `risk-curve` — upward trend (health / performance improving)

### Metrics

| Label | Value |
|-------|-------|
| Mortalidad | 0,5–1,5 pp menos en fases críticas\* |
| Episodios severos | 10–20 % menos brotes con intervención masiva\* |
| Días tratamiento | 10–20 % menos días bajo antibióticos\* |

### Hover paragraph

> Al reforzar la barrera intestinal, modular la microbiota y apoyar la respuesta inmunitaria, estos aditivos reducen la incidencia y severidad de cuadros entéricos y respiratorios, así como la mortalidad asociada a fases de alto estrés. Una salud más estable se traduce en menos interrupciones productivas, menor dependencia de terapias antibióticas y más lotes que completan su ciclo dentro de los parámetros sanitarios planificados.

### Source (reference only)

Metaanálisis y reportes de campo que vinculan mejor manejo, nutrición ajustada y uso de aditivos funcionales con menor mortalidad y mejor estado sanitario en monogástricos [2][3].

---

## Slide 3 — Consistencia (`id: consistencia`)

**Center chart:** `sigma-bands` — bands narrow upward toward target box at top

### Metrics

| Label | Value |
|-------|-------|
| Deriva FCR (σ) | 10–15 % menos variación entre lotes\* |
| Merma / rechazo | 5–10 % menos merma fuera de especificación\* |
| Cumplimiento plan | >90 % lotes en rango peso/edad\* |

### Hover paragraph

> Cuando la formulación está respaldada por tecnologías nutricionales estables y bien caracterizadas, la respuesta productiva se vuelve más predecible lote a lote. Se reduce la deriva de FCR, mejora la proporción de animales dentro del rango objetivo de peso y disminuye la merma por canales fuera de especificación. Esta consistencia facilita planificar, cumplir contratos y escalar producción sin sorpresas.

### Source (reference only)

Benchmarks de productores que combinan formulación por fases, monitoreo de FCR y uso de tecnologías nutricionales para reducir la dispersión productiva [1][2].

---

## Slide 4 — Sostenibilidad (`id: sostenibilidad`)

**Center chart:** `impact-stack` — ascending steps (lower environmental load per kg)

### Metrics

| Label | Value |
|-------|-------|
| N excretado / kg | 5–10 % menos N excretado por kg\* |
| P excretado / kg | 10–20 % menos P excretado por kg\* |
| CO₂-eq / kg | 2–5 % menos huella por kg producido\* |

### Hover paragraph

> Una mejor digestibilidad de proteína y fósforo, junto con una conversión alimenticia más eficiente, implica menos nutrientes excretados por kilo producido y menor uso total de materias primas. Esto se refleja en menores cargas de nitrógeno y fósforo al ambiente y en una huella de carbono más baja por unidad de carne, huevo o pescado, alineando la rentabilidad del sistema con los objetivos de sostenibilidad del productor y de la cadena.

### Source (reference only)

Estudios de sostenibilidad que relacionan mejoras en FCR y digestibilidad con menores requerimientos de alimento y menores huellas de N, P y CO₂-eq en producción animal y acuícola [4][5].

---

## Bottom pillars (clickable)

| # | ID | Label | Chart | Card content when selected |
|---|-----|-------|-------|----------------------------|
| 1 | `rendimiento` | Rendimiento | `fcr-bars` | Rendimiento metrics + `efficiency-bars` center chart |
| 2 | `salud` | Salud | `mortality-trend` | Salud metrics + `risk-curve` center chart |
| 3 | `consistencia` | Control | `sigma-converge` | Consistencia metrics + `sigma-bands` center chart |

Click active pillar again to return to auto-rotating slides.

---

## Chart direction convention

All charts use **upward** motion to represent positive outcomes (mejora, reducción de riesgo, menor variación, menor huella). Decorative SVG only — not tied to numeric series.

| Chart ID | Direction |
|----------|-----------|
| `efficiency-bars` | Bars grow left → right |
| `risk-curve` | Curve rises to top-right |
| `sigma-bands` | Bands narrow toward top target |
| `impact-stack` | Steps grow upward |
| `fcr-bars` | Ascending bars |
| `mortality-trend` | Upward curve (health outcome) |
| `sigma-converge` | Convergence toward top target |

---

## How to update

1. Edit `AQUA_HERO_STAT_SLIDES` in `components/Hero_SA.tsx` — each slide has `metrics`, `hoverParagraph`, `theme`, `id`.
2. Pillar labels/charts: `AQUA_HERO_PILLARS` + `PillarChart` / `AquaHeroMiniChart`.
3. Sync this document after copy changes.

---

## Related hero copy (outside card)

| Element | Text |
|---------|------|
| Tag | Excelencia industrial desde 1993 |
| H1 | Inteligencia Nutricional / Industrial. |
| Subcopy | Transformamos ciencia compleja en rendimiento confiable para operaciones productivas de gran escala. |
