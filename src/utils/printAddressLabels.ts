import { Order } from '@/types';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => htmlEntities[character]);

function addressMarkup(order: Order) {
  const address = order.shippingAddress;
  const lines = [
    address.houseBuilding,
    address.street,
    address.area,
    address.landmark ? `Landmark: ${address.landmark}` : '',
    [address.city, address.pinCode].filter(Boolean).join(' — '),
    [address.state, address.country].filter(Boolean).join(', ')
  ].filter(Boolean);

  return `<article class="label">
    <img class="logo" src="${window.location.origin}/assets/brand/ellext-logo-dark.png" alt="Ellext Clothing & Jewells">
    <div class="gold-rule"></div>
    <div class="eyebrow">DELIVER TO</div>
    <div class="name">${escapeHtml(order.customer.name)}</div>
    <div class="contact">${escapeHtml(order.customer.phone)}</div>
    ${order.customer.email ? `<div class="contact">${escapeHtml(order.customer.email)}</div>` : ''}
    <div class="address-rule"></div>
    <div class="address">${lines.map(line => `<div>${escapeHtml(line)}</div>`).join('')}</div>
  </article>`;
}

/** Opens an isolated 4×6 inch print document, one address sticker per order. */
export function printAddressLabels(orders: Order[]): boolean {
  if (!orders.length) return false;

  const printWindow = window.open('', '_blank', 'popup,width=600,height=850');
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ellext Delivery Address Stickers</title>
        <style>
          @page { size: 100mm 150mm; margin: 0; }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; width: 100mm; background: #fff; color: #122232; }
          body { font-family: Georgia, 'Times New Roman', serif; }
          .label { width: 100mm; height: 150mm; padding: 10mm 9mm; overflow: hidden; break-after: page; page-break-after: always; }
          .label:last-child { break-after: auto; page-break-after: auto; }
          .logo { display: block; width: 43mm; height: 21mm; object-fit: contain; object-position: center; margin: 0 auto 7mm; }
          .gold-rule, .address-rule { width: 100%; border-top: .4mm solid #c9a96e; }
          .gold-rule { margin-bottom: 8mm; }
          .eyebrow { margin-bottom: 3mm; color: #82652c; font: 700 9pt Arial, sans-serif; letter-spacing: 1.8pt; }
          .name { margin-bottom: 2mm; font-size: 19pt; font-weight: 700; line-height: 1.2; overflow-wrap: anywhere; }
          .contact { font: 10pt/1.45 Arial, sans-serif; overflow-wrap: anywhere; }
          .address-rule { margin: 7mm 0; border-color: #d7dce1; }
          .address { display: flex; flex-direction: column; gap: 2mm; font-size: 14pt; font-weight: 600; line-height: 1.4; overflow-wrap: anywhere; }
          @media screen { body { background: #eef0f3; padding: 12px; } .label { margin: 0 auto 12px; background: #fff; box-shadow: 0 2px 12px #0002; } }
        </style>
      </head>
      <body>${orders.map(addressMarkup).join('')}</body>
    </html>`);
  printWindow.document.close();

  const startPrint = async () => {
    const images = Array.from(printWindow.document.images);
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
    await printWindow.document.fonts.ready;
    printWindow.focus();
    printWindow.print();
  };
  void startPrint();
  return true;
}
