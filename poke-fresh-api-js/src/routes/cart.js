const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// POST /api/cart/items - Agregar ítem al carrito
// (En un sistema real, aquí buscaríamos el carrito del usuario en la BD.
//  Para cumplir el Criterio 10 de integración, calcularemos el total y lo devolveremos).
router.post("/items", async (req, res) => {
  try {
    const { productId, qty } = req.body;

    // 1. Validar que el producto exista en MongoDB
    const producto = await Product.findById(productId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // 2. Simular respuesta del carrito actualizado
    // (Aquí podrías guardar en una colección 'Cart' si quisieras ir más allá)
    const total = producto.precio * qty;

    res.json({
      message: "Producto agregado",
      item: {
        productId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        qty: qty,
        subtotal: total
      },
      totalCarrito: total // En una app real, sumaríamos todos los items
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cart - Ver carrito
router.get("/", (req, res) => {
  // Si estuviéramos guardando carritos en BD, aquí lo buscaríamos.
  res.json({ items: [], total: 0, message: "Carrito vacío (Implementación básica)" });
});

module.exports = router;