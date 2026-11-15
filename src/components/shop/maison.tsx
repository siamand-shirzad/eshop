"use client";

import Image from "next/image";
import { Award, Gem, Handshake } from "lucide-react";

export function Maison() {
  return (
    <section
      id="about"
      className="border-t border-border/70 bg-secondary/20 scroll-mt-28"
      aria-label="About the maison"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70">
          <Image
            src="/watches/watch-08.png"
            alt="Obsidian Squelette Noir skeleton timepiece showing its openworked movement"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-transparent" />
        </div>

        <div>
          <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            <span className="gold-hairline w-10" />
            The Maison
          </p>
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
            Four decades of guarding{" "}
            <span className="italic text-gold-light">horological craft.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Founded in Geneva in 1987, CHRONOS began as a single vitrine of
            hand-picked independent watchmakers. Today we work directly with
            twelve maisons — from skeleton specialists to ceramic innovators —
            to bring collector-grade references to the wrists of those who
            understand that a watch is not worn, but inhabited.
          </p>

          <ul className="mt-9 space-y-5">
            {[
              {
                icon: Gem,
                title: "Authenticated provenance",
                body: "Every reference is verified by our in-house horologists and accompanied by a certificate of authenticity.",
              },
              {
                icon: Award,
                title: "Collector curation",
                body: "We buy what we would wear — no filler, no fashion-chasing. 1 in 40 watches we evaluate makes the collection.",
              },
              {
                icon: Handshake,
                title: "Lifetime concierge",
                body: "Servicing, valuations, and trade-up advice for as long as the watch is on your wrist — and beyond.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-secondary/60">
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                </span>
                <div>
                  <h3 className="font-serif text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
