"use client";

import { useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";

import {
  TEAM_SHOWCASE_MEMBERS,
  type TeamMember,
} from "@/lib/team-showcase-data";
import { cn } from "@/lib/utils";

interface TeamShowcaseProps {
  members?: TeamMember[];
  className?: string;
  tone?: "on-light" | "on-dark";
}

export default function TeamShowcase({
  members = TEAM_SHOWCASE_MEMBERS,
  className,
  tone = "on-light",
}: TeamShowcaseProps) {
  const onDark = tone === "on-dark";
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl select-none flex-col items-start gap-8 px-4 py-4 font-sans md:flex-row md:gap-10 md:px-6 lg:gap-14",
        className,
      )}
    >
      <div className="flex flex-shrink-0 gap-2 overflow-x-auto pb-1 md:gap-3 md:pb-0">
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="h-[120px] w-[110px] sm:h-[140px] sm:w-[130px] md:h-[165px] md:w-[155px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onDark={onDark}
            />
          ))}
        </div>

        <div className="mt-[48px] flex flex-col gap-2 sm:mt-[56px] md:mt-[68px] md:gap-3">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="h-[132px] w-[122px] sm:h-[155px] sm:w-[145px] md:h-[182px] md:w-[172px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onDark={onDark}
            />
          ))}
        </div>

        <div className="mt-[22px] flex flex-col gap-2 sm:mt-[26px] md:mt-[32px] md:gap-3">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="h-[125px] w-[115px] sm:h-[146px] sm:w-[136px] md:h-[172px] md:w-[162px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onDark={onDark}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4 pt-0 sm:grid sm:grid-cols-2 md:flex md:flex-col md:gap-5 md:pt-2">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onDark={onDark}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
  onDark = false,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onDark?: boolean;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const isPlaceholder = member.placeholder === true;
  const linkedinUrl = member.social?.linkedin;

  const cardInner = isPlaceholder ? (
    <div
      className={cn(
        "h-full w-full border border-dashed",
        onDark
          ? "border-white/15 bg-white/[0.04]"
          : "border-ns-border/80 bg-ns-surface-alt/60",
      )}
      aria-hidden
    />
  ) : (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={member.image}
      alt={member.name}
      className="h-full w-full object-cover transition-[filter] duration-500"
      style={{
        filter: isActive
          ? "grayscale(0) brightness(1)"
          : "grayscale(1) brightness(0.77)",
      }}
    />
  );

  return (
    <div
      className={cn(
        "duration-400 flex-shrink-0 overflow-hidden rounded-xl transition-opacity",
        !isPlaceholder && linkedinUrl && "cursor-pointer",
        className,
        isDimmed ? "opacity-60" : "opacity-100",
      )}
      onMouseEnter={() => !isPlaceholder && onHover(member.id)}
      onMouseLeave={() => !isPlaceholder && onHover(null)}
    >
      {linkedinUrl && !isPlaceholder ? (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${member.name}`}
          className="block h-full w-full"
        >
          {cardInner}
        </a>
      ) : (
        cardInner
      )}
    </div>
  );
}

function MemberRow({
  member,
  hoveredId,
  onHover,
  onDark = false,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onDark?: boolean;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const isPlaceholder = member.placeholder === true;
  const linkedinUrl = member.social?.linkedin;

  const rowContent = (
    <>
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "h-3 w-4 flex-shrink-0 rounded-[5px] transition-all duration-300",
            isPlaceholder
              ? onDark
                ? "bg-white/10"
                : "bg-ns-text/10"
              : isActive
                ? "w-5 bg-ns-emerald"
                : onDark
                  ? "bg-white/25"
                  : "bg-ns-text/25",
          )}
        />
        <span
          className={cn(
            "text-base font-semibold leading-none tracking-tight transition-colors duration-300 md:text-[18px]",
            isPlaceholder
              ? onDark
                ? "text-white/35"
                : "text-ns-muted/70"
              : onDark
                ? isActive
                  ? "text-white"
                  : "text-white/80"
                : isActive
                  ? "text-ns-text"
                  : "text-ns-text/80",
          )}
        >
          {member.name}
        </span>

        {linkedinUrl ? (
          <FaLinkedinIn
            size={11}
            className={cn(
              "flex-shrink-0 transition-colors duration-300",
              onDark
                ? isActive
                  ? "text-white/70"
                  : "text-white/45"
                : isActive
                  ? "text-ns-muted"
                  : "text-ns-muted/70",
            )}
            aria-hidden
          />
        ) : null}
      </div>

      <p
        className={cn(
          "mt-1.5 pl-[27px] text-[7px] font-medium uppercase tracking-[0.2em] md:text-[10px]",
          isPlaceholder
            ? onDark
              ? "text-white/25"
              : "text-ns-muted/50"
            : onDark
              ? "text-white/50"
              : "text-ns-muted",
        )}
      >
        {member.role}
      </p>
    </>
  );

  const rowClassName = cn(
    "block transition-opacity duration-300",
    !isPlaceholder && linkedinUrl && "cursor-pointer",
    isDimmed ? "opacity-50" : "opacity-100",
    isPlaceholder && "opacity-70",
  );

  if (linkedinUrl && !isPlaceholder) {
    return (
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver perfil de LinkedIn de ${member.name}`}
        className={cn(
          rowClassName,
          onDark
            ? "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-emerald/50"
            : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-green/50",
        )}
        onMouseEnter={() => onHover(member.id)}
        onMouseLeave={() => onHover(null)}
      >
        {rowContent}
      </a>
    );
  }

  return (
    <div
      className={rowClassName}
      onMouseEnter={() => !isPlaceholder && onHover(member.id)}
      onMouseLeave={() => !isPlaceholder && onHover(null)}
    >
      {rowContent}
    </div>
  );
}
