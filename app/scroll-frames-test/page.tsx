import type { Metadata } from "next";
import ScrollFramePlayer from "@/components/scroll-frame-player";
import MacroGardCover from "@/components/macrogard-cover";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Scroll Frames Test",
  robots: { index: false, follow: false },
};

export default function ScrollFramesTestPage() {
  return (
    <div className="bg-white text-neutral-900">
      <section className="px-6 pt-10 pb-8 border-b border-neutral-200">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
            Experimental
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">
            Scroll → frame-by-frame (0–120)
          </h1>
          <p className="mt-3 text-sm text-neutral-600 max-w-2xl leading-relaxed">
            This page maps scroll progress over a fixed vertical track to a
            frame index. Use the debug HUD (top-right) to verify the current
            step, progress, and source.
          </p>
          <p className="mt-3 text-xs text-neutral-500">
            Frames:{" "}
            <span className="font-mono">
              {PUBLIC_ASSETS.impactSection.pelletFramesDir}
            </span>{" "}
            (<span className="font-mono">frame_0001.webp</span> →{" "}
            <span className="font-mono">frame_0121.webp</span>)
          </p>
        </div>
      </section>

      <ScrollFramePlayer
        framesDir={PUBLIC_ASSETS.impactSection.pelletFramesDir}
        frameCount={121}
        firstFrameNumber={1}
        frameStride={1}
        blendAdjacentFrames={false}
        trackVh={5}
        debugGrid
        debugGridCols={12}
        debugGridRows={8}
        annotations={[
          {
            start: 0.16,
            row: 3,
            col: 2,
            text: "7 aminoacidos esenciales",
            vectorSrc: PUBLIC_ASSETS.impactSection.pelletVector1,
            vectorOffset: { xPct: 200 },
            vectorAnchor: "center",
            vectorTransform: "fixed",          
            vectorScale: 2,
            vectorRotateDeg: 10,
          },
          {
            start: 0.3,
            row: 5,
            col: 3,
            text: "omega-3 and essentiala fatty acids",
            vectorSrc: PUBLIC_ASSETS.impactSection.pelletVector2,
            vectorRotateDeg: 200,
            vectorOffset: { xPct: 190, yPct: -100 },

          },
          {
            start: 0.45,
            row: 2,
            col: 11,
            text: "antioxidants and prebiotics",
            vectorSrc: PUBLIC_ASSETS.impactSection.pelletVector3,
            vectorOffset: { xPct: -200, yPct: -100 },
            vectorAnchor: "center",
            vectorTransform: "fixed",
            vectorScale: 2,
            vectorRotateDeg: -20,
          },
          {
            start: 0.6,
            row: 6,
            col: 10,
            text: "Multivtaimins supplied in chelated form to improve bioavailability.",
            vectorSrc: PUBLIC_ASSETS.impactSection.pelletVector3,
            vectorOffset: { xPct: -120, yPct: 100 },
            vectorAnchor: "center",
            vectorTransform: "fixed",
            vectorScale: 1.2,
            vectorRotateDeg: 10,
          },
        ]}
        titles={[
          {
            start: 0.1,
            end: 0.25,
            text: "Mucho mas que un pellet.",
            placement: "top-left",
            style: {
              fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
              fontSize: "60px",
              marginLeft: "60px",
              mixBlendMode: "difference",
            },
          },
          {
            start: 0.35,
            end: 0.5,
            text: "Todos los nutrientes necesarios para lechones sanos y una producccion optima.",
            placement: "bottom-right",
            style: {
              fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
              fontSize: "60px",
              marginRight: "60px",
              marginBottom: "48px",
              mixBlendMode: "difference",
            },
          },
          {
            start: 0.6,
            text: "Formulaciones certificadas y probadas en nuestro laboratorio.",
            style: {
              fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
              fontSize: "60px",          
              marginBottom: "48px",
              mixBlendMode: "difference",
            },
          },
        ]}
        cover={
          <MacroGardCover />
        }
      />
    </div>
  );
}

