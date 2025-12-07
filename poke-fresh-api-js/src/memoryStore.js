const { randomUUID } = require("crypto");

// Productos del catálogo
const productos = [
  {
    id: randomUUID(),
    nombre: "Bowl Proteico",
    descripcion: "Arroz sushi, pollo teriyaki, brócoli, sésamo.",
    precio: 6990,
    stock: 15,
    categorias: ["bowls", "proteico"],
    imgUrl: "https://via.placeholder.com/600x400?text=Bowl+Proteico"
  },
  {
    id: randomUUID(),
    nombre: "Bowl Vegano",
    descripcion: "Quinoa, tofu marinado, palta y mix de verduras.",
    precio: 6490,
    stock: 10,
    categorias: ["bowls", "vegano"],
    imgUrl: "https://via.placeholder.com/600x400?text=Bowl+Vegano"
  }
];

const usuarios = [];
const carritos = {};
const pedidos = [];
const anulaciones = [];
const boletas = [];

function calcularTotal(items) {
  return items.reduce((s, i) => s + i.precio * i.qty, 0);
}

module.exports = {
  productos,
  usuarios,
  carritos,
  pedidos,
  anulaciones,
  boletas,
  calcularTotal
};
