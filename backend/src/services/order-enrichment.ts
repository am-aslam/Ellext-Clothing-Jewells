import { query } from '../db/supabase';

const stages = [
  ['PLACED', 'Order placed'],
  ['CONFIRMED', 'Confirmed'],
  ['PACKED', 'Packed'],
  ['SHIPPED', 'Shipped'],
  ['OUT_FOR_DELIVERY', 'Out for delivery'],
  ['DELIVERED', 'Delivered']
] as const;

/** Adds current catalogue imagery and truthful status history to order rows. */
export async function enrichOrders<T extends Record<string, any>>(orders: T[]): Promise<T[]> {
  if (!orders.length) return orders;
  const orderIds = orders.map(order => String(order.id)).filter(Boolean);
  const productIds = [...new Set(orders.flatMap(order => Array.isArray(order.items)
    ? order.items.map((item: any) => item.product_id ?? item.productId).filter(Boolean).map(String)
    : []))];

  const [auditResult, imageResult] = await Promise.all([
    orderIds.length
      ? query<any>("select entity_id, metadata, created_at from audit_logs where entity_type='Order' and action='ORDER_STATUS_CHANGED' and entity_id=any($1::uuid[]) order by created_at asc", [orderIds])
      : Promise.resolve({ rows: [] as any[] }),
    productIds.length
      ? query<any>('select distinct on (product_id) product_id, url from product_images where product_id=any($1::uuid[]) order by product_id, is_cover desc, sort_order asc, created_at asc', [productIds])
      : Promise.resolve({ rows: [] as any[] })
  ]);

  const images = new Map<string, string>(imageResult.rows.map((row: any) => [String(row.product_id), row.url]));
  const history = new Map<string, any[]>();
  for (const event of auditResult.rows) {
    const key = String(event.entity_id);
    history.set(key, [...(history.get(key) ?? []), event]);
  }

  return orders.map(order => {
    const itemRows = Array.isArray(order.items) ? order.items : [];
    const items = itemRows.map((item: any) => {
      const productId = String(item.product_id ?? item.productId ?? '');
      const imageUrl = images.get(productId) ?? null;
      return {
        ...item,
        image_url: imageUrl,
        product: {
          id: productId,
          name: item.product_name ?? item.productName ?? 'Product',
          sku: item.sku,
          slug: item.product_slug ?? '',
          price: item.price,
          images: imageUrl ? [imageUrl] : [],
          coverImage: imageUrl ?? undefined
        }
      };
    });

    const events = history.get(String(order.id)) ?? [];
    const eventByStage = new Map<string, any>();
    for (const event of events) {
      const metadata = typeof event.metadata === 'string' ? JSON.parse(event.metadata || '{}') : (event.metadata ?? {});
      const stage = String(metadata.to ?? '').toUpperCase();
      if (stage) eventByStage.set(stage, { ...event, metadata });
    }
    const current = String(order.status ?? 'PLACED').toUpperCase();
    const timeline = current === 'CANCELLED'
      ? [
          { stage: 'placed', label: 'Order placed', timestamp: order.created_at, note: 'Your order has been received.', completed: true },
          { stage: 'cancelled', label: 'Cancelled', timestamp: eventByStage.get('CANCELLED')?.created_at, note: eventByStage.get('CANCELLED')?.metadata?.note || 'This order was cancelled.', completed: true, current: true }
        ]
      : stages.map(([stage, label], index) => {
          const position = stages.findIndex(([key]) => key === current);
          const done = index <= Math.max(0, position);
          const event = eventByStage.get(stage);
          return {
            stage: stage.toLowerCase(),
            label,
            timestamp: stage === 'PLACED' ? order.created_at : event?.created_at,
            note: event?.metadata?.note || (done
              ? (index === 0 ? 'Your order has been received.' : `${label} update.`)
              : 'We’ll update you when your order reaches this step.'),
            completed: done,
            current: stage === current
          };
        });

    return { ...order, items, timeline };
  });
}
