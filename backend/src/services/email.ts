import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = env.SMTP_HOST ? nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT ?? 587, secure: (env.SMTP_PORT ?? 587) === 465, auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined }) : null;

type OrderMail = { orderNumber: string; customer: string; email: string; phone?: string | null; items: { name: string; quantity: number; total: number }[]; subtotal: number; discount: number; shipping: number; tax: number; total: number; paymentMethod?: string; paymentStatus: string; address: Record<string, unknown>; createdAt?: Date | string };
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

async function send(to: string, subject: string, html: string) {
  if (!transporter) { console.info('[email:development]', { to, subject }); return; }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export function orderHtml(order: OrderMail) {
  const items = order.items.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${money(i.total)}</td></tr>`).join('');
  const address = Object.values(order.address).filter(Boolean).join(', ');
  const adminLink = process.env.ADMIN_APP_URL ? `${process.env.ADMIN_APP_URL}/orders/${order.orderNumber}` : undefined;
  return `<h1>Ellext order ${order.orderNumber}</h1><p>Order timestamp: ${new Date(order.createdAt ?? Date.now()).toISOString()}</p><p>Customer: ${order.customer} · ${order.email} · ${order.phone ?? ''}</p><table><tr><th>Product</th><th>Qty</th><th>Total</th></tr>${items}</table><p>Subtotal ${money(order.subtotal)} · Discount ${money(order.discount)} · Shipping ${money(order.shipping)} · Tax ${money(order.tax)} · <strong>Total ${money(order.total)}</strong></p><p>Payment method/status: ${order.paymentMethod ?? 'unspecified'} / ${order.paymentStatus}</p><p>Ship to: ${address}</p>${adminLink ? `<p><a href="${adminLink}">Open in admin</a></p>` : ''}`;
}

export async function sendOrderEmails(order: OrderMail) {
  const html = orderHtml(order);
  await Promise.allSettled([send(env.ADMIN_ORDER_EMAIL, `New Ellext order ${order.orderNumber}`, `${html}<p>Review this order in the admin console.</p>`), send(order.email, `Ellext order confirmation ${order.orderNumber}`, html)]);
}
export async function sendStatusEmail(email: string, orderNumber: string, status: string) { await send(email, `Ellext order ${orderNumber} update`, `<p>Your order <strong>${orderNumber}</strong> is now <strong>${status}</strong>.</p>`); }
export async function sendPasswordResetEmail(email: string, token: string) { await send(email, 'Reset your Ellext password', `<p>Use this password reset token within 30 minutes:</p><p><code>${token}</code></p>`); }
export async function sendOrderConfirmation(order: OrderMail) { return send(order.email, `Ellext order confirmation ${order.orderNumber}`, orderHtml(order)); }
export async function sendAdminNewOrderNotification(order: OrderMail) { return send(env.ADMIN_ORDER_EMAIL, `New Ellext order ${order.orderNumber}`, orderHtml(order)); }
export async function sendPaymentConfirmation(email: string, orderNumber: string) { return sendStatusEmail(email, orderNumber, 'payment confirmed'); }
export async function sendShippingNotification(email: string, orderNumber: string, status: string) { return sendStatusEmail(email, orderNumber, status); }
export async function sendDeliveryNotification(email: string, orderNumber: string) { return sendStatusEmail(email, orderNumber, 'delivered'); }
export async function sendCancellationNotification(email: string, orderNumber: string) { return sendStatusEmail(email, orderNumber, 'cancelled'); }
