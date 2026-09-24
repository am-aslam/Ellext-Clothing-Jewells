import { Offer } from '@/types';

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-01',
    code: 'ELLEXT10',
    title: 'Ellext Welcome Privilege',
    description: 'Enjoy 10% complimentary privilege on your first acquisition across all clothing and jewels.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 15000,
    applicableTo: 'all',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    usageLimit: 500,
    usedCount: 142,
    isActive: true
  },
  {
    id: 'off-02',
    code: 'ROYAL20',
    title: 'Heritage Haute Jewels Edit',
    description: '20% off on all fine jewellery and bridal sets on purchases above ₹40,000.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 40000,
    applicableTo: 'jewells',
    startDate: '2026-09-10T00:00:00Z',
    endDate: '2026-10-31T23:59:59Z',
    usageLimit: 100,
    usedCount: 29,
    isActive: true
  },
  {
    id: 'off-03',
    code: 'ATELIER5000',
    title: 'Atelier Tailoring Credit',
    description: 'Flat ₹5,000 privilege credit applied to structured blazers and silk evening gowns.',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderValue: 35000,
    applicableTo: 'clothing',
    startDate: '2026-09-15T00:00:00Z',
    endDate: '2026-11-15T23:59:59Z',
    usageLimit: 200,
    usedCount: 47,
    isActive: true
  },
  {
    id: 'off-04',
    code: 'SUMMERFEST',
    title: 'Summer Solstice Clearance',
    description: '15% savings on all resort wear and lightweight gold cuffs.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 20000,
    applicableTo: 'all',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    usageLimit: 300,
    usedCount: 284,
    isActive: false
  }
];
