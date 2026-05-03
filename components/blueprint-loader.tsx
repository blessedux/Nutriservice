"use client";

import { cn } from "@/lib/utils";

interface BlueprintLoaderProps {
  className?: string;
  barCount?: number;
}

export function BlueprintLoader({
  className,
  barCount = 12,
}: BlueprintLoaderProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div
      className={cn(
        "relative h-12 [transform-style:preserve-3d]",
        className
      )}
      style={{ width: `${barCount * 12 + 10}px` }}
    >
      {bars.map((index) => {
        const delay = -((index + 1) * 0.4);
        const leftPos = index * 12;

        // Dot size calculation (matching original CSS logic)
        const dotSize =
          index < 10 ? 5 + (index + 1) : 15 - (index - 9);

        return (
          <div
            key={index}
            className="absolute top-0 h-full w-0.5 bg-foreground [transform-style:preserve-3d] animate-[grow_8s_linear_infinite]"
            style={{
              left: `${leftPos}px`,
              animationDelay: `${delay}s`,
            }}
          >
            {/* Top dot */}
            <div
              className="absolute left-1/2 rounded-full bg-foreground [transform-style:preserve-3d] animate-[shrink_8s_linear_infinite]"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                top: `-${dotSize / 2 + 6}px`,
                transform: "translateX(-50%) rotateX(0)",
                animationDelay: `${delay}s`,
              }}
            />
            {/* Bottom dot */}
            <div
              className="absolute left-1/2 rounded-full bg-foreground [transform-style:preserve-3d] animate-[shrink_8s_linear_infinite]"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                bottom: `-${dotSize / 2 + 6}px`,
                transform: "translateX(-50%) rotateX(0)",
                animationDelay: `${delay}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
