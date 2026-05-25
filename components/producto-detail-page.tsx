"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ContactForm from "@/components/contact-form";
import DivisionVideoBg from "@/components/division-video-bg";
import { ProductoImage } from "@/components/producto-image";
import { HOME_INDUSTRIES_BG } from "@/components/home-blue-band";
import { PRODUCTOS_CATEGORIAS } from "@/lib/productos-categories";
import {
  getDivisionLabel,
  PRODUCTOS_DIVISIONES,
  type ProductoDivisionSlug,
} from "@/lib/productos-divisions";
import {
  getDivisionMedia,
  type DivisionMedia,
} from "@/lib/productos-division-media";
import {
  getProductoImagePath,
  getProductoSummary,
  productoDetailHref,
  productosFilterHref,
  type Producto,
} from "@/lib/productos-inventory";
import { cn } from "@/lib/utils";

const GLASS_CARD_DARK = cn(
  "rounded-[2rem] border border-white/20 bg-white/[0.08] p-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:rounded-[2.5rem] sm:p-8 lg:p-10",
);

const GLASS_CARD_LIGHT = cn(
  "rounded-[2rem] border border-ns-border bg-white/95 p-6 shadow-sm sm:rounded-[2.5rem] sm:p-8 lg:p-10",
);

const DIVISION_RUBRO: Record<ProductoDivisionSlug, string> = {
  acuicola: "Acuícola",
  aves: "Avícola",
  cerdos: "Porcina",
  mascotas: "Alimento para mascotas",
};

function buildProductInquiryMessage(
  producto: Producto,
  division: ProductoDivisionSlug,
): string {
  const divisionLabel = getDivisionLabel(division);
  return `Hola, me interesa recibir información técnica sobre ${producto.name} (${producto.altName}) para la división ${divisionLabel}. Quisiera conocer disponibilidad, uso recomendado e implementación en mi operación.`;
}

type ProductoDetailPageProps = {
  producto: Producto;
  division: ProductoDivisionSlug;
  categoriaLabels: string[];
};

function DivisionBackdrop({
  media,
}: {
  media: DivisionMedia;
}) {
  if (media.video) {
    return (
      <DivisionVideoBg mp4={media.video.mp4} webm={media.video.webm} />
    );
  }

  if (media.fallbackImage) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Image
          src={media.fallbackImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[#A8C8D6]/78" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: HOME_INDUSTRIES_BG }}
      aria-hidden
    />
  );
}

export default function ProductoDetailPageView({
  producto,
  division,
  categoriaLabels,
}: ProductoDetailPageProps) {
  const media = getDivisionMedia(division);
  const onDark = media.tone === "on-dark";
  const summary = getProductoSummary(producto, division);
  const imagePath = getProductoImagePath(producto);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const inquiryMessage = buildProductInquiryMessage(producto, division);
  const inquiryRubro = DIVISION_RUBRO[division];

  useEffect(() => {
    if (!showInquiryForm || !inquiryRef.current) return;
    inquiryRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [showInquiryForm]);

  return (
    <div
      className={cn(
        "relative min-h-screen",
        onDark ? "text-white" : "text-ns-text",
      )}
    >
      <DivisionBackdrop media={media} />

      <div className="relative z-10 -mt-24 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={productosFilterHref({ division })}
            className={cn(
              "text-xs font-semibold uppercase tracking-wider hover:underline",
              onDark ? "text-cyan-300" : "text-ns-green",
            )}
          >
            ← Productos
          </Link>

          {producto.divisionSlugs.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {producto.divisionSlugs.map((slug) => {
                const active = slug === division;
                return (
                  <Link
                    key={slug}
                    href={productoDetailHref(producto.slug, slug)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
                      active
                        ? onDark
                          ? "border-cyan-400/60 bg-cyan-400/15 text-white"
                          : "border-ns-green bg-ns-green/10 text-ns-green"
                        : onDark
                          ? "border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:text-white"
                          : "border-ns-border bg-white text-ns-muted hover:border-ns-green",
                    )}
                  >
                    {getDivisionLabel(slug)}
                  </Link>
                );
              })}
            </div>
          )}

          <article className={cn("mt-8", onDark ? GLASS_CARD_DARK : GLASS_CARD_LIGHT)}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start">
              <div
                className={cn(
                  "overflow-hidden rounded-[1.5rem] border",
                  onDark
                    ? "border-white/15 bg-white/[0.04]"
                    : "border-ns-border bg-ns-surface-alt",
                )}
              >
                <ProductoImage
                  src={imagePath}
                  alt={`${producto.name} — ${producto.altName}`}
                  productName={producto.name}
                  tone={media.tone}
                />
              </div>

              <div>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-widest",
                    onDark ? "text-cyan-400" : "text-ns-emerald",
                  )}
                >
                  {getDivisionLabel(division)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {producto.filterSlugs.map((slug) => {
                    const label = PRODUCTOS_CATEGORIAS.find(
                      (c) => c.slug === slug,
                    )?.label;
                    if (!label) return null;
                    return (
                      <Link
                        key={slug}
                        href={productosFilterHref({
                          division,
                          categoria: slug,
                        })}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          onDark
                            ? "border-white/20 bg-white/5 text-white/75 hover:border-white/35"
                            : "border-ns-border bg-ns-surface text-ns-muted hover:border-ns-green",
                        )}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>

                <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                  {producto.name}
                  <span
                    className={cn(
                      "mt-1 block text-lg font-semibold",
                      onDark ? "text-white/55" : "text-ns-muted",
                    )}
                  >
                    {producto.altName}
                  </span>
                </h1>

                <p
                  className={cn(
                    "mt-5 text-lg leading-relaxed",
                    onDark ? "text-white/82" : "text-ns-text",
                  )}
                >
                  {summary}
                </p>

                <p
                  className={cn(
                    "mt-6 text-base leading-relaxed",
                    onDark ? "text-white/68" : "text-ns-muted",
                  )}
                >
                  {producto.description}
                </p>

                {categoriaLabels.length > 0 && (
                  <p
                    className={cn(
                      "mt-6 text-sm",
                      onDark ? "text-white/50" : "text-ns-muted",
                    )}
                  >
                    Categorías: {categoriaLabels.join(" · ")}
                  </p>
                )}

                {producto.divisionSlugs.length > 1 && (
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      onDark ? "text-white/50" : "text-ns-muted",
                    )}
                  >
                    También disponible en:{" "}
                    {producto.divisionSlugs
                      .filter((slug) => slug !== division)
                      .map((slug) => getDivisionLabel(slug))
                      .join(" · ")}
                  </p>
                )}

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href={productosFilterHref({ division })}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                      onDark
                        ? "border-white/30 bg-white/5 text-white hover:border-white/45 hover:bg-white/10"
                        : "border-ns-border bg-white text-ns-text hover:border-ns-green",
                    )}
                  >
                    Ver catálogo
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm((open) => !open)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                      onDark
                        ? "bg-cyan-500 text-[#0a192f] hover:bg-cyan-400"
                        : "bg-ns-green text-white hover:bg-ns-green-dark",
                    )}
                    aria-expanded={showInquiryForm}
                    aria-controls="producto-inquiry-form"
                  >
                    {showInquiryForm
                      ? "Ocultar formulario"
                      : "Solicitar información"}
                  </button>
                </div>

                {showInquiryForm && (
                  <div
                    id="producto-inquiry-form"
                    ref={inquiryRef}
                    className={cn(
                      "mt-8 w-full rounded-[1.5rem] border p-6 sm:p-8",
                      onDark
                        ? "border-white/15 bg-white/[0.06]"
                        : "border-ns-border bg-ns-surface",
                    )}
                  >
                    <h2
                      className={cn(
                        "text-xl font-bold",
                        onDark ? "text-white" : "text-ns-text",
                      )}
                    >
                      Solicitar información sobre {producto.name}
                    </h2>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed",
                        onDark ? "text-white/65" : "text-ns-muted",
                      )}
                    >
                      Complete sus datos. El mensaje ya incluye el producto y
                      la división seleccionada.
                    </p>
                    <div className="mt-6">
                      <ContactForm
                        variant={onDark ? "on-dark" : "default"}
                        defaultMessage={inquiryMessage}
                        defaultRubro={inquiryRubro}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          <p
            className={cn(
              "mt-4 text-center text-[10px] uppercase tracking-[0.18em]",
              onDark ? "text-white/30" : "text-ns-subtle",
            )}
          >
            {PRODUCTOS_DIVISIONES.find((d) => d.slug === division)?.label} ·{" "}
            {producto.altName}
          </p>
        </div>
      </div>
    </div>
  );
}
