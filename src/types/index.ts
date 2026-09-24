export type ProductCategory = 'clothing' | 'jewells';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ClothingAttributes {
  sizes: string[]; // e.g. ['XS', 'S', 'M', 'L', 'XL']
  colours: string[];
  fabric: string;
  fit: string;
}

export interface JewelleryAttributes {
  materials: string[];
  finishes: string[];
  dimensions: string;
  weight: string;
  care: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string; // e.g. "Size S / Noir" or "Gold / 18K"
  stock: number;
  price?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  shortDescription: string;
  description: string;
  sellingPrice: number;
  originalPrice: number;
  discountPercent: number;
  isSale: boolean;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  freeShipping?: boolean;
  images: string[];
  coverImage?: string;
  status: ProductStatus;
  clothingAttributes?: ClothingAttributes;
  jewelleryAttributes?: JewelleryAttributes;
  variants?: ProductVariant[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  featured?: boolean;
  newArrival?: boolean;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant?: string;
  selectedSize?: string;
  selectedColour?: string;
  selectedMaterial?: string;
  quantity: number;
  unitPrice: number;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  applicableTo: 'all' | 'clothing' | 'jewells';
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export type OrderStage = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTimelineStep {
  stage: OrderStage;
  label: string;
  timestamp?: string;
  note: string;
  completed: boolean;
  current?: boolean;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  houseBuilding: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  country: string;
  isDefault?: boolean;
  label?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: OrderStage;
  timeline: OrderTimelineStep[];
  expectedDelivery: string;
}

export interface AdminMetrics {
  todaySales: number;
  salesGrowth: number;
  ordersCount: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  activeProductsCount: number;
  customersCount?: number;
  recentOrders?: any[];
  recentCustomers?: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt?: string;
}

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  pendingOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrder: {
    id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    status: string;
  } | null;
  wishlistCount: number;
}

export interface CustomerDetail {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
    emailVerifiedAt?: string | null;
  };
  analytics: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    pendingOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
  addresses: Address[];
  wishlistCount: number;
  orders: any[];
}

export interface CouponItem {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number | null;
  startAt: string;
  endAt: string;
  usageLimit?: number | null;
  usedCount: number;
  perUserLimit?: number | null;
  active: boolean;
  categories?: { categoryId: string }[];
  products?: { productId: string }[];
  createdAt?: string;
  updatedAt?: string;
}
