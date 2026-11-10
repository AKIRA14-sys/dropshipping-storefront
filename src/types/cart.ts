import type { Product } from "@/types/product";

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note?: string;
}

export interface LocalOrder {
  trackingCode: string;
  createdAt: string;
  email: string;
  customerName: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  demo: true;
}
