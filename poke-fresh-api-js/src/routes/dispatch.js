const express = require("express");
const { pedidos } = require("../memoryStore");

const router = express.Router();

/**
 * GET /api/dispatch/queue
 * Lista de pedidos que están pendientes o pagados,
 * útil para el módulo de despacho.
 */
router.get("/queue", (req, res) => {
  const lista = pedidos.filter(p =>
    p.estado === "pending" || p.estado === "paid"
  );

  res.json(lista);
});

/**
 * PUT /api/dispatch/:id/status
 * Cambiar el estado de un pedido (en preparación, en camino, entregado, etc.)
 *
 * body esperado:
 * {
 *   "estado": "en_preparacion" | "en_camino" | "entregado" | ...
 * }
 */
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  // Actualizar estado
  pedido.estado = estado || pedido.estado;

  res.json({
    mensaje: "Estado actualizado correctamente",
    pedido
  });
});

/**
 * GET /api/dispatch/track/:id
 * Permite ver el estado actual del pedido (tracking simple).
 */
router.get("/track/:id", (req, res) => {
  const { id } = req.params;
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  res.json({
    orderId: pedido.id,
    estado: pedido.estado,
    mensaje: `El pedido está actualmente en estado: ${pedido.estado}`
  });
});

module.exports = router;
