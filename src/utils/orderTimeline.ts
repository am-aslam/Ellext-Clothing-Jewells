import { OrderStage, OrderTimelineStep } from '@/types';

const milestones: Array<Pick<OrderTimelineStep, 'stage' | 'label' | 'note'>> = [
  { stage: 'placed', label: 'Order placed', note: 'Your order has been received.' },
  { stage: 'confirmed', label: 'Confirmed', note: 'The atelier has confirmed your order.' },
  { stage: 'packed', label: 'Packed', note: 'Your order is being carefully prepared for dispatch.' },
  { stage: 'shipped', label: 'Shipped', note: 'Your parcel has been handed to the delivery partner.' },
  { stage: 'out_for_delivery', label: 'Out for delivery', note: 'Your delivery partner is on the way.' },
  { stage: 'delivered', label: 'Delivered', note: 'Your order has been delivered.' }
];

export function buildOrderTimeline(status: OrderStage, createdAt?: string): OrderTimelineStep[] {
  if (status === 'cancelled') {
    return [
      { ...milestones[0], timestamp: createdAt, completed: true },
      { stage: 'cancelled', label: 'Cancelled', note: 'This order was cancelled.', completed: true, current: true }
    ];
  }

  const currentIndex = Math.max(0, milestones.findIndex(step => step.stage === status));
  return milestones.map((step, index) => ({
    ...step,
    note: index <= currentIndex ? step.note : 'We’ll update you when your order reaches this step.',
    timestamp: index === 0 ? createdAt : undefined,
    completed: index <= currentIndex,
    current: index === currentIndex
  }));
}
