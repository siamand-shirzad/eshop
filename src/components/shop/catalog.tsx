"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, SearchX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import {
  FiltersPanel,
  DEFAULT_FILTERS,
  type FilterState,
} from "./filters";
import { SORT_OPTIONS } from "@/lib/types";
import type { Product } from "@/lib/types";

interface CatalogProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function Catalog({
  products,
  loading,
  searchQuery,
  onSelect,
  onQuickAdd,
}: CatalogProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<string>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products],
  );
  const styles = useMemo(
    () => [...new Set(products.map((p) => p.style))].sort(),
    [products],
  );
  const movements = useMemo(
    () => [...new Set(products.map((p) => p.movement))].sort(),
    [products],
  );
  const maxPrice = useMemo(
    () =>
      products.length > 0
        ? Math.ceil(Math.max(...products.map((p) => p.price / 100)) / 100) * 100
        : 15000,
    [products],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      if (
        q &&
        !`${p.name} ${p.brand} ${p.style} ${p.movement} ${p.category}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (filters.category !== "all" && p.category !== filters.category)
        return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand))
        return false;
      if (filters.styles.length > 0 && !filters.styles.includes(p.style))
        return false;
      if (
        filters.movements.length > 0 &&
        !filters.movements.includes(p.movement)
      )
        return false;
      if (p.price / 100 > filters.maxPrice) return false;
      return true;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price,
        );
    }
    return list;
  }, [products, searchQuery, filters, sort]);

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    filters.brands.length +
    filters.styles.length +
    filters.movements.length +
    (filters.maxPrice < DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const filtersPanel = (
    <FiltersPanel
      filters={filters}
      onChange={setFilters}
      brands={brands}
      styles={styles}
      movements={movements}
      maxPrice={maxPrice}
    />
  );

  return (
    <section
      id="collection"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-24 pt-8 sm:px-6 sm:pt-12"
      aria-label="Watch collection"
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            <span className="gold-hairline w-10" />
            {products.length} references
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl">The Collection</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter trigger */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative gap-2 border-border bg-secondary/40 text-xs font-medium uppercase tracking-[0.1em] hover:border-gold/40 hover:text-gold lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 min-w-5 rounded-full bg-primary px-1 font-sans text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">
                  Refine Collection
                </SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">{filtersPanel}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              className="h-10 w-44 border-border bg-secondary/40 text-xs uppercase tracking-[0.08em] hover:border-gold/40 sm:w-52"
              aria-label="Sort collection"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Search / filter status line */}
      {(searchQuery || activeFilterCount > 0) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filtered.length}</strong>{" "}
            of {products.length} timepieces
          </span>
          {searchQuery && (
            <Badge
              variant="outline"
              className="border-gold/30 bg-secondary/40 font-sans text-xs normal-case text-foreground"
            >
              “{searchQuery}”
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-start gap-10">
        {/* Desktop sidebar */}
        <aside className="sticky top-36 hidden w-60 shrink-0 self-start lg:block">
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">
            {filtersPanel}
          </div>
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl bg-secondary/60" />
                  <Skeleton className="h-4 w-1/3 bg-secondary/60" />
                  <Skeleton className="h-5 w-2/3 bg-secondary/60" />
                  <Skeleton className="h-6 w-1/4 bg-secondary/60" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-24 text-center">
              <SearchX className="mb-4 h-10 w-10 text-muted-foreground/50" />
              <h3 className="font-serif text-2xl">No timepieces found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try broadening your filters or searching for another maison,
                style, or movement.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-6 border-gold/40 text-xs uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <ProductCard
                      product={product}
                      onSelect={onSelect}
                      onQuickAdd={onQuickAdd}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
