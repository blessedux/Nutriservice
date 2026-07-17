Drop these here before rendering:

1. `home.png` — a clean 16:10-ish crop of the nutriservice.cl homepage
   (or better: export a still frame / short loop from the real
   ocean-floor hero video) to fill the MacBook screen.
2. `home-mobile.png` — the same homepage at a phone aspect ratio
   (9:19.5-ish crop) for the iPhone screen.

If you want the actual hero video playing inside the MacBook screen
instead of a static image (recommended — the brief calls this site
"very video-centric"), swap the <Img> in MacBookMockup.tsx for
Remotion's <OffthreadVideo src={staticFile('screenshots/hero-loop.webm')} />
and drop the real ocean-floor.webm asset here instead.

Until these exist, the MacBook/iPhone screens will show broken images —
everything else (mark, text, chips) renders fine without them.
