import type { Product } from "@/types/product";

export interface CartLine {
  product: Product;
  quantity: number;
  variantId: string | null;
  variantKey: string;
  variantLabel: string | null;
}

export interface AddressInput {
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  country_code: string;
  is_default: boolean;
}
