import { Router, Request, Response } from "express";
import { productos } from "../db";

const router = Router();

// GET /api/catalog
router.get("/", (req: Request, res: Response) => {
  const categoria = req.query.categoria as string | undefined;

  if (categoria) {
    const filtrados = productos.filter(p =>
      p.categorias.includes(categoria)
    );
    return res.json(filtrados);
  }

  res.json(productos);
});

// GET /api/catalog/:id
router.get("/:id", (req: Request, res: Response) => {
  const prod = productos.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(prod);
});

export default router;
