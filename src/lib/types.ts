export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number; // cents
  image: string;
  category: string;
  style: string;
  movement: string;
  caseMaterial: string;
  caseSize: string;
  waterRes: string;
  strap: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number; // cents
  quantity: number;
  stock: number;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

export const FREE_SHIPPING_THRESHOLD = 50000; // $500 in cents
export const SHIPPING_FLAT = 2900; // $29 in cents

export const CATEGORIES = ["men", "women", "unisex"] as const;
export const STYLES = [
  "dress",
  "sport",
  "dive",
  "pilot",
  "skeleton",
  "minimal",
  "smart",
] as const;
export const MOVEMENTS = ["automatic", "manual", "quartz", "digital"] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
] as const;
