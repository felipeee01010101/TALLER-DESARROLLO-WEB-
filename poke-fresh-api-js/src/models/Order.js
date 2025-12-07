const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Si el usuario está logueado, guardamos su ID (referencia al modelo User)
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  
  // Datos de contacto para el despacho
  cliente: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: String,
    direccion: String
  },

  // Lista de productos comprados
  items: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Link al producto real
    nombre: String, // Guardamos el nombre por si cambia después
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true } // Precio al momento de la compra
  }],

  total: { type: Number, required: true },
  
  // Estados del pedido para el seguimiento (Trazabilidad)
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'en_preparacion', 'en_camino', 'entregado', 'anulado'],
    default: 'pendiente'
  },
  
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);