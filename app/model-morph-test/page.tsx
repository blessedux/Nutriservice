import type { Metadata } from "next";
import GlbMorphHoverViewer from "@/components/glb-morph-hover-viewer";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Model morph (test)",
  description:
    "Prueba de morph por hover entre sheep.glb y low_poly_chicken.glb (vértices).",
  robots: { index: false, follow: false },
};

export default function ModelMorphTestPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <section className="border-b border-neutral-200 px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
            Experimental
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Morph GLB — hover
          </h1>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            Vista de prueba: misma técnica que el demo de Three.js model morph
            (interpolación de posiciones con padding al mayor mesh). Pasá el
            mouse sobre &quot;Oveja&quot; o &quot;Pollo&quot; debajo del lienzo.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <GlbMorphHoverViewer
          srcs={[
            PUBLIC_ASSETS.problemSection.sheepModel,
            PUBLIC_ASSETS.problemSection.chickenModel,
          ]}
        />
      </section>
    </div>
  );
}
