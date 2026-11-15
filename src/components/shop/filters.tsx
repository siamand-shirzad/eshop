"use client";

import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

export interface FilterState {
  category: string; // "all" | men | women | unisex
  brands: string[];
  styles: string[];
  movements: string[];
  maxPrice: number; // dollars
}

export const DEFAULT_FILTERS: FilterState = {
  category: "all",
  brands: [],
  styles: [],
  movements: [],
  maxPrice: 15000,
};

interface FiltersPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  brands: string[];
  styles: string[];
  movements: string[];
  maxPrice: number;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function CheckGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-2.5">
        {options.map((option) => {
          const id = `${title}-${option}`.replace(/\s+/g, "-").toLowerCase();
          return (
            <div key={option} className="flex items-center space-x-2.5">
              <Checkbox
                id={id}
                checked={selected.includes(option)}
                onCheckedChange={() => onToggle(option)}
                className="border-muted-foreground/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Label
                htmlFor={id}
                className="cursor-pointer text-sm font-normal capitalize text-foreground/85 hover:text-gold"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FiltersPanel({
  filters,
  onChange,
  brands,
  styles,
  movements,
  maxPrice,
}: FiltersPanelProps) {
  const isDirty =
    filters.category !== "all" ||
    filters.brands.length > 0 ||
    filters.styles.length > 0 ||
    filters.movements.length > 0 ||
    filters.maxPrice < DEFAULT_FILTERS.maxPrice;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg">Refine</h3>
        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...DEFAULT_FILTERS, maxPrice: maxPrice })}
            className="h-8 gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-gold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Wearer
        </h4>
        <div className="flex flex-wrap gap-2">
          {["all", "men", "women", "unisex"].map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...filters, category: c })}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-all ${
                filters.category === c
                  ? "border-primary bg-primary/15 text-gold"
                  : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
              }`}
              aria-pressed={filters.category === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Max price
          </h4>
          <span className="font-serif text-sm text-gold-light">
            {formatPrice(filters.maxPrice * 100)}
          </span>
        </div>
        <Slider
          value={[filters.maxPrice]}
          min={300}
          max={maxPrice}
          step={100}
          onValueChange={([v]) => onChange({ ...filters, maxPrice: v })}
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>$300</span>
          <span>{formatPrice(maxPrice * 100)}</span>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <CheckGroup
        title="Maison"
        options={brands}
        selected={filters.brands}
        onToggle={(v) =>
          onChange({ ...filters, brands: toggleValue(filters.brands, v) })
        }
      />

      <Separator className="bg-border/60" />

      <CheckGroup
        title="Style"
        options={styles}
        selected={filters.styles}
        onToggle={(v) =>
          onChange({ ...filters, styles: toggleValue(filters.styles, v) })
        }
      />

      <Separator className="bg-border/60" />

      <CheckGroup
        title="Movement"
        options={movements}
        selected={filters.movements}
        onToggle={(v) =>
          onChange({
            ...filters,
            movements: toggleValue(filters.movements, v),
          })
        }
      />
    </div>
  );
}
