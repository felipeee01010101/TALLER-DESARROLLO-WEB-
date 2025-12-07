const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  // Array de strings para soportar múltiples categorías (ej: ["bowls", "veganos"])
  categorias: [{ type: String }], 
  desc: { type: String, required: true }, 
  img: { type: String, required: true }, 
  stock: { type: Number, default: 0 },
  disponible: { type: Boolean, default: true }
});

// ESTA LÍNEA ES LA QUE TE FALTABA O ESTABA MAL:
module.exports = mongoose.model('Product', productSchema);