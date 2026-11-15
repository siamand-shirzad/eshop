"use client";

const BRANDS = [
  "AURUM",
  "VANTAGE",
  "NOCTURNE",
  "ÉCLAT",
  "MERIDIAN",
  "NORD",
  "AVIATOR",
  "OBSIDIAN",
  "PULSE",
  "SOLIS",
];

export function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section
      id="brands"
      className="border-y border-border/70 bg-secondary/30 py-6"
      aria-label="Watch brands"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center">
          {row.map((brand, i) => (
            <span key={`${brand}-${i}`} className="flex items-center">
              <span className="px-8 font-serif text-lg tracking-[0.3em] text-muted-foreground/80 transition-colors hover:text-gold">
                {brand}
              </span>
              <span
                className="h-1.5 w-1.5 rotate-45 bg-gold/50"
                aria-hidden
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
