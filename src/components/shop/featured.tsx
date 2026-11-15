"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "./product-card";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface FeaturedProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onViewAll: () => void;
}

export function Featured({ products, onSelect, onViewAll }: FeaturedProps) {
  if (products.length === 0) return null;
  const [hero, ...rest] = products;
  const side = rest.slice(0, 2);

  return (
    <section
      id="featured"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24"
      aria-label="Featured watches"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            <span className="gold-hairline w-10" />
            Highly sought after
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl">The Vault</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Rare references and limited allocations, hand-picked by our
            curatorial team each season.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={onViewAll}
          className="gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground hover:text-gold"
        >
          View full collection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Hero feature */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-xl border border-border/70 bg-card"
        >
          <button
            onClick={() => onSelect(hero)}
            className="relative block aspect-[4/3] w-full cursor-pointer lg:aspect-auto lg:h-full lg:min-h-[480px]"
            aria-label={`View ${hero.brand} ${hero.name}`}
          >
            <Image
              src={hero.image}
              alt={`${hero.brand} ${hero.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
            <div>
              <Badge className="mb-3 border-0 bg-primary font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
                Vault Piece
              </Badge>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
                {hero.brand}
              </p>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl">
                {hero.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={hero.rating} />
                <span className="text-xs text-muted-foreground">
                  {hero.rating} · {hero.reviewCount} reviews
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl text-gold-light">
                {formatPrice(hero.price)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {hero.movement} · {hero.caseMaterial}
              </p>
            </div>
          </div>
        </motion.article>

        {/* Side features */}
        <div className="grid gap-5">
          {side.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease: "easeOut" }}
              className="group relative flex overflow-hidden rounded-xl border border-border/70 bg-card"
            >
              <button
                onClick={() => onSelect(p)}
                className="relative aspect-square w-2/5 shrink-0 cursor-pointer"
                aria-label={`View ${p.brand} ${p.name}`}
              >
                <Image
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  fill
                  sizes="(max-width: 1024px) 40vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </button>
              <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
                  {p.brand}
                </p>
                <button
                  onClick={() => onSelect(p)}
                  className="cursor-pointer text-left font-serif text-xl transition-colors hover:text-gold-light sm:text-2xl"
                >
                  {p.name}
                </button>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-serif text-lg text-gold-light">
                    {formatPrice(p.price)}
                  </span>
                  <Stars rating={p.rating} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
