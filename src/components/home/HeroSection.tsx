export function HeroSection({ subtitle }: { subtitle: string }) {
  return (
    <section className="relative bg-white py-10 sm:py-14 text-center overflow-hidden">
      {/* Soft blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4">
        {/* Logo mark */}
        <div className="inline-flex items-center gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "64px", width: "auto", display: "block" }} />
          <span className="font-display text-4xl sm:text-5xl tracking-wide text-foreground">
            nextstar<span className="text-primary">BD</span>
          </span>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-lg mx-auto">
          {subtitle}
        </p>

        {/* Flag stripe */}
        <div className="flex justify-center gap-1.5 mt-5">
          <span className="w-8 h-1.5 rounded-full bg-secondary" />
          <span className="w-8 h-1.5 rounded-full bg-white border border-border" />
          <span className="w-8 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
