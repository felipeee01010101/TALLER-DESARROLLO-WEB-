import { Router, Request, Response } from "express";
import { crearPedido, pedidos } from "../db";

const router = Router();

// POST /api/orders
router.post("/", (req: Request, res: Response) => {
  const { userId, metodoPago } = req.body as {
    userId: string;
    metodoPago?: string;
  };

  if (!userId) {
    return res.status(400).json({ error: "userId es obligatorio" });
  }

  const pedido = crearPedido(userId, metodoPago || "web");
  if (!pedido) {
    return res.status(400).json({ error: "Carrito vacío" });
  }

  res.status(201).json({ mensaje: "Pedido creado", pedido });
});

// GET /api/orders
router.get("/", (req: Request, res: Response) => {
  res.json(pedidos);
});

// GET /api/orders/:id
router.get("/:id", (req: Request, res: Response) => {
  const ped = pedidos.find(p => p.id === req.params.id);
  if (!ped) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json(ped);
});

export default router;
