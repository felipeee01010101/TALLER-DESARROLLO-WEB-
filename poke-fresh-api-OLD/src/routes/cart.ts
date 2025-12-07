import { Router, Request, Response } from "express";
import { carritos, productos } from "../db";
import { CartItem } from "../models";

const router = Router();

// GET /api/cart/:userId
router.get("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json(carritos[userId] ?? []);
});

// POST /api/cart/:userId/items
router.post("/:userId/items", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { productId, qty } = req.body as { productId: string; qty?: number };

  const prod = productos.find(p => p.id === productId);
  if (!prod) return res.status(404).json({ error: "Producto no encontrado" });

  const cantidad = qty && qty > 0 ? qty : 1;

  const items = (carritos[userId] = carritos[userId] ?? []);
  const existing = items.find(i => i.productId === productId);

  if (existing) {
    existing.qty += cantidad;
  } else {
    const item: CartItem = {
      productId,
      nombre: prod.nombre,
      precio: prod.precio,
      qty: cantidad
    };
    items.push(item);
  }

  res.json({ mensaje: "Producto agregado", carrito: items });
});

// DELETE /api/cart/:userId
router.delete("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  carritos[userId] = [];
  res.json({ mensaje: "Carrito vacío" });
});

export default router;
