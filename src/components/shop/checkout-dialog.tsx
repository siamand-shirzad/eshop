"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cartSubtotal } from "@/store/cart";
import type { SessionUser } from "@/store/auth";
import { formatPrice, formatDate } from "@/lib/format";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
  type CartItem,
  type OrderResponse,
} from "@/lib/types";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().min(5, "Please enter your street address"),
  city: z.string().min(2, "Please enter your city"),
  country: z.string().min(2, "Please enter your country"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onOrderPlaced: () => void;
  user: SessionUser | null;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  items,
  onOrderPlaced,
  user,
}: CheckoutDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const subtotal = cartSubtotal(items);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      notes: "",
    },
  });

  // Prefill signed-in customer details
  useEffect(() => {
    if (open && user) {
      reset((prev) => ({
        ...prev,
        customerName: user.name,
        email: user.email,
      }));
    }
  }, [open, user, reset]);

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to place order");
      }
      const placed = (await res.json()) as { order: OrderResponse };
      setOrder(placed.order);
      onOrderPlaced();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const closeAndReset = () => {
    onOpenChange(false);
    // Delay reset so the dialog exit animation completes
    setTimeout(() => {
      setOrder(null);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : closeAndReset())}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[92vh] max-w-3xl overflow-y-auto border-border/80 bg-card p-0 sm:rounded-xl"
      >
        {order ? (
          /* ————— Success state ————— */
          <div className="flex flex-col items-center px-6 py-14 text-center sm:px-12">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-secondary/60"
            >
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center"
            >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Order confirmed
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Thank you, {order.customerName.split(" ")[0]}.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your order has been received and is being prepared by our atelier.
              A confirmation has been sent to{" "}
              <span className="text-foreground">{order.email}</span>.
            </p>

            <div className="mt-8 w-full max-w-md rounded-xl border border-border/70 bg-secondary/30 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order number</span>
                <span className="font-mono text-base tracking-wider text-gold-light">
                  {order.orderNumber}
                </span>
              </div>
              <Separator className="my-3 bg-border/60" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Placed</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <Separator className="my-3 bg-border/60" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-serif text-lg text-gold-light">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <ul className="mt-6 flex w-full max-w-md flex-wrap justify-center gap-2">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="relative h-16 w-14 overflow-hidden rounded-md border border-border/60"
                  title={`${item.brand} ${item.name} ×${item.quantity}`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.brand} ${item.name}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>

            <Button
              onClick={closeAndReset}
              className="mt-9 h-12 bg-primary px-8 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light"
            >
              Done
            </Button>
            </motion.div>
          </div>
        ) : (
          /* ————— Checkout form ————— */
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <div className="order-2 p-6 sm:p-8 md:order-1">
              <DialogHeader className="space-y-1.5 text-left">
                <DialogTitle className="font-serif text-2xl sm:text-3xl">
                  Checkout
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Complete your details — payment is collected on delivery by
                  our concierge.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-7 space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="customerName">Full name *</Label>
                    <Input
                      id="customerName"
                      placeholder="James Sterling"
                      autoComplete="name"
                      className="bg-secondary/50"
                      {...register("customerName")}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-destructive">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="bg-secondary/50"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 000 1234"
                      autoComplete="tel"
                      className="bg-secondary/50"
                      {...register("phone")}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Street address *</Label>
                    <Input
                      id="address"
                      placeholder="12 Rue du Rhône, Apt 4"
                      autoComplete="street-address"
                      className="bg-secondary/50"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Geneva"
                      autoComplete="address-level2"
                      className="bg-secondary/50"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      placeholder="Switzerland"
                      autoComplete="country-name"
                      className="bg-secondary/50"
                      {...register("country")}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input
                      id="postalCode"
                      placeholder="1204"
                      autoComplete="postal-code"
                      className="bg-secondary/50"
                      {...register("postalCode")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Engraving, preferred delivery window…"
                      className="min-h-10 resize-none bg-secondary/50"
                      {...register("notes")}
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="h-12 w-full gap-2 bg-primary text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Place order · {formatPrice(total)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order summary */}
            <aside className="order-1 border-b border-border/60 bg-secondary/25 p-6 sm:p-8 md:order-2 md:border-b-0 md:border-l">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Order summary
              </h3>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border/60">
                      <Image
                        src={item.image}
                        alt={`${item.brand} ${item.name}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                        {item.brand}
                      </p>
                      <p className="truncate font-serif text-sm">
                        {item.name}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className="my-5 bg-border/60" />
              <div className="space-y-2.5 text-sm">
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
                <div className="flex justify-between text-muted-foreground">
                  <span>Insurance & duties</span>
                  <span className="text-gold">Included</span>
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
              </div>
              <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                Orders are encrypted and fully insured in transit. 30-day
                returns, no questions asked.
              </p>
            </aside>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
