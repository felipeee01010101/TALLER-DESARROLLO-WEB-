import express from "express";
import cors from "cors";

import catalogRoutes from "./routes/catalog";
import userRoutes from "./routes/users";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/error";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas base
app.use("/api/catalog", catalogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Middlewares finales
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Poké Fresh API escuchando en http://localhost:${PORT}`);
});
