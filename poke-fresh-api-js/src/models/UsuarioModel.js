const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  fechaRegistro: { type: Date, default: Date.now }
});

// Middleware de Mongoose: Antes de guardar, encriptar la contraseña
userSchema.pre('save', async function() {
  // Si la contraseña no ha cambiado, no hacemos nada
  if (!this.isModified('password')) return;
  
  // Generar hash (salt + password)
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparar contraseña
userSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);