import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
} from "@/lib/types";

const orderSchema = z.object({
  customerName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  address: z.string().min(5).max(300),
  city: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Cart is empty"),
});

function generateOrderNumber(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const stamp = Date.now().toString(36).slice(-3).toUpperCase();
  return `CHR-${stamp}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ?? "Invalid order information",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Load referenced products and validate stock
    const productIds = data.items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    if (productMap.size !== productIds.length) {
      return NextResponse.json(
        { error: "One or more items are no longer available" },
        { status: 400 },
      );
    }

    for (const item of data.items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.brand} ${product.name} (${product.stock} left)`,
          },
          { status: 409 },
        );
      }
    }

    // Server-authoritative pricing
    const subtotal = data.items.reduce(
      (sum, item) => sum + productMap.get(item.productId)!.price * item.quantity,
      0,
    );
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;

    const sessionUser = await getSessionUser();

    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: data.customerName,
          email: data.email,
          phone: data.phone || null,
          address: data.address,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode || null,
          notes: data.notes || null,
          subtotal,
          shipping,
          total,
          status: "confirmed",
          ...(sessionUser ? { userId: sessionUser.id } : {}),
        },
      });

      for (const item of data.items) {
        const product = productMap.get(item.productId)!;
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.price,
            quantity: item.quantity,
          },
        });
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Signed-in buyers: empty their server cart after purchase
      if (sessionUser) {
        await tx.cartItem.deleteMany({ where: { userId: sessionUser.id } });
      }

      return tx.order.findUnique({
        where: { id: created.id },
        include: { items: true },
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  }
}
