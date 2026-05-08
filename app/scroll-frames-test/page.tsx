import type { Metadata } from "next";
import ScrollFramePlayer from "@/components/scroll-frame-player";

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
            Frames: <span className="font-mono">/frames_pellet-explosion_webp</span>{" "}
            (<span className="font-mono">frame_0001.webp</span> →{" "}
            <span className="font-mono">frame_0121.webp</span>)
          </p>
        </div>
      </section>

      <ScrollFramePlayer
        framesDir="/frames_pellet-explosion_webp"
        frameCount={121}
        firstFrameNumber={1}
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
            vectorSrc: "/frames_pellet-explosion_webp/vector1.svg",
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
            vectorSrc: "/frames_pellet-explosion_webp/vector2.svg",
            vectorRotateDeg: 200,
            vectorOffset: { xPct: 190, yPct: -100 },

          },
          {
            start: 0.45,
            row: 2,
            col: 11,
            text: "antioxidants and prebiotics",
            vectorSrc: "/frames_pellet-explosion_webp/vector3.svg",
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
            vectorSrc: "/frames_pellet-explosion_webp/vector3.svg",
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
            start: 0.7,
            text: "Formulaciones certificadas y probadas en nuestro laboratorio",
            style: {
              fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
              fontSize: "60px",          
              mixBlendMode: "difference",
            },
          },
        ]}
      />

      {/* Parallax cover: slides up over the final sticky viewport */}
      <section className="relative z-20 -mt-[calc(100dvh-4rem)] min-h-[100dvh] bg-white/80 backdrop-blur-md px-6 py-16 border-t border-neutral-200">
        <div className="mx-auto w-full max-w-5xl text-sm text-neutral-700 pt-24">
          <p className="font-semibold text-neutral-900">Notes</p>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li>
              The sticky viewer starts below the site nav (using{" "}
              <span className="font-mono">top-16</span>).
            </li>
            <li>
              The debug slider enables manual scrubbing without scrolling.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

