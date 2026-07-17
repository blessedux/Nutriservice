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
    salmonPoster: "/assets/hero/posters/salmon-poster.webp",
    pigletsPoster: "/assets/hero/posters/piglets-poster.webp",
  },
  divisionVideo: {
    mascotas: "/assets/division-video/mascotas3_hero.webm",
    aves: "/assets/division-video/hen_final_compressed.webm",
    porcina: "/assets/hero/piglets_combined.webm",
    mascotasPoster: "/assets/division-video/posters/mascotas-poster.webp",
    avesPoster: "/assets/division-video/posters/aves-poster.webp",
    porcinaPoster: "/assets/hero/posters/piglets-poster.webp",
  },
  industriesSection: {
    backgroundVideo: "/assets/industries-section/background-video.webm",
    backgroundImage: "/assets/industries-section/background-image.webp",
    cardAcuicola: "/assets/industries-section/card-acuicola-v2.webp",
    cardAvicola: "/assets/industries-section/card-avicola-v2.webp",
    cardPorcina: "/assets/industries-section/card-porcina-v2.webp",
    cardMascotas: "/assets/industries-section/card-mascotas-v2.webp",
  },
  industriasPage: {
    heroLab: "/assets/industrias-page/hero-lab.png",
    molecularBg: "/assets/industrias-page/molecular-bg.png",
  },
  industryPages: {
    fallbackPorcina: "/assets/industry-pages/fallback-porcina.webp",
  },
  footer: {
    background: "/assets/footer/footer_bg_2.webp",
  },
  ctaBanner: {
    background: "/assets/cta-banner/background.webp",
    brochures: {
      acuicola: "/assets/cta-banner/nutriservice-productos-acuicola.pdf",
      aves: "/assets/cta-banner/nutriservice-productos-aves.pdf",
      cerdos: "/assets/cta-banner/nutriservice-productos-cerdos.pdf",
      mascotas: "/assets/cta-banner/nutriservice-productos-mascotas.pdf",
    },
  },
  shared: {
    workersHero: "/assets/shared/workers_hero2.webp",
    workersBag: "/assets/shared/workers_bag.webp",
    nutribagWorkers: "/assets/shared/nutribag_workers.webp",
    /** default product stock (replaces legacy white dust bag) */
    whiteDustBag: "/assets/shared/nutrisermix.webp",
    nutrisermix: "/assets/shared/nutrisermix.webp",
    silimarinaBarril: "/assets/shared/silimarina_barril.webp",
    macrogard: "/assets/shared/macrogard_bag.webp",
    bioOriginPowder: "/assets/shared/bio_origin_powder.webp",
    bioibericaPowder: "/assets/shared/bioiberica_poweder.webp",
    plusbreathe: "/assets/shared/plusbreathe+.webp",
    activemos: "/assets/shared/activemos.webp",
    aromabiotic: "/assets/shared/aromabiotic.webp",
    cVita: "/assets/shared/c-vita.webp",
    eubisol: "/assets/shared/eubisol.webp",
    halorTid: "/assets/shared/halor tid.webp",
    mProve: "/assets/shared/m-prove.webp",
    nucleoforceShared: "/assets/shared/nucleoforce.webp",
    palaupCh: "/assets/shared/palaup_ch.webp",
    sProve: "/assets/shared/s-prove.webp",
    tecmaxPro: "/assets/shared/texmaxpro_tectron.webp",
    vitanox: "/assets/shared/vitanox.webp",
    ambitine: "/assets/shared/ambitine.webp",
    citroflakeB: "/assets/shared/citroflake_b.webp",
    feedlock: "/assets/shared/feedlock.webp",
    microacid: "/assets/shared/microacid.webp",
    milkey: "/assets/shared/milkey2.webp",
    turbozyme: "/assets/shared/turbozyme.webp",
    vitaprotein: "/assets/shared/vitaprotein.webp",
    meatfree: "/assets/shared/meatfree_bag.webp",
  },
  productos: {
    silimarina: "/assets/productos/silimarina.webp",
    nucleoforceSalmonids: "/assets/productos/nucleoforce.webp",
  },
  maquilaSection: {
    tabFormulacionHero: "/assets/maquila-section/tab-formulacion-hero.png",
    tabProductsBg: "/assets/maquila-section/tab-products-bg.webp",
    logos: {
      biorigin: "/assets/maquila-section/logos/biorigin.svg",
      agrifirm: "/assets/maquila-section/logos/agrifirm.svg",
      nucienci: "/assets/maquila-section/logos/nucienci.svg",
      bioiberica: "/assets/maquila-section/logos/bioiberica-white.png",
      tinveun: "/assets/shared/Tinveun_logo_white.svg",
      tectron: "/assets/maquila-section/logos/tectron_logo.svg",
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
    oceanFloorPoster: "/assets/home-blue-band/posters/ocean-floor-poster.webp",
  },
  nosotros: {
    fernandoPfp: "/assets/nosotros/fernando_pfp.webp",
    fernandoGirones: "/assets/nosotros/FernandoGirones.webp",
    gonzaloMarambio: "/assets/nosotros/GonzaloMarambio.webp",
    sebastianMeneses: "/assets/nosotros/SebastianMeneses.webp",
    rubenCerda: "/assets/nosotros/RubenCerda.webp",
    manuelAbalo: "/assets/nosotros/ManuelAbalo.webp",
    rodrigoMartinez: "/assets/nosotros/RodrigoMartinez.webp",
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
