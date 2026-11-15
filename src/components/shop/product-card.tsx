"use client";

import Image from "next/image";
import { Eye, Plus, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.round(rating) ? "star-filled fill-current" : "text-muted"
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  const lowStock = product.stock <= 5;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_45px_-20px_rgba(212,175,55,0.25)]">
      {/* Image */}
      <button
        onClick={() => onSelect(product)}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label={`View ${product.brand} ${product.name}`}
      >
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name} — ${product.caseMaterial}, ${product.caseSize}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold/40 bg-background/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gold opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" /> Quick View
        </span>
      </button>

      {/* Badges */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
        {product.featured && (
          <Badge className="border-0 bg-primary/95 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
            Vault Piece
          </Badge>
        )}
        {lowStock && (
          <Badge className="border border-destructive/40 bg-background/85 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-destructive backdrop-blur">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
            {product.brand}
          </span>
          <span className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-muted-foreground">
              ({product.reviewCount})
            </span>
          </span>
        </div>
        <button
          onClick={() => onSelect(product)}
          className="cursor-pointer text-left font-serif text-lg leading-snug transition-colors hover:text-gold-light sm:text-xl"
        >
          {product.name}
        </button>
        <p className="text-xs text-muted-foreground">
          {product.movement === "digital"
            ? "Digital"
            : product.movement.charAt(0).toUpperCase() + product.movement.slice(1)}{" "}
          · {product.caseSize} · {product.style}
        </p>
      </CardContent>

      <CardFooter className="items-center justify-between gap-3 border-t border-border/60 p-4 pt-4 sm:p-5 sm:pt-4">
        <span className="font-serif text-xl text-gold-light">
          {formatPrice(product.price)}
        </span>
        <Button
          size="sm"
          onClick={() => onQuickAdd(product)}
          disabled={product.stock === 0}
          className="h-9 bg-primary/90 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-primary-foreground hover:bg-gold-light"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
