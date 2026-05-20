import MacroGardCover from "@/components/macrogard-cover";
import ScrollFramePlayer from "@/components/scroll-frame-player";
import { HOMEPAGE_PELLET_FRAMES } from "@/lib/scroll-frame-preload";

type ImpactSectionProps = {
  /** MacroGard slide-up panel after the sequence (homepage-style). */
  withCover?: boolean;
};

/** Pellet explosion scroll sequence — homepage Impact band. */
export default function ImpactSection({ withCover = true }: ImpactSectionProps) {
  return (
    <section id="impact" className="scroll-mt-24 bg-white">
      <ScrollFramePlayer
        {...HOMEPAGE_PELLET_FRAMES}
        trackVh={5}
        debugGrid={false}
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
            start: 0.6,
            text: "Formulaciones certificadas y probadas en nuestro laboratorio.",
            style: {
              fontFamily: '"Test Söhne Schmal", ui-sans-serif, system-ui',
              fontSize: "60px",
              mixBlendMode: "difference",
              marginBottom: "48px",
            },
          },
        ]}
        cover={withCover ? <MacroGardCover /> : undefined}
      />
    </section>
  );
}
