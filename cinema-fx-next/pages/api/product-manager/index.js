// pages/api/product-manager/index.js
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    }

    if (method === "POST") {
      const form = formidable({
        uploadDir: path.join(process.cwd(), "public", "assets"),
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          return `${part.name}-${uniqueSuffix}${ext}`;
        },
      });

      const [fields, files] = await form.parse(req);

      const { name, description, category, featured, stock, price } = fields;
      const imageFile = files.image && files.image[0];

      if (
        !name ||
        !description ||
        !category ||
        !stock ||
        !price ||
        !imageFile
      ) {
        if (imageFile) {
          await fs.unlink(imageFile.filepath);
        }
        return res
          .status(400)
          .json({ error: "Missing required fields or image." });
      }

      const imageUrl = `/assets/${path.basename(imageFile.filepath)}`;

      const newProduct = await prisma.product.create({
        data: {
          name: name[0],
          description: description[0],
          category: category[0],
          featured: featured
            ? featured[0] === "true" || featured[0] === "on"
            : false,
          stock: parseInt(stock[0]),
          price: parseInt(price[0]),
          image: imageUrl,
          inStock: parseInt(stock[0]) > 0,
        },
      });
      return res.status(201).json(newProduct);
    }

    if (method === "PUT") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }

      const parsedBody = JSON.parse(body);
      const { id, description, price, stock, name, category, featured } =
        parsedBody;

      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          stock,
          category,
          featured,
          inStock: stock > 0,
        },
      });

      return res.status(200).json(updated);
    }

    if (method === "DELETE") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }

      const parsedBody = JSON.parse(body);
      const { id } = parsedBody;

      const productToDelete = await prisma.product.findUnique({
        where: { id },
      });
      if (productToDelete && productToDelete.image) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          productToDelete.image
        );
        try {
          await fs.unlink(imagePath);
        } catch (unlinkError) {
          console.warn(
            `Could not delete image file: ${imagePath}`,
            unlinkError
          );
        }
      }

      await prisma.product.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error or file upload issue." });
  }
}
