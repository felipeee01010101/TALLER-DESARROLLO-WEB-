const express = require("express");
const router = express.Router();
const User = require("../models/UsuarioModel"); // Importamos el modelo de usuario
const jwt = require("jsonwebtoken"); // Necesitarás instalar: npm install jsonwebtoken

// --- REGISTRO DE USUARIO ---
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, direccion, telefono } = req.body;

    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // 2. Crear el nuevo usuario
    // La encriptación de contraseña ocurre automáticamente en el modelo User.js
    const user = await User.create({
      nombre,
      email,
      password,
      // Puedes agregar más campos si tu modelo los soporta
      // direccion, telefono 
    });

    // 3. Responder con éxito
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: user._id,
      email: user.email
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error del servidor al registrar usuario" });
  }
});

// --- LOGIN DE USUARIO ---
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 2. Verificar la contraseña
    const isMatch = await user.compararPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar Token JWT (Bonus Seguridad)
    // Usamos la clave secreta del archivo .env
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET || "secreto_temporal_123", // Fallback por si no hay .env
      { expiresIn: "1d" } // El token expira en 1 día
    );

    // 4. Responder con el token y datos básicos
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error del servidor al iniciar sesión" });
  }
});

// --- OTRAS RUTAS DE AUTH (Recuperación, etc.) ---
// (Puedes agregarlas aquí siguiendo el patrón de tus diagramas)

router.post("/forgot-password", (req, res) => {
    // Simulación para cumplir con la historia B05
    res.json({ message: "Si el correo existe, se ha enviado un link de recuperación." });
});

module.exports = router;