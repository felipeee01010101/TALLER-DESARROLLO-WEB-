import { OrderStatus } from "./enums";

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categorias: string[];
  imgUrl?: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  fechaRegistro: string;
  estaVerificado: boolean;
}

export interface CartItem {
  productId: string;
  nombre: string;
  precio: number;
  qty: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  metodoPago: string;
  estado: OrderStatus;
  fecha: string;
}
