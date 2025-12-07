const express = require("express");
const { pedidos, anulaciones } = require("../memoryStore");
const { randomUUID } = require("crypto");

const router = express.Router();

/**
 * POST /api/refunds
 * Solicitar la anulación de una compra
 *
 * body esperado:
 * {
 *   "orderId": "uuid-del-pedido",
 *   "motivo": "Razón del cliente"
 * }
 */
router.post("/", (req, res) => {
  const { orderId, motivo } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId es obligatorio" });
  }

  const pedido = pedidos.find(p => p.id === orderId);

  if (!pedido) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  const anulacion = {
    id: randomUUID(),
    orderId,
    motivo: motivo || "motivo no especificado",
    fecha: new Date().toISOString(),
    estado: "solicitada" // luego puede pasar a aprobada / rechazada
  };

  anulaciones.push(anulacion);

  // Cambiar estado del pedido
  pedido.estado = "cancel_requested";

  res.status(201).json({
    mensaje: "Anulación solicitada correctamente",
    anulacion
  });
});

/**
 * GET /api/refunds
 * Ver todas las solicitudes de anulación
 */
router.get("/", (req, res) => {
  res.json(anulaciones);
});

module.exports = router;
