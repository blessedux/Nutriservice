# Nutriservice — launch video

Remotion project for the launch video announcing the new brand identity
and website for **nutriservice.cl** (industrial animal nutrition /
maquila-private-label manufacturer — aquaculture, poultry, swine, pets).
Sleek, dark, futuristic, international-B2B register — a different
world from the Fanny Torres Silva video: less hand-drawn/organic, more
engineered.

## Format
- 1080x1080 (square, Instagram feed), 30fps, 18 seconds (540 frames)
- No voiceover — text-only, Spanish
- Abstract/corporate — no specific industry footage (no fish tanks,
  poultry, etc.) — the only "real" imagery is the website itself

## Getting started
```
npm install
npx remotion studio
```
Add screenshots/screen recordings first — see
`public/screenshots/README.md`. See `public/mockups/README.md` for
upgrading the device mockups to photoreal (this needs network access
that this sandbox didn't have, so it's flagged for you to do here).

To render the final mp4:
```
npm run build
```

## Storyboard / timeline
| Scene | Time | Frames | On-screen text | Visual |
|---|---|---|---|---|
| 1. Ensamblaje | 0:00–0:03 | 0–90 | *(none)* | Near-black/HUD-grid background. Thin cyan lines converge fast into a minimal node/molecule brand mark. |
| 2. Declaración | 0:03–0:06 | 90–180 | "Nueva identidad. Misma excelencia." | Mark settles small top-center; text snaps in fast with slight overshoot. |
| 3. Dispositivos | 0:06–0:12 | 180–360 | "Nuevo sitio. Misma visión." | MacBook flies in from an angle (fast spring + motion-blur ramp), settles into a slow floaty drift; iPhone follows a beat later from the opposite side. Both hold with continuous subtle sine-wave float. |
| 4. Cifras | 0:12–0:16 | 360–480 | "+30 años" → "SGS · REP" → "Producción propia" | Three pill-shaped stat/certification chips snap in one at a time with overshoot. |
| 5. Cierre | 0:16–0:18 | 480–540 | "nutriservice.cl" | Brand mark + URL, bookending scene 1, same background. |

## Motion language (important — this is what makes this video different from the first one)
- **Fast in, floaty hold**: entrances use `spring()` with low damping /
  high stiffness for a snappy, slightly-overshooting arrival — not a
  linear or ease-in-out fade. Once settled, a slow `Math.sin()`-based
  drift on rotation/position gives the "suspended in a studio, catching
  light" feel. This pattern is already implemented in `Scene3Devices.tsx`,
  `Scene2Statement.tsx`, `Scene4Chips.tsx`, and `Scene5Close.tsx` — reuse
  the same spring config values (or tune them) rather than inventing a
  new motion system per scene.
- **Speed-ramp / motion blur**: `Scene3Devices.tsx` fades a CSS `blur()`
  filter from ~16px down to 0px over the first ~14 frames of each
  device's entrance, layered under the spring position — this is what
  sells "fast" rather than "sliding in." Reuse this pattern if you add
  more fast entrances.
- Hard cuts between scenes, not crossfades — matches the "sleek/
  engineered" direction from the brief.

## Palette + fonts — placeholders, MUST confirm against the repo
`src/Nutriservice/palette.ts` has guessed hex values (dark navy + cyan)
and guessed font names (Space Grotesk / Inter / IBM Plex Mono) based on
how the live site *looks*. **Before finalizing:** open the actual
nutriservice.cl repo, check `tailwind.config.(js|ts)` / `globals.css` /
`@font-face` declarations, and replace every value in `palette.ts` with
the real ones. This was flagged but not resolved in this sandbox
because it required repo access this environment doesn't have.

## Device mockups
Currently plain CSS (see `MacBookMockup.tsx` / `IPhoneMockup.tsx`) so
the project renders with zero external assets. The brief calls for
**realistic, studio-photography-style** mockups — see
`public/mockups/README.md` for the two upgrade paths (composited PNG
mockup, or a 3D model via `@remotion/three`). Keep the existing
spring + sine-drift motion logic in `Scene3Devices.tsx` regardless of
which asset route you take — it's asset-agnostic.

## Real assets to pull from the live site
- `/assets/home-blue-band/ocean-floor.webm` — hero video, ideal as the
  MacBook screen content (see the `OffthreadVideo` note in
  `public/screenshots/README.md`)
- `/assets/shared/nutribag_workers.webp` or
  `/assets/maquila-section/tab-formulacion-hero.png` — not used in this
  cut per the "keep it abstract, no industry footage" direction, but
  worth having on hand in case that changes

## What's left to do
- [ ] Add real screenshots/screen recording to `public/screenshots/`
- [ ] Sample exact brand colors + confirm exact font names from the repo
- [ ] Decide + implement photoreal device mockup route (PNG composite vs 3D)
- [ ] Swap the brand mark placeholder for the real logo/isotype if one exists
