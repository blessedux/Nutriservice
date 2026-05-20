type SitePlaceholderPageProps = {
  title: string;
  description: string;
};

export function SitePlaceholderPage({
  title,
  description,
}: SitePlaceholderPageProps) {
  return (
    <div className="bg-ns-surface min-h-[calc(100dvh-4rem)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ns-muted">
          Nutriservice
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ns-text">{title}</h1>
        <p className="mt-3 max-w-2xl text-ns-muted">{description}</p>
      </div>
    </div>
  );
}
