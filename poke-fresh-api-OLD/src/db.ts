import { Product, User, CartItem, Order } from "./models";
import { OrderStatus } from "./enums";
import { randomUUID } from "crypto";

export const productos: Product[] = [
  {
    id: randomUUID(),
    nombre: "Bowl Clásico",
    descripcion: "Arroz sushi, salmón, palta, pepino y sésamo.",
    precio: 6990,
    stock: 20,
    categorias: ["bowls", "proteico"],
    imgUrl: "https://via.placeholder.com/600x400?text=Bowl+Clasico"
  },
  {
    id: randomUUID(),
    nombre: "Bowl Vegano",
    descripcion: "Quinoa, tofu, kale y palta.",
    precio: 6490,
    stock: 15,
    categorias: ["bowls", "vegano"],
    imgUrl: "https://via.placeholder.com/600x400?text=Bowl+Vegano"
  }
];

export const usuarios: User[] = [];
// carrito por usuario: userId -> items
export const carritos: Record<string, CartItem[]> = {};
export const pedidos: Order[] = [];

export function calcularTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.precio * item.qty, 0);
}

export function crearPedido(userId: string, metodoPago: string): Order | null {
  const items = carritos[userId] ?? [];
  if (!items.length) return null;

  const pedido: Order = {
    id: randomUUID(),
    userId,
    items: [...items],
    total: calcularTotal(items),
    metodoPago,
    estado: OrderStatus.PENDING,
    fecha: new Date().toISOString()
  };

  pedidos.push(pedido);
  carritos[userId] = []; // vaciar carrito
  return pedido;
}
