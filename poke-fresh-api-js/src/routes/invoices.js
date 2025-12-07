const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

// POST /api/invoices/generate
// Genera una boleta automáticamente para una orden específica
router.post('/generate', async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Buscar la orden en la base de datos
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // 2. Verificar si ya existe una boleta para esta orden (evitar duplicados)
    const existingInvoice = await Invoice.findOne({ orderId });
    if (existingInvoice) {
      return res.status(200).json({ 
        message: 'La boleta ya existe', 
        invoice: existingInvoice 
      });
    }

    // 3. Crear la nueva boleta
    // Simulamos una URL de PDF basada en el ID de la orden
    const newInvoice = await Invoice.create({
      orderId: order._id,
      usuario: order.usuario,
      total: order.total,
      urlPdf: `https://pokefresh.cl/documentos/boleta_${order._id}.pdf`,
      estado: 'emitida'
    });

    // 4. Responder con la boleta creada
    res.status(201).json({ 
      message: 'Boleta generada exitosamente', 
      invoice: newInvoice 
    });

  } catch (error) {
    console.error("Error generando boleta:", error);
    res.status(500).json({ error: "Error del servidor al generar boleta" });
  }
});

// GET /api/invoices/:id
// Permite consultar una boleta por su ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('orderId');
    if (!invoice) {
      return res.status(404).json({ error: 'Boleta no encontrada' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la boleta" });
  }
});

module.exports = router;