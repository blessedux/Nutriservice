import SmartFeedCalculator from "@/components/smart-feed-calculator";

export default function CalculatorSection() {
  return (
    <section
      id="calculadora"
      className="scroll-mt-24 bg-[#030A1C] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SmartFeedCalculator />
      </div>
    </section>
  );
}
