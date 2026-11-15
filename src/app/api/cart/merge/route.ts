import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { cartPayload } from "../route";

const mergeSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .max(50),
});

/** Merge a guest cart into the signed-in user's server cart. */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const parsed = mergeSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid cart payload" },
        { status: 400 },
      );
    }

    const guestItems = parsed.data.items.filter(
      (item, i, arr) => arr.findIndex((x) => x.productId === item.productId) === i,
    );

    await db.$transaction(async (tx) => {
      for (const item of guestItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true },
        });
        if (!product || product.stock <= 0) continue;

        const existing = await tx.cartItem.findUnique({
          where: {
            userId_productId: { userId: user.id, productId: product.id },
          },
          select: { quantity: true },
        });

        // Max semantics: never double-count an item that already exists on
        // both sides (e.g. session restore, or re-login after sign-out).
        const desired = Math.min(
          Math.max(existing?.quantity ?? 0, item.quantity),
          product.stock,
          20,
        );

        await tx.cartItem.upsert({
          where: {
            userId_productId: { userId: user.id, productId: product.id },
          },
          create: {
            userId: user.id,
            productId: product.id,
            quantity: desired,
          },
          update: { quantity: desired },
        });
      }
    });

    return NextResponse.json({ items: await cartPayload(user.id) });
  } catch (error) {
    console.error("[POST /api/cart/merge]", error);
    return NextResponse.json(
      { error: "Failed to merge cart" },
      { status: 500 },
    );
  }
}
