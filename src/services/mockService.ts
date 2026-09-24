import {
  Product,
  Offer,
  Order,
  OrderStage,
  Address,
  AdminMetrics,
  CartItem
} from '@/types';
import { INITIAL_PRODUCTS } from '@/mock-data/products';
import { INITIAL_OFFERS } from '@/mock-data/offers';
import { INITIAL_ORDERS } from '@/mock-data/orders';
import { INITIAL_ADDRESSES } from '@/mock-data/addresses';

// Local storage keys for state persistence during mock development
const STORAGE_KEYS = {
  PRODUCTS: 'ellext_products_v1',
  OFFERS: 'ellext_offers_v1',
  ORDERS: 'ellext_orders_v1',
  ADDRESSES: 'ellext_addresses_v1',
  WISHLIST: 'ellext_wishlist_v1',
  CART: 'ellext_cart_v1'
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist to localStorage [${key}]`, err);
  }
}

class MockService {
  private products: Product[] = [];
  private offers: Offer[] = [];
  private orders: Order[] = [];
  private addresses: Address[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const storedProducts = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.products = Array.isArray(storedProducts) && storedProducts.length > 0 ? storedProducts : INITIAL_PRODUCTS;
    const storedOffers = getStored<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    this.offers = Array.isArray(storedOffers) && storedOffers.length > 0 ? storedOffers : INITIAL_OFFERS;
    this.orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    this.addresses = getStored<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  }

  // --- Products ---
  async getProducts(filter?: {
    category?: string;
    collection?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    newArrival?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    this.init();
    let result = [...this.products];

    if (filter?.status) {
      result = result.filter(p => p.status.toLowerCase() === filter.status?.toLowerCase());
    } else {
      // By default storefront shows active
      result = result.filter(p => p.status.toLowerCase() === 'active');
    }

    if (filter?.category && filter.category !== 'all') {
      const cat = filter.category.toLowerCase().trim();
      result = result.filter(p => p.category.toLowerCase() === cat);
    }

    if (filter?.collection && filter.collection !== 'all') {
      const targetCol = filter.collection.toLowerCase().trim();
      const targetSlug = targetCol.replace(/[^a-z0-9]+/g, '-');
      result = result.filter(p => {
        const pCol = p.collection.toLowerCase().trim();
        const pColSlug = pCol.replace(/[^a-z0-9]+/g, '-');
        return pCol === targetCol || pColSlug === targetSlug;
      });
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (filter?.featured) {
      result = result.filter(p => p.featured);
    }

    if (filter?.newArrival) {
      result = result.filter(p => p.newArrival);
    }

    if (filter?.sort) {
      switch (filter.sort) {
        case 'price-asc':
          result.sort((a, b) => a.sellingPrice - b.sellingPrice);
          break;
        case 'price-desc':
          result.sort((a, b) => b.sellingPrice - a.sellingPrice);
          break;
        case 'popular':
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  async getAllProductsForAdmin(): Promise<Product[]> {
    this.init();
    return [...this.products];
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    this.init();
    return this.products.find(p => p.slug === slug || p.id === slug) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> {
    this.init();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    this.init();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updated = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.products[index] = updated;
    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    this.init();
    this.products = this.products.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    return true;
  }

  async updateInventory(sku: string, stock: number): Promise<boolean> {
    this.init();
    let found = false;
    this.products = this.products.map(prod => {
      if (prod.sku === sku) {
        found = true;
        return { ...prod, stock, updatedAt: new Date().toISOString() };
      }
      if (prod.variants) {
        const vIndex = prod.variants.findIndex(v => v.sku === sku);
        if (vIndex !== -1) {
          found = true;
          const updatedVariants = [...prod.variants];
          updatedVariants[vIndex] = { ...updatedVariants[vIndex], stock };
          const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
          return { ...prod, variants: updatedVariants, stock: totalStock, updatedAt: new Date().toISOString() };
        }
      }
      return prod;
    });

    if (found) {
      setStored(STORAGE_KEYS.PRODUCTS, this.products);
      return true;
    }
    return false;
  }

  // --- Offers ---
  async getOffers(activeOnly = true): Promise<Offer[]> {
    this.init();
    if (activeOnly) {
      return this.offers.filter(o => o.isActive);
    }
    return [...this.offers];
  }

  async validateCoupon(code: string, subtotal: number, category?: string): Promise<{
    valid: boolean;
    discountAmount: number;
    offer?: Offer;
    message: string;
  }> {
    this.init();
    const cleanCode = code.trim().toUpperCase();
    const offer = this.offers.find(o => o.code === cleanCode);

    if (!offer) {
      return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
    }

    if (!offer.isActive) {
      return { valid: false, discountAmount: 0, message: 'This privilege code is no longer active.' };
    }

    const now = new Date();
    if (new Date(offer.endDate) < now) {
      return { valid: false, discountAmount: 0, message: 'This privilege code has expired.' };
    }

    if (offer.minOrderValue && subtotal < offer.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Applicable on orders above ₹${offer.minOrderValue.toLocaleString('en-IN')}.`
      };
    }

    if (offer.applicableTo !== 'all' && category && offer.applicableTo !== category) {
      return {
        valid: false,
        discountAmount: 0,
        message: `This coupon is exclusively applicable to ${offer.applicableTo}.`
      };
    }

    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = Math.round((subtotal * offer.discountValue) / 100);
    } else {
      discount = Math.min(offer.discountValue, subtotal);
    }

    return {
      valid: true,
      discountAmount: discount,
      offer,
      message: `Privilege applied: ${offer.title}`
    };
  }

  async createOffer(offerData: Omit<Offer, 'id' | 'usedCount'>): Promise<Offer> {
    this.init();
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now()}`,
      usedCount: 0
    };
    this.offers.unshift(newOffer);
    setStored(STORAGE_KEYS.OFFERS, this.offers);
    return newOffer;
  }

  async toggleOfferStatus(id: string, isActive: boolean): Promise<boolean> {
    this.init();
    this.offers = this.offers.map(o => (o.id === id ? { ...o, isActive } : o));
    setStored(STORAGE_KEYS.OFFERS, this.offers);
    return true;
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    this.init();
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<Order | null> {
    this.init();
    return this.orders.find(o => o.id === id || o.orderNumber === id) || null;
  }

  async createOrder(payload: {
    customer: { name: string; email: string; phone: string };
    shippingAddress: Address;
    items: CartItem[];
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    appliedCoupon?: string;
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
  }): Promise<Order> {
    this.init();
    const orderNum = `ELX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      subtotal: payload.subtotal,
      discount: payload.discount,
      shippingFee: payload.shippingFee,
      total: payload.total,
      appliedCoupon: payload.appliedCoupon,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      expectedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeline: [
        {
          stage: 'placed',
          label: 'Order Placed',
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: `Order received successfully with ${payload.paymentMethod.toUpperCase()} payment verification.`,
          completed: true,
          current: true
        },
        {
          stage: 'confirmed',
          label: 'Atelier Confirmation',
          note: 'Craftsmanship & hallmark verification.',
          completed: false
        },
        {
          stage: 'packed',
          label: 'Curated & Sealed',
          note: 'Sealed inside signature velvet presentation box.',
          completed: false
        },
        {
          stage: 'shipped',
          label: 'Dispatched via Armoured Courier',
          note: 'Airway bill generation and transit.',
          completed: false
        },
        {
          stage: 'out_for_delivery',
          label: 'Out for Delivery',
          note: 'Specialized delivery associate with secure verification.',
          completed: false
        },
        {
          stage: 'delivered',
          label: 'Delivered',
          note: 'Signature handover completed.',
          completed: false
        }
      ]
    };

    this.orders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, this.orders);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, stage: OrderStage, note?: string): Promise<Order> {
    this.init();
    const orderIndex = this.orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = this.orders[orderIndex];
    const stages: OrderStage[] = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const targetIdx = stages.indexOf(stage);

    const updatedTimeline = order.timeline.map((step) => {
      const stepIdx = stages.indexOf(step.stage);
      if (stepIdx < targetIdx) {
        return { ...step, completed: true, current: false };
      } else if (stepIdx === targetIdx) {
        return {
          ...step,
          completed: true,
          current: true,
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: note || step.note
        };
      } else {
        return { ...step, completed: false, current: false };
      }
    });

    const updatedOrder: Order = {
      ...order,
      orderStatus: stage,
      timeline: updatedTimeline
    };

    this.orders[orderIndex] = updatedOrder;
    setStored(STORAGE_KEYS.ORDERS, this.orders);
    return updatedOrder;
  }

  // --- Addresses ---
  async getAddresses(): Promise<Address[]> {
    this.init();
    return [...this.addresses];
  }

  async saveAddress(address: Address): Promise<Address> {
    this.init();
    if (address.id) {
      this.addresses = this.addresses.map(a => (a.id === address.id ? address : a));
    } else {
      const newAddr = { ...address, id: `addr-${Date.now()}` };
      this.addresses.push(newAddr);
    }
    setStored(STORAGE_KEYS.ADDRESSES, this.addresses);
    return address;
  }

  async deleteAddress(id: string): Promise<boolean> {
    this.init();
    this.addresses = this.addresses.filter(a => a.id !== id);
    setStored(STORAGE_KEYS.ADDRESSES, this.addresses);
    return true;
  }

  // --- Admin Coupons ---
  async getAdminCoupons() {
    this.init();
    const stored = getStored<any[]>('ellext_coupons_crm_v1', []);
    if (stored.length > 0) return stored;

    const initialCoupons = [
      {
        id: 'coup-01',
        code: 'ROYAL15',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minimumOrder: 50000,
        maximumDiscount: 15000,
        startAt: '2026-09-01T00:00:00Z',
        endAt: '2026-10-31T23:59:59Z',
        usageLimit: 200,
        usedCount: 42,
        perUserLimit: 1,
        active: true
      },
      {
        id: 'coup-02',
        code: 'ELLEXT10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minimumOrder: 25000,
        maximumDiscount: 8000,
        startAt: '2026-09-01T00:00:00Z',
        endAt: '2026-11-30T23:59:59Z',
        usageLimit: 500,
        usedCount: 118,
        perUserLimit: 2,
        active: true
      },
      {
        id: 'coup-03',
        code: 'WELCOME5K',
        discountType: 'FIXED',
        discountValue: 5000,
        minimumOrder: 40000,
        maximumDiscount: 5000,
        startAt: '2026-08-01T00:00:00Z',
        endAt: '2026-12-31T23:59:59Z',
        usageLimit: 100,
        usedCount: 65,
        perUserLimit: 1,
        active: true
      },
      {
        id: 'coup-04',
        code: 'FESTIVE20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minimumOrder: 75000,
        maximumDiscount: 25000,
        startAt: '2026-09-15T00:00:00Z',
        endAt: '2026-10-15T23:59:59Z',
        usageLimit: 50,
        usedCount: 12,
        perUserLimit: 1,
        active: true
      }
    ];
    setStored('ellext_coupons_crm_v1', initialCoupons);
    return initialCoupons;
  }

  async createAdminCoupon(payload: any) {
    const coupons = await this.getAdminCoupons();
    const newCoupon = {
      id: `coup-${Date.now()}`,
      code: payload.code.toUpperCase().trim(),
      discountType: payload.discountType,
      discountValue: Number(payload.discountValue),
      minimumOrder: Number(payload.minimumOrder || 0),
      maximumDiscount: payload.maximumDiscount ? Number(payload.maximumDiscount) : null,
      startAt: payload.startAt,
      endAt: payload.endAt,
      usageLimit: payload.usageLimit ? Number(payload.usageLimit) : null,
      usedCount: 0,
      perUserLimit: payload.perUserLimit ? Number(payload.perUserLimit) : 1,
      active: payload.active !== false,
      createdAt: new Date().toISOString()
    };
    coupons.unshift(newCoupon);
    setStored('ellext_coupons_crm_v1', coupons);
    return newCoupon;
  }

  async updateAdminCoupon(id: string, payload: any) {
    const coupons = await this.getAdminCoupons();
    const idx = coupons.findIndex((c: any) => c.id === id);
    if (idx === -1) throw new Error('Coupon not found');
    coupons[idx] = { ...coupons[idx], ...payload };
    setStored('ellext_coupons_crm_v1', coupons);
    return coupons[idx];
  }

  async deleteAdminCoupon(id: string) {
    const coupons = await this.getAdminCoupons();
    // Soft delete/deactivate to preserve historical integrity
    const updated = coupons.map((c: any) => c.id === id ? { ...c, active: false } : c);
    setStored('ellext_coupons_crm_v1', updated);
    return true;
  }

  // --- Admin Customer CRM ---
  async getAdminCustomers(params?: { search?: string; status?: string; sort?: string }) {
    this.init();
    const customersMap = new Map<string, any>();

    // Seed from orders
    this.orders.forEach(o => {
      const email = o.customer.email.toLowerCase();
      if (!customersMap.has(email)) {
        customersMap.set(email, {
          id: `cust-${email.replace(/[^a-z0-9]/g, '')}`,
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone || '+91 98201 00000',
          status: 'ACTIVE',
          createdAt: o.createdAt,
          orders: []
        });
      }
      customersMap.get(email).orders.push(o);
    });

    let customers = Array.from(customersMap.values()).map(c => {
      const totalOrders = c.orders.length;
      const completedOrders = c.orders.filter((o: any) => o.orderStatus === 'delivered').length;
      const cancelledOrders = c.orders.filter((o: any) => o.orderStatus === 'cancelled').length;
      const returnedOrders = 0;
      const pendingOrders = c.orders.filter((o: any) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
      const totalSpent = c.orders
        .filter((o: any) => o.paymentStatus === 'paid')
        .reduce((sum: number, o: any) => sum + o.total, 0);
      const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
      const lastOrder = c.orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        createdAt: c.createdAt,
        totalOrders,
        completedOrders,
        cancelledOrders,
        returnedOrders,
        pendingOrders,
        totalSpent,
        averageOrderValue,
        lastOrder: lastOrder ? {
          id: lastOrder.id,
          orderNumber: lastOrder.orderNumber,
          createdAt: lastOrder.createdAt,
          total: lastOrder.total,
          status: lastOrder.orderStatus
        } : null,
        wishlistCount: 2
      };
    });

    if (params?.search) {
      const q = params.search.toLowerCase();
      customers = customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (params?.status && params.status !== 'ALL') {
      customers = customers.filter(c => c.status === params.status);
    }
    if (params?.sort === 'spent-desc') {
      customers.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (params?.sort === 'orders-desc') {
      customers.sort((a, b) => b.totalOrders - a.totalOrders);
    }

    return customers;
  }

  async getAdminCustomerById(id: string) {
    const customers = await this.getAdminCustomers();
    const customer = customers.find(c => c.id === id || c.email === id);
    if (!customer) return null;

    const customerOrders = this.orders.filter(o => o.customer.email.toLowerCase() === customer.email.toLowerCase());

    return {
      profile: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        createdAt: customer.createdAt,
        emailVerifiedAt: customer.createdAt
      },
      analytics: {
        totalOrders: customer.totalOrders,
        completedOrders: customer.completedOrders,
        cancelledOrders: customer.cancelledOrders,
        returnedOrders: customer.returnedOrders,
        pendingOrders: customer.pendingOrders,
        totalSpent: customer.totalSpent,
        averageOrderValue: customer.averageOrderValue
      },
      addresses: this.addresses,
      wishlistCount: 3,
      orders: customerOrders
    };
  }

  // --- Admin Metrics ---
  async getAdminMetrics(): Promise<AdminMetrics> {
    this.init();
    const today = new Date().toDateString();
    const todayOrders = this.orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0) || 157400;

    const pendingOrdersCount = this.orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length;
    const lowStockCount = this.products.filter(p => p.stock <= p.lowStockThreshold).length;
    const activeProductsCount = this.products.filter(p => p.status === 'active').length;
    const customers = await this.getAdminCustomers();

    return {
      todaySales,
      salesGrowth: 14.8,
      ordersCount: this.orders.length,
      pendingOrdersCount,
      lowStockCount,
      activeProductsCount,
      customersCount: customers.length,
      recentOrders: this.orders.slice(0, 5),
      recentCustomers: customers.slice(0, 5)
    };
  }
}

export const mockService = new MockService();
