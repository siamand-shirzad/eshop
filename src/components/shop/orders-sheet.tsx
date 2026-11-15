"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderResponse } from "@/lib/types";

interface OrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrowse: () => void;
}

export function OrdersSheet({ open, onOpenChange, onBrowse }: OrdersSheetProps) {
  // null = not yet loaded for this session; [] = loaded and empty
  const [orders, setOrders] = useState<OrderResponse[] | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/orders/mine");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) setOrders(data.orders ?? []);
      } catch {
        if (!cancelled) setOrders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const loading = open && orders === null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-full flex-col gap-0 border-border/80 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60 p-5 sm:p-6">
          <SheetTitle className="flex items-center gap-2.5 font-serif text-2xl">
            <Package className="h-5 w-5 text-gold" />
            My Orders
          </SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Your CHRONOS order history
          </SheetDescription>
        </SheetHeader>

        <div className="max-h-[calc(100vh-9.5rem)] flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-xl border border-border/60 p-4">
                  <Skeleton className="h-4 w-36 bg-secondary/60" />
                  <Skeleton className="h-3 w-24 bg-secondary/60" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-14 w-12 bg-secondary/60" />
                    <Skeleton className="h-14 w-12 bg-secondary/60" />
                  </div>
                  <Skeleton className="h-5 w-28 bg-secondary/60" />
                </div>
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-secondary/50">
                <ShoppingBag className="h-7 w-7 text-gold/70" />
              </div>
              <h3 className="font-serif text-xl">No orders yet</h3>
              <p className="max-w-60 text-sm text-muted-foreground">
                Your first timepiece awaits in the collection.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onBrowse();
                }}
                className="mt-2 border-gold/40 text-xs uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
              >
                Browse the collection
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, i) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                  className="rounded-xl border border-border/60 bg-secondary/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm tracking-wider text-gold-light">
                      {order.orderNumber}
                    </span>
                    <Badge className="border-primary/40 bg-primary/15 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-gold">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="relative h-14 w-12 overflow-hidden rounded-md border border-border/60"
                        title={`${item.brand} ${item.name} ×${item.quantity}`}
                      >
                        <Image
                          src={item.image}
                          alt={`${item.brand} ${item.name}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {order.items.reduce((s, it) => s + it.quantity, 0)}{" "}
                      {order.items.reduce((s, it) => s + it.quantity, 0) === 1
                        ? "piece"
                        : "pieces"}
                    </span>
                  </div>

                  <Separator className="my-3 bg-border/50" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Total
                    </span>
                    <span className="font-serif text-lg text-gold-light">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
