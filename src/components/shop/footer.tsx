"use client";

import { useState } from "react";
import { Watch, ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS: { title: string; links: string[] }[] = [
  {
    title: "Collection",
    links: ["Dress Watches", "Dive Watches", "Pilot Watches", "Skeleton", "Smart"],
  },
  {
    title: "Services",
    links: ["Servicing & Repair", "Valuations", "Trade-In Program", "Gift Cards"],
  },
  {
    title: "Maison",
    links: ["Our Story", "Journal", " Boutiques", "Contact"],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-auto border-t border-border/70 bg-[#08080a]">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <h3 className="font-serif text-2xl sm:text-3xl">
              First access to new references
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vault allocations are announced to our list 48 hours before the
              public. No noise — one dispatch per month.
            </p>
          </div>
          {subscribed ? (
            <p className="flex items-center gap-2 rounded-lg border border-gold/30 bg-secondary/40 px-5 py-3.5 text-sm text-gold">
              <Check className="h-4 w-4" />
              Welcome to the list. Watch this space.
            </p>
          ) : (
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubscribed(true);
              }}
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="h-11 border-input bg-secondary/50"
              />
              <Button
                type="submit"
                className="h-11 gap-2 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="gold-hairline" />

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-secondary">
              <Watch className="h-5 w-5 text-gold" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.22em]">
                CHRONOS
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
                Fine Watches · Est. 1987
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A boutique house of fine timepieces. Rue du Rhône 12, 1204 Genève,
            Switzerland.
          </p>
        </div>

        {FOOTER_LINKS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#collection"
                    className="text-sm text-foreground/75 transition-colors hover:text-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <Separator className="bg-border/50" />

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} CHRONOS SA. All rights reserved.</p>
        <p className="flex items-center gap-4">
          <span>Privacy</span>
          <span aria-hidden>·</span>
          <span>Terms</span>
          <span aria-hidden>·</span>
          <span className="text-gold/70">Crafted with precision</span>
        </p>
      </div>
    </footer>
  );
}
