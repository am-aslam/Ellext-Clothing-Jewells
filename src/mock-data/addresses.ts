import { Address } from '@/types';

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
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
  {
    id: 'addr-2',
    label: 'New Delhi Atelier',
    fullName: 'Ananya Singhania',
    phone: '+91 98201 44521',
    email: 'ananya.singhania@heritage.in',
    houseBuilding: 'Bungalow 42, Amrita Shergill Marg',
    street: 'Lutyens Bungalow Zone',
    area: 'Lodhi Estate',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110003',
    landmark: 'Near Lodhi Gardens',
    country: 'India',
    isDefault: false
  }
];
