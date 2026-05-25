import MacroGardCover from "@/components/macrogard-cover";
import ScrollFramePlayer from "@/components/scroll-frame-player";
import { HOMEPAGE_PELLET_FRAMES } from "@/lib/scroll-frame-preload";

type ImpactSectionProps = {
  /** MacroGard slide-up panel after the sequence (homepage-style). */
  withCover?: boolean;
  sectionId?: string;
};

/** Pellet explosion scroll sequence — product impact band. */
export default function ImpactSection({
  withCover = true,
  sectionId = "impacto",
}: ImpactSectionProps) {
  return (
    <section id={sectionId} className="scroll-mt-24 bg-white">
      <ScrollFramePlayer
        {...HOMEPAGE_PELLET_FRAMES}
        trackVh={5}
        debugGrid={false}
        cover={withCover ? <MacroGardCover /> : undefined}
      />
    </section>
  );
}
