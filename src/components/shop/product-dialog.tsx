"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Undo2,
  ShoppingBag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Stars } from "./product-card";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export function ProductDialog({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: ProductDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[92vh] max-w-4xl overflow-y-auto border-border/80 bg-card p-0 sm:rounded-xl"
      >
        {/* Keyed by product id so quantity state resets between products */}
        <ProductDialogBody
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProductDialogBody({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  const specs: [string, string][] = [
    ["Movement", product.movement],
    ["Case", product.caseMaterial],
    ["Diameter", product.caseSize],
    ["Water resistance", product.waterRes],
    ["Strap", product.strap],
    ["Reference", product.slug.toUpperCase()],
  ];

  return (
    <div className="grid md:grid-cols-2">
      {/* Image side */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary md:aspect-auto md:min-h-[560px]">
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name} — ${product.caseMaterial}, ${product.caseSize}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.featured && (
              <Badge className="absolute left-4 top-4 border-0 bg-primary font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
                Vault Piece
              </Badge>
            )}
          </div>

          {/* Details side */}
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <DialogHeader className="space-y-2 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                {product.brand}
              </p>
              <DialogTitle className="font-serif text-3xl leading-tight sm:text-4xl">
                {product.name}
              </DialogTitle>
              <DialogDescription asChild>
                <div className="flex items-center gap-2.5">
                  <Stars rating={product.rating} />
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} · {product.reviewCount} reviews
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>

            <p className="font-serif text-3xl text-gold-light">
              {formatPrice(product.price)}
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <Separator className="bg-border/60" />

            {/* Specs */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              {specs.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm capitalize text-foreground/90">{v}</dd>
                </div>
              ))}
            </dl>

            <Separator className="bg-border/60" />

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 items-center rounded-md border border-border bg-secondary/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full w-10 rounded-none text-muted-foreground hover:text-gold"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span
                  className="w-10 text-center font-serif text-lg"
                  aria-live="polite"
                  aria-label={`Quantity ${qty}`}
                >
                  {qty}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full w-10 rounded-none text-muted-foreground hover:text-gold"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => onAddToCart(product, qty)}
                disabled={product.stock === 0}
                className="h-12 flex-1 gap-2 bg-primary text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock === 0 ? "Sold out" : "Add to bag"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {product.stock === 0
                ? "Join the waitlist — more arriving soon."
                : product.stock <= 5
                  ? `Hurry — only ${product.stock} pieces remaining.`
                  : `In stock · ships within 24 hours.`}
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-border/70 bg-secondary/30 p-4">
              {[
                { icon: ShieldCheck, label: "2-year warranty" },
                { icon: Truck, label: "Insured delivery" },
                { icon: Undo2, label: "30-day returns" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
}
