import type { ProductoDivisionSlug } from "@/lib/productos-divisions";
import { getDivisionContact } from "@/lib/division-contacts";
import { cn } from "@/lib/utils";

type DivisionContactBlockProps = {
  division: ProductoDivisionSlug;
  className?: string;
};

export function DivisionContactBlock({
  division,
  className,
}: DivisionContactBlockProps) {
  const contact = getDivisionContact(division);

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-md sm:px-8 sm:py-6",
        className,
      )}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
        Contacto directo
      </h3>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-white/90">{contact.name}</p>
        </div>
        <div>
          <a
            href={`mailto:${contact.email}`}
            className="text-sm text-white/70 transition-colors hover:text-cyan-300"
          >
            {contact.email}
          </a>
        </div>
        {contact.phone && (
          <div>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="text-sm text-white/70 transition-colors hover:text-cyan-300"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
