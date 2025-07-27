// pages/api/cart/newuser.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Get productId, quantity, sessionId, and userEmail from the request body
  let { productId, quantity, sessionId, userEmail } = req.body;
  console.log("addApi", userEmail, sessionId);

  // Try to get userEmail from req.body first, then from session
  if (!userEmail) {
    const session = await getServerSession(req, res, authOptions);
    userEmail = session?.user?.email || null;
  }

  // Validate input
  if (!productId || !quantity || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields" });
  }

  try {
    if (userEmail && sessionId) {
      // If both userEmail and sessionId exist, migrate guest cart to user
      const existingGuestCart = await prisma.cartItem.findFirst({
        where: { sessionId, productId },
      });

      if (existingGuestCart) {
        // If a cart item already exists for the user, update its quantity
        const existingUserCart = await prisma.cartItem.findFirst({
          where: { userEmail, productId },
        });

        if (existingUserCart) {
          // Merge quantities and delete guest cart item
          await prisma.cartItem.update({
            where: { id: existingUserCart.id },
            data: {
              quantity: existingUserCart.quantity,
            },
          });
          await prisma.cartItem.delete({
            where: { id: existingGuestCart.id },
          });
        } else {
          // Assign guest cart item to user
          await prisma.cartItem.update({
            where: { id: existingGuestCart.id },
            data: {
              userEmail,
              sessionId,
              quantity: existingGuestCart.quantity,
            },
          });
        }
        return res
          .status(200)
          .json({ message: "Cart migrated and item added/updated" });
      }
    }

    // Check if the cart item already exists for this user/session and product
    const existing = await prisma.cartItem.findFirst({
      where: { sessionId, productId },
    });

    if (existing) {
      // If it exists, update the quantity
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity,
        },
      });
    } else {
      // Otherwise, create a new cart item
      await prisma.cartItem.create({
        data: {
          userEmail: userEmail || null, // will be null for guests
          sessionId: sessionId, // will be null for logged-in users
          productId,
          quantity,
        },
      });
    }

    return res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Cart Add Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
