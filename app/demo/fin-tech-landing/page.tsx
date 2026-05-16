import FinTechLandingPage from "@/components/ui/fin-tech-landing-page";

export default function FinTechLandingDemoPage() {
  /** `showChrome` omits site `Nav` duplicate — root layout already provides navigation. */
  return <FinTechLandingPage showChrome={false} heroRevealReady />;
}
