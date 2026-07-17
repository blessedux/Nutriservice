The MacBook and iPhone in this project are built with plain CSS
(see src/Nutriservice/MacBookMockup.tsx and IPhoneMockup.tsx) so the
whole thing renders with zero external dependencies out of the box.

For a truly photoreal result (per the brief: "realistic mockups of a
MacBook... studio photography type of way"), do ONE of these in
Claude Code, where you'll have network access:

Option A — Composited PSD/PNG mockup
  Source a free/licensed high-res MacBook + iPhone mockup (transparent
  screen area), e.g. from sites like mockuuups.studio, Facebook Design
  Devices, or similar. Composite the real site screen recording into
  the screen area (mask/clip to the screen's perspective) and export
  as a PNG sequence or use it as a static frame per scene.

Option B — 3D model via @remotion/three
  npm install three @remotion/three @react-three/fiber
  Use a free MacBook/iPhone glTF model, apply the site screen recording
  as a texture on the screen mesh, and drive the same spring/drift
  logic already written in Scene3Devices.tsx (rotateY, translateX,
  scale) as real 3D transforms instead of CSS ones — this is what gets
  you real specular highlights and studio-style lighting.

Either way, keep the existing spring() + sine-drift motion logic in
Scene3Devices.tsx — that's the "fast in, floaty hold" behavior from the
brief, and it's asset-agnostic (works the same whether the device is
CSS, a composited PNG, or a 3D model).
