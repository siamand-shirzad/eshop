"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
  type CartItem,
} from "@/lib/types";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartSheet({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartSheetProps) {
  const subtotal = cartSubtotal(items);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = items.length === 0 || freeShipping ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const progress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-full flex-col gap-0 border-border/80 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-2.5 font-serif text-2xl">
              <ShoppingBag className="h-5 w-5 text-gold" />
              Your Bag
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearCart}
                className="h-8 text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive"
              >
                Clear bag
              </Button>
            )}
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {items.length === 0
              ? "Empty"
              : `${items.length} ${items.length === 1 ? "timepiece" : "timepieces"} reserved`}
          </p>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-secondary/50">
              <ShoppingBag className="h-7 w-7 text-gold/70" />
            </div>
            <h3 className="font-serif text-xl">Your bag is empty</h3>
            <p className="max-w-60 text-sm text-muted-foreground">
              Discover our curated collection of fine timepieces.
            </p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-2 border-gold/40 text-xs uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
            >
              Continue browsing
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-border/60 px-5 py-4 sm:px-6">
              <p className="mb-2 text-xs text-muted-foreground">
                {freeShipping ? (
                  <span className="text-gold">
                    ✦ Complimentary insured shipping unlocked
                  </span>
                ) : (
                  <>
                    Add{" "}
                    <strong className="text-foreground">
                      {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                    </strong>{" "}
                    more for complimentary shipping
                  </>
                )}
              </p>
              <Progress
                value={progress}
                className="h-1.5 bg-secondary"
                aria-label="Free shipping progress"
              />
            </div>

            {/* Items */}
            <div className="max-h-[calc(100vh-30rem)] flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <ul className="space-y-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: 48,
                        transition: { duration: 0.22 },
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex gap-4"
                      aria-label={`${item.brand} ${item.name}`}
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-border/60 bg-secondary">
                        <Image
                          src={item.image}
                          alt={`${item.brand} ${item.name}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                              {item.brand}
                            </p>
                            <h4 className="truncate font-serif text-base">
                              {item.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.productId)}
                            className="rounded-md p-1.5 text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-destructive"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex h-8 items-center rounded-md border border-border bg-secondary/50">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.productId, item.quantity - 1)
                              }
                              className="flex h-full w-8 items-center justify-center text-muted-foreground hover:text-gold"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="flex h-full w-8 items-center justify-center text-muted-foreground hover:text-gold disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-serif text-base text-gold-light">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* Summary */}
            <SheetFooter className="mt-auto border-t border-border/60 p-5 sm:p-6">
              <div className="w-full space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={freeShipping ? "text-gold" : "text-foreground"}>
                    {freeShipping ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <Separator className="bg-border/60" />
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Total
                  </span>
                  <span className="font-serif text-2xl text-gold-light">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="mt-3 h-12 w-full gap-2 bg-primary text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light"
                >
                  Proceed to checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-full pt-1 text-center text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Continue shopping
                </button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
