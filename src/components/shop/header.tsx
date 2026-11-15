"use client";

import { useState } from "react";
import { Search, ShoppingBag, Menu, Watch, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "./user-menu";
import type { SessionUser } from "@/store/auth";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  itemCount: number;
  user: SessionUser | null;
  ready: boolean;
  onSignIn: () => void;
  onOpenOrders: () => void;
}

const NAV_LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#featured", label: "The Vault" },
  { href: "#brands", label: "Maisons" },
  { href: "#about", label: "Maison" },
];

export function Header({
  searchQuery,
  onSearchChange,
  onOpenCart,
  itemCount,
  user,
  ready,
  onSignIn,
  onOpenOrders,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-[11px] font-medium uppercase tracking-[0.18em]">
          Complimentary insured worldwide shipping on orders over $500
        </p>
      </div>

      <div className="border-b border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72" aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle className="font-serif text-xl tracking-wide">
                  CHRONOS
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-3 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <a href="#" className="flex shrink-0 items-center gap-2.5" aria-label="CHRONOS home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-secondary">
              <Watch className="h-5 w-5 text-gold" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-serif text-xl tracking-[0.22em]">
                CHRONOS
              </span>
              <span className="text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
                Fine Watches
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            className="ml-6 hidden items-center gap-7 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden w-56 lg:block xl:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search timepieces…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 border-input bg-secondary/60 pl-9 text-sm placeholder:text-muted-foreground/70"
                aria-label="Search timepieces"
              />
            </div>

            {/* Cart */}
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenCart}
              className="relative h-10 w-10 border-gold/30 bg-secondary/60 hover:border-gold hover:bg-accent"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-sans text-[10px] font-bold text-primary-foreground"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </Button>

            {/* Account */}
            <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />
            {!ready ? (
              <Skeleton className="h-10 w-10 rounded-full bg-secondary/70" />
            ) : user ? (
              <UserMenu onOpenOrders={onOpenOrders} />
            ) : (
              <Button
                variant="outline"
                onClick={onSignIn}
                className="h-10 gap-2 border-gold/30 bg-secondary/60 px-3 text-xs font-medium uppercase tracking-[0.1em] hover:border-gold hover:text-gold sm:px-4"
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        <div className="border-t border-border/60 px-4 py-2 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search timepieces…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 border-input bg-secondary/60 pl-9 text-sm placeholder:text-muted-foreground/70"
              aria-label="Search timepieces"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
