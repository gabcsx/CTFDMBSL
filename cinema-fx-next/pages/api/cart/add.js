// pages/api/cart/add.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { productId, quantity, sessionId } = req.body;

  // Validate input
  if (!productId || !quantity || quantity < 1 || !sessionId) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields" });
  }

  // Always get userEmail from session if present
  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email || null;

  try {
    // --- MIGRATION LOGIC: If user just logged in, migrate guest cart ---
    if (userEmail && sessionId) {
      const guestCartItems = await prisma.cartItem.findMany({
        where: {
          sessionId,
          userEmail: null,
        },
      });

      for (const item of guestCartItems) {
        const userCartItem = await prisma.cartItem.findFirst({
          where: {
            sessionId,
            productId: item.productId,
            userEmail,
          },
        });

        if (userCartItem) {
          // Merge quantities if same product exists
          await prisma.cartItem.update({
            where: { id: userCartItem.id },
            data: { quantity: userCartItem.quantity + item.quantity },
          });
          await prisma.cartItem.delete({ where: { id: item.id } });
        } else {
          // Assign guest cart item to user
          await prisma.cartItem.update({
            where: { id: item.id },
            data: { userEmail },
          });
        }
      }
    }

    // --- ADD/UPDATE LOGIC ---
    let existingCartItem;
    if (userEmail) {
      existingCartItem = await prisma.cartItem.findFirst({
        where: { sessionId, productId, userEmail },
      });
    } else {
      existingCartItem = await prisma.cartItem.findFirst({
        where: { sessionId, productId, userEmail: null },
      });
    }

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userEmail: userEmail || null,
          sessionId,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart for confirmation
    const updatedCart = await prisma.cartItem.findMany({
      where: userEmail
        ? { sessionId, userEmail }
        : { sessionId, userEmail: null },
    });

    return res.status(200).json({
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Cart Add Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
