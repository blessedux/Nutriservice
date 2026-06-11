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

  const photoCardClassName =
    "aspect-[10/11] w-full max-w-[172px] justify-self-center sm:max-w-[180px] md:max-w-[190px]";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl select-none flex-col items-start gap-8 px-4 py-4 font-sans md:flex-row md:gap-10 md:px-6 lg:gap-14",
        className,
      )}
    >
      <div className="grid w-full max-w-[380px] shrink-0 grid-cols-2 gap-2 sm:max-w-[400px] sm:gap-3 md:max-w-[420px]">
        {members.map((member) => (
          <PhotoCard
            key={member.id}
            member={member}
            className={photoCardClassName}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onDark={onDark}
          />
        ))}
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
  const showPhotoPlaceholder = isPlaceholder || member.noPhoto === true || !member.image;
  const linkedinUrl = member.social?.linkedin;

  const cardInner = showPhotoPlaceholder ? (
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
        !showPhotoPlaceholder && linkedinUrl && "cursor-pointer",
        className,
        isDimmed ? "opacity-60" : "opacity-100",
      )}
      onMouseEnter={() => !showPhotoPlaceholder && onHover(member.id)}
      onMouseLeave={() => !showPhotoPlaceholder && onHover(null)}
    >
      {linkedinUrl && !showPhotoPlaceholder ? (
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
  const isNamedWithoutPhoto = member.noPhoto === true;
  const showAsPlaceholderRow = isPlaceholder && !isNamedWithoutPhoto;
  const linkedinUrl = member.social?.linkedin;

  const rowContent = (
    <>
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "h-3 w-4 flex-shrink-0 rounded-[5px] transition-all duration-300",
            showAsPlaceholderRow
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
            showAsPlaceholderRow
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
          showAsPlaceholderRow
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
    linkedinUrl && !showAsPlaceholderRow && "cursor-pointer",
    isDimmed ? "opacity-50" : "opacity-100",
    showAsPlaceholderRow && "opacity-70",
  );

  if (linkedinUrl && !showAsPlaceholderRow) {
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
      onMouseEnter={() => member.image && onHover(member.id)}
      onMouseLeave={() => member.image && onHover(null)}
    >
      {rowContent}
    </div>
  );
}
