import { Order } from '@/types';
import { INITIAL_PRODUCTS } from './products';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ELX-2026-8941',
    createdAt: '2026-09-17T14:30:00Z',
    customer: {
      name: 'Princess Ananya Singhania',
      email: 'ananya.singhania@heritage.in',
      phone: '+91 98201 44521'
    },
    shippingAddress: {
      fullName: 'Ananya Singhania',
      phone: '+91 98201 44521',
      email: 'ananya.singhania@heritage.in',
      houseBuilding: 'Penthouse 14A, Regency Towers',
      street: 'Altamount Road',
      area: 'Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400026',
      landmark: 'Opposite Ambani Residence',
      country: 'India',
      isDefault: true
    },
    items: [
      {
        id: 'ci-01',
        productId: 'prod-j01',
        product: INITIAL_PRODUCTS[0],
        selectedVariant: 'Zambian Emerald & Pearl',
        quantity: 1,
        unitPrice: 42500
      },
      {
        id: 'ci-02',
        productId: 'prod-c01',
        product: INITIAL_PRODUCTS[10],
        selectedSize: 'M',
        selectedColour: 'Noir Black',
        quantity: 1,
        unitPrice: 38500
      }
    ],
    subtotal: 81000,
    discount: 8100,
    shippingFee: 0,
    total: 72900,
    appliedCoupon: 'ELLEXT10',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    expectedDelivery: '2026-09-21',
    timeline: [
      {
        stage: 'placed',
        label: 'Order Placed',
        timestamp: '17 Sep 2026, 02:30 PM',
        note: 'Order confirmed and payment verified via Secure Gateway.',
        completed: true
      },
      {
        stage: 'confirmed',
        label: 'Confirmed by Atelier',
        timestamp: '17 Sep 2026, 03:45 PM',
        note: 'Craftsmanship authentication and hallmark inspection verified.',
        completed: true
      },
      {
        stage: 'packed',
        label: 'Curated & Sealed',
        timestamp: '18 Sep 2026, 11:15 AM',
        note: 'Sealed inside tamper-evident luxury Ellext velvet coffret.',
        completed: true
      },
      {
        stage: 'shipped',
        label: 'Dispatched via Armoured Courier',
        timestamp: '18 Sep 2026, 02:00 PM',
        note: 'Airway Bill #BVC-994102. In transit with specialized security escort.',
        completed: true,
        current: true
      },
      {
        stage: 'out_for_delivery',
        label: 'Out for Delivery',
        timestamp: 'Expected 21 Sep 2026',
        note: 'Courier agent will arrive with OTP verification.',
        completed: false
      },
      {
        stage: 'delivered',
        label: 'Delivered',
        timestamp: 'Expected 21 Sep 2026',
        note: 'Handover complete.',
        completed: false
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'ELX-2026-8942',
    createdAt: '2026-09-18T09:15:00Z',
    customer: {
      name: 'Vikramaditya Roy',
      email: 'vikram.roy@palacecapital.com',
      phone: '+91 99100 88214'
    },
    shippingAddress: {
      fullName: 'Vikramaditya Roy',
      phone: '+91 99100 88214',
      email: 'vikram.roy@palacecapital.com',
      houseBuilding: 'Villa 7, The Magnolias',
      street: 'Golf Course Road',
      area: 'DLF Phase 5',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122002',
      landmark: 'Near DLF Golf Club',
      country: 'India',
      isDefault: true
    },
    items: [
      {
        id: 'ci-03',
        productId: 'prod-j08',
        product: INITIAL_PRODUCTS[7],
        selectedVariant: 'White Rhodium 38cm',
        quantity: 1,
        unitPrice: 34500
      }
    ],
    subtotal: 34500,
    discount: 0,
    shippingFee: 0,
    total: 34500,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    expectedDelivery: '2026-09-22',
    timeline: [
      {
        stage: 'placed',
        label: 'Order Placed',
        timestamp: '18 Sep 2026, 09:15 AM',
        note: 'Order placed via UPI QR.',
        completed: true
      },
      {
        stage: 'confirmed',
        label: 'Confirmed by Atelier',
        timestamp: '18 Sep 2026, 10:00 AM',
        note: 'Gemological certification card issued.',
        completed: true,
        current: true
      },
      {
        stage: 'packed',
        label: 'Curated & Sealed',
        note: 'Awaiting specialized velvet packaging.',
        completed: false
      },
      {
        stage: 'shipped',
        label: 'Dispatched',
        note: 'Awaiting courier pickup.',
        completed: false
      },
      {
        stage: 'out_for_delivery',
        label: 'Out for Delivery',
        note: 'Delivery agent assigned.',
        completed: false
      },
      {
        stage: 'delivered',
        label: 'Delivered',
        note: 'Delivery complete.',
        completed: false
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'ELX-2026-8943',
    createdAt: '2026-09-18T13:40:00Z',
    customer: {
      name: 'Gayatri Devi',
      email: 'gayatri.devi@heritagejaipur.com',
      phone: '+91 97841 22910'
    },
    shippingAddress: {
      fullName: 'Gayatri Devi',
      phone: '+91 97841 22910',
      email: 'gayatri.devi@heritagejaipur.com',
      houseBuilding: 'Kothi 12, Civil Lines',
      street: 'Jacob Road',
      area: 'Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pinCode: '302006',
      landmark: 'Near Raj Bhavan',
      country: 'India',
      isDefault: true
    },
    items: [
      {
        id: 'ci-04',
        productId: 'prod-c03',
        product: INITIAL_PRODUCTS[12],
        selectedColour: 'Muted Gold',
        quantity: 1,
        unitPrice: 48000
      }
    ],
    subtotal: 48000,
    discount: 5000,
    shippingFee: 0,
    total: 43000,
    appliedCoupon: 'ATELIER5000',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'placed',
    expectedDelivery: '2026-09-23',
    timeline: [
      {
        stage: 'placed',
        label: 'Order Placed',
        timestamp: '18 Sep 2026, 01:40 PM',
        note: 'Order submitted and under atelier allocation.',
        completed: true,
        current: true
      },
      {
        stage: 'confirmed',
        label: 'Confirmed',
        note: 'Artisan quality verification pending.',
        completed: false
      },
      {
        stage: 'packed',
        label: 'Packed',
        note: 'Packaging pending.',
        completed: false
      },
      {
        stage: 'shipped',
        label: 'Shipped',
        note: 'Courier handover pending.',
        completed: false
      },
      {
        stage: 'out_for_delivery',
        label: 'Out for Delivery',
        note: 'Out for delivery.',
        completed: false
      },
      {
        stage: 'delivered',
        label: 'Delivered',
        note: 'Delivered.',
        completed: false
      }
    ]
  }
];
