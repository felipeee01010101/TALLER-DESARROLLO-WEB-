const express = require("express");
const { usuarios } = require("../memoryStore");
const { randomUUID } = require("crypto");

const router = express.Router();

/**
 * POST /api/users/register
 * Registrar un nuevo usuario (solo email + nombre por ahora)
 */
router.post("/register", (req, res) => {
  const { email, nombre } = req.body;

  if (!email || !nombre) {
    return res.status(400).json({ error: "email y nombre son obligatorios" });
  }

  // Evitar usuarios duplicados
  const yaExiste = usuarios.find(u => u.email === email);
  if (yaExiste) {
    return res.status(409).json({ error: "El usuario ya está registrado" });
  }

  const nuevoUsuario = {
    id: randomUUID(),
    email,
    nombre,
    rol: "cliente",               // En02 – rol simple por ahora
    estaVerificado: false,
    fechaRegistro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json({
    mensaje: "Usuario registrado exitosamente",
    usuario: nuevoUsuario
  });
});

/**
 * GET /api/users
 * Listar todos los usuarios registrados
 */
router.get("/", (req, res) => {
  res.json(usuarios);
});

module.exports = router;
