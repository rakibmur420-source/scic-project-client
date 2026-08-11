export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "USER" | "ADMIN";
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
  categoryId: string;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
  user?: { id: string; name: string };
  createdAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  address?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
