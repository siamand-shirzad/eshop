"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart, cartCount } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { Header } from "@/components/shop/header";
import { Hero } from "@/components/shop/hero";
import { BrandMarquee } from "@/components/shop/marquee";
import { Featured } from "@/components/shop/featured";
import { Catalog } from "@/components/shop/catalog";
import { ProductDialog } from "@/components/shop/product-dialog";
import { CartSheet } from "@/components/shop/cart-sheet";
import { CheckoutDialog } from "@/components/shop/checkout-dialog";
import { AuthDialog } from "@/components/shop/auth-dialog";
import { OrdersSheet } from "@/components/shop/orders-sheet";
import { Maison } from "@/components/shop/maison";
import { Footer } from "@/components/shop/footer";
import type { Product } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOpen, setProductOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const { items, addItem, removeItem, updateQuantity, clearCart, mergeOnLogin } =
    useCart();
  const { user, ready, refresh } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore session on load
  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Sync/merge the cart with the server whenever a user signs in
  const prevUserId = useRef<string | null>(null);
  useEffect(() => {
    const id = user?.id ?? null;
    if (id && prevUserId.current !== id) {
      void mergeOnLogin();
    }
    prevUserId.current = id;
  }, [user, mergeOnLogin]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load collection");
        const data = (await res.json()) as { products: Product[] };
        if (!cancelled) setProducts(data.products);
      } catch {
        if (!cancelled) {
          toast({
            title: "Something went wrong",
            description: "Could not load the collection. Please refresh.",
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const featured = useMemo(
    () => products.filter((p) => p.featured),
    [products],
  );

  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProductOpen(true);
  }, []);

  const handleAdd = useCallback(
    (product: Product, qty = 1) => {
      if (product.stock === 0) return;
      addItem(product, qty);
      toast({
        title: "Added to your bag",
        description: `${product.brand} ${product.name}${qty > 1 ? ` ×${qty}` : ""}`,
      });
    },
    [addItem, toast],
  );

  const handleViewAll = useCallback(() => {
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    if (q.length === 1) {
      document
        .getElementById("collection")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const itemCount = mounted ? cartCount(items) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenCart={() => setCartOpen(true)}
        itemCount={itemCount}
        user={mounted ? user : null}
        ready={mounted && ready}
        onSignIn={() => setAuthOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <main className="flex-1">
        <Hero />
        <BrandMarquee />
        <Featured
          products={featured}
          onSelect={handleSelect}
          onViewAll={handleViewAll}
        />
        <Catalog
          products={products}
          loading={loading}
          searchQuery={searchQuery}
          onSelect={handleSelect}
          onQuickAdd={(p) => handleAdd(p, 1)}
        />
        <Maison />
      </main>

      <Footer />

      <ProductDialog
        product={selectedProduct}
        open={productOpen}
        onOpenChange={setProductOpen}
        onAddToCart={(p, qty) => {
          handleAdd(p, qty);
          setProductOpen(false);
          setCartOpen(true);
        }}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={() => {
          clearCart();
          toast({ title: "Bag cleared" });
        }}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={items}
        user={user}
        onOrderPlaced={clearCart}
      />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <OrdersSheet
        open={ordersOpen}
        onOpenChange={setOrdersOpen}
        onBrowse={handleViewAll}
      />
    </div>
  );
}
