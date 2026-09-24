import webPush from 'web-push';
import { query } from '../db/supabase';
import { env } from '../config/env';

const pushConfigured = Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT);

if (pushConfigured) {
  webPush.setVapidDetails(env.VAPID_SUBJECT!, env.VAPID_PUBLIC_KEY!, env.VAPID_PRIVATE_KEY!);
}

export function getAdminPushConfiguration() {
  return {
    enabled: pushConfigured,
    publicKey: pushConfigured ? env.VAPID_PUBLIC_KEY : null
  };
}

type OrderPushDetails = {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  paymentMethod: string;
};

export async function notifyAdminsOfNewOrder(order: OrderPushDetails) {
  if (!pushConfigured) return;

  const result = await query<{
    id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
  }>(
    `select s.id, s.endpoint, s.p256dh, s.auth
       from public.admin_push_subscriptions s
       join public.admin_users a on a.id = s.admin_user_id
      where a.status = 'ACTIVE'`
  );

  if (!result.rowCount) return;

  const itemSummary = order.items
    .slice(0, 3)
    .map(item => `${item.name} ×${item.quantity}`)
    .join(', ');
  const extraItemCount = Math.max(0, order.items.length - 3);
  const details = [
    order.customerName,
    itemSummary ? `${itemSummary}${extraItemCount ? ` +${extraItemCount} more` : ''}` : `${order.items.length} item(s)`,
    `₹${Number(order.total).toLocaleString('en-IN')}`,
    order.paymentMethod.replaceAll('_', ' ')
  ].filter(Boolean).join(' · ');
  const payload = JSON.stringify({
    title: `New order ${order.orderNumber}`,
    body: details.slice(0, 220),
    url: `/admin/orders/${encodeURIComponent(order.id)}`,
    tag: `ellext-order-${order.id}`,
    icon: '/assets/brand/ellext-app-icon.svg',
    badge: '/assets/brand/ellext-app-icon.svg'
  });

  await Promise.all(result.rows.map(async subscription => {
    try {
      await webPush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth }
      }, payload, { TTL: 60 * 60 });
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await query('delete from public.admin_push_subscriptions where id = $1', [subscription.id]);
      } else {
        console.warn('Admin push delivery failed for one registered device.', { statusCode });
      }
    }
  }));
}
