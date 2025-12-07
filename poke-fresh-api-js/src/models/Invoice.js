const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  folio: { 
    type: String, 
    unique: true,
    required: true 
  },
  fechaEmision: { 
    type: Date, 
    default: Date.now 
  },
  // Datos del receptor 
  receptor: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    direccion: { type: String, default: 'Sin dirección' },
    telefono: String
  },
  // Detalle de los ítems facturados
  detalle: [{
    nombreProducto: String,
    cantidad: Number,
    precioUnitario: Number,
    totalLinea: Number
  }],
  // Desglose de montos
  montos: {
    neto: Number,
    iva: Number,
    total: Number
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);