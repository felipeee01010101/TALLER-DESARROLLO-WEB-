const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Importar rutas
const catalogRoutes = require("./routes/catalog");
const userRoutes = require("./routes/users"); // Si tienes esta ruta
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const dispatchRoutes = require("./routes/dispatch"); // Si tienes esta ruta
// NUEVO: Importar rutas de boletas
const invoiceRoutes = require("./routes/invoices"); 

const { notFound } = require("./middleware/notFound"); // Si usas middlewares
const { errorHandler } = require("./middleware/error"); // Si usas middlewares

const app = express();
const PORT = process.env.PORT || 4000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

app.use(cors());
app.use(express.json());

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dispatch", dispatchRoutes);
// NUEVO: Usar ruta de boletas
app.use("/api/invoices", invoiceRoutes); 

// Middlewares de error (si los tienes configurados)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Poké Fresh API escuchando en http://localhost:${PORT}`);
});