/**
 * Public static asset paths grouped by consuming UI area.
 * Files live under `public/assets/{area}/`.
 */
export const PUBLIC_ASSETS = {
  brand: {
    favicon: "/assets/brand/favicon.ico",
    icon512: "/assets/brand/android-chrome-512x512.png",
    isotipo: "/assets/brand/isotipo.svg",
    logoBlue: "/assets/brand/logo-blue.png",
    logoWhite: "/assets/brand/logo-white.png",
  },
  audio: {
    ambient: "/assets/audio/first-blossom.mp3",
    heroSeaUnderwater: "/assets/audio/sea-underwater.mp3",
  },
  preloader: {
    background: "/assets/preloader/background.png",
  },
  hero: {
    salmonMp4: "/assets/hero/salmon-sequence.mp4",
    salmonWebm: "/assets/hero/salmon-sequence.webm",
    pigletsWebm: "/assets/hero/piglets_combined.webm",
  },
  divisionVideo: {
    mascotas: "/assets/division-video/mascotas.webm",
    aves: "/assets/division-video/aves-chickens.webm",
    porcina: "/assets/hero/piglets_combined.webm",
  },
  industriesSection: {
    backgroundVideo: "/assets/industries-section/background-video.webm",
    backgroundImage: "/assets/industries-section/background-image.webp",
    cardAcuicola: "/assets/industries-section/card-acuicola.webp",
    cardAvicola: "/assets/industries-section/card-avicola.webp",
    cardPorcina: "/assets/industries-section/card-porcina.webp",
    cardMascotas: "/assets/industries-section/card-mascotas.webp",
  },
  industriasPage: {
    heroLab: "/assets/industrias-page/hero-lab.png",
    molecularBg: "/assets/industrias-page/molecular-bg.png",
  },
  industryPages: {
    fallbackPorcina: "/assets/industry-pages/fallback-porcina.webp",
  },
  footer: {
    background: "/assets/footer/background.webp",
  },
  ctaBanner: {
    background: "/assets/cta-banner/background.webp",
  },
  shared: {
    workersHero: "/assets/shared/workers-hero.webp",
    pellet2: "/assets/shared/pellet2.webp",
    powder3: "/assets/shared/powder3.webp",
    macrogard: "/assets/shared/macrogardbioorigin.webp",
  },
  maquilaSection: {
    tabFormulacionHero: "/assets/maquila-section/tab-formulacion-hero.png",
    tabProductsBg: "/assets/maquila-section/tab-products-bg.webp",
    logos: {
      biorigin: "/assets/maquila-section/logos/biorigin.svg",
      agrifirm: "/assets/maquila-section/logos/agrifirm.svg",
      nucienci: "/assets/maquila-section/logos/nucienci.svg",
      bioiberica: "/assets/maquila-section/logos/bioiberica.svg",
    },
  },
  certifications: {
    sgs: "/assets/certifications/sgs.png",
    rep: "/assets/certifications/rep.png",
  },
  impactSection: {
    macrocard: "/assets/impact-section/macrocard.webp",
    pelletFramesDir: "/assets/impact-section/pellet-frames",
    pelletVector1: "/assets/impact-section/pellet-frames/vector1.svg",
    pelletVector2: "/assets/impact-section/pellet-frames/vector2.svg",
    pelletVector3: "/assets/impact-section/pellet-frames/vector3.svg",
  },
  problemSection: {
    backgroundTeal: "/assets/problem-section/background-teal.webp",
    sheepModel: "/assets/problem-section/sheep.glb",
    chickenModel: "/assets/problem-section/chicken.glb",
  },
  homeBlueBand: {
    oceanFloor: "/assets/home-blue-band/ocean-floor.webm",
  },
  nosotros: {
    fernandoGirones: "/assets/nosotros/FernandoGirones.webp",
    gonzaloMarambio: "/assets/nosotros/GonzaloMarambio.webp",
    rubenCerda: "/assets/nosotros/RubenCerda.webp",
    manuelAbalo: "/assets/nosotros/ManuelAbalo.webp",
  },
  timeline: {
    background: "/assets/timeline/Timeline_bg.webp",
    y1993A: "/assets/timeline/1993ImgA.webp",
    y1993B: "/assets/timeline/1993imgB.webp",
    y1995A: "/assets/timeline/1995ImgA.webp",
    y1995B: "/assets/timeline/1995imgB.webp",
    y1999A: "/assets/timeline/1999ImgA.webp",
    y1999B: "/assets/timeline/1999ImgB.webp",
    y2003A: "/assets/timeline/2003ImgA.webp",
    y2003B: "/assets/timeline/2003imgB.webp",
    y2005A: "/assets/timeline/2005imgA.webp",
    y2005B: "/assets/timeline/2005imgB.webp",
    y2009A: "/assets/timeline/2009imgA.webp",
    y2009B: "/assets/timeline/2009imgB.webp",
    y2015A: "/assets/timeline/2015imgA.webp",
    y2015B: "/assets/timeline/2015imgB.webp",
    y2019A: "/assets/timeline/2019imgA.webp",
    y2019B: "/assets/timeline/2019imgB.webp",
    y2024A: "/assets/timeline/2024imgA.webp",
    y2026B: "/assets/timeline/2026imgB.webp",
  },
} as const;

/** Homepage scroll-frame sequence (`impact-section` / `ScrollFramePlayer`). */
export const HOMEPAGE_PELLET_FRAMES_DIR =
  PUBLIC_ASSETS.impactSection.pelletFramesDir;

export const HOMEPAGE_PELLET_FRAMES = {
  framesDir: HOMEPAGE_PELLET_FRAMES_DIR,
  frameCount: 121,
  firstFrameNumber: 1,
} as const;
