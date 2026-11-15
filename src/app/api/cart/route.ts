import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { CartItem } from "@/lib/types";

const MAX_QTY = 20;

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_QTY),
});

const patchSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(MAX_QTY),
});

/** Build the authoritative client cart payload, capping quantities at live stock. */
export async function cartPayload(userId: string): Promise<CartItem[]> {
  const rows = await db.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  return rows
    .filter((r) => r.product.stock > 0)
    .map((r) => ({
      productId: r.productId,
      slug: r.product.slug,
      name: r.product.name,
      brand: r.product.brand,
      image: r.product.image,
      price: r.product.price,
      quantity: Math.min(r.quantity, r.product.stock),
      stock: r.product.stock,
    }));
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await cartPayload(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const parsed = addSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid cart item" },
        { status: 400 },
      );
    }
    const { productId, quantity } = parsed.data;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product || product.stock <= 0) {
      return NextResponse.json(
        { error: "This timepiece is no longer available" },
        { status: 400 },
      );
    }

    await db.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: {
        userId: user.id,
        productId,
        quantity: Math.min(quantity, product.stock),
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });

    // Cap at stock after increment
    await db.cartItem.updateMany({
      where: { userId: user.id, productId, quantity: { gt: product.stock } },
      data: { quantity: product.stock },
    });

    return NextResponse.json({ items: await cartPayload(user.id) });
  } catch (error) {
    console.error("[POST /api/cart]", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid cart item" },
        { status: 400 },
      );
    }
    const { productId, quantity } = parsed.data;

    if (quantity <= 0) {
      await db.cartItem.deleteMany({ where: { userId: user.id, productId } });
    } else {
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      await db.cartItem.update({
        where: { userId_productId: { userId: user.id, productId } },
        data: { quantity: Math.min(quantity, product.stock) },
      });
    }

    return NextResponse.json({ items: await cartPayload(user.id) });
  } catch (error) {
    console.error("[PATCH /api/cart]", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const all = searchParams.get("all");

    if (all === "1") {
      await db.cartItem.deleteMany({ where: { userId: user.id } });
    } else if (productId) {
      await db.cartItem.deleteMany({ where: { userId: user.id, productId } });
    } else {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    return NextResponse.json({ items: await cartPayload(user.id) });
  } catch (error) {
    console.error("[DELETE /api/cart]", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}
