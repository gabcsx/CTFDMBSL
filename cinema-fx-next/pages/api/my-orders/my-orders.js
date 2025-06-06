// pages/api/orders.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        email: session.user.email,
        NOT: { status: "FAIL" }
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { purchaseDate: "desc" },
    });

    const orders = transactions.map((t) => ({
      id: t.id,
      status: t.status,
      totalPrice: t.totalPrice,
      items: t.orderItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to load orders" });
  }
}
