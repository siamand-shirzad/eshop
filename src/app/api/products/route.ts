import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase().trim();
    const category = searchParams.get("category");
    const style = searchParams.get("style");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");

    const products = await db.product.findMany({
      orderBy: [{ createdAt: "asc" }],
    });

    const filtered = products.filter((p) => {
      if (
        q &&
        !`${p.name} ${p.brand} ${p.style} ${p.movement} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (category && p.category !== category) return false;
      if (style && p.style !== style) return false;
      if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (featured === "true" && !p.featured) return false;
      return true;
    });

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 },
    );
  }
}
