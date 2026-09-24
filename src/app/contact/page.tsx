'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Bespoke Bridal Jewellery Consultation',
    salon: 'Mumbai Private Salon (Altamount Road)',
    message: ''
  });
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your private salon appointment inquiry has been received by our concierge.', 'success');
  };

  return (
    <div className="contact-page-wrapper" style={{ padding: '60px 24px 120px' }}>
      <div className="elx-container" style={{ maxWidth: '1080px' }}>
        <div className="shop-page-header">
          <span className="section-sub-label">Client Concierge & Salons</span>
          <h1 className="shop-page-title font-serif">Private Consultation</h1>
          <p className="shop-page-desc">
            Connect with our head gemologists and bespoke master tailors in Mumbai, New Delhi, or Jaipur.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            marginTop: '48px'
          }}
        >
          {/* Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              padding: '36px'
            }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              Request Private Appointment
            </h2>

            {submitted ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#EBF7EE', color: '#0E8345', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={24} />
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Appointment Requested</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '8px', lineHeight: 1.6 }}>
                  Our Senior Client Concierge will contact you within 4 business hours to confirm your private salon booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Input
                  label="Patron Full Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Princess Ananya Singhania"
                />
                <div className="form-2col">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98200 00000"
                  />
                </div>

                <Select
                  label="Consultation Nature"
                  value={formData.serviceType}
                  onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option>Bespoke Bridal Jewellery Consultation</option>
                  <option>Couture Silk & Blazer Tailoring</option>
                  <option>Heirloom Gemstone Sourcing & Custom Cut</option>
                  <option>Order Inquiries & Armoured Logistics</option>
                </Select>

                <Select
                  label="Preferred Atelier Location"
                  value={formData.salon}
                  onChange={e => setFormData({ ...formData, salon: e.target.value })}
                >
                  <option>Mumbai Private Salon (Altamount Road)</option>
                  <option>New Delhi Flagship Atelier (Lutyens Zone)</option>
                  <option>Jaipur Heritage Vaults (Civil Lines)</option>
                  <option>Virtual Video Atelier Experience</option>
                </Select>

                <div className="elx-input-group">
                  <label className="elx-label">Personal Styling Notes or Requirements</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide any preferences regarding gemstone cuts, wedding dates, or sizing..."
                    className="elx-textarea"
                  />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    <Send size={15} /> Submit Consultation Request
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Salon Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <MapPin size={15} /> Mumbai Salon
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Altamount Road Atelier</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.6 }}>
                Penthouse Level, Regency Chambers, Altamount Road, Cumballa Hill, Mumbai 400026
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <MapPin size={15} /> New Delhi Salon
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Lutyens Residence Atelier</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.6 }}>
                Amrita Shergill Marg, Lodhi Estate, New Delhi 110003
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <Phone size={15} /> Direct Concierge Line
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>+91 22 4910 8800</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                Available Monday — Saturday, 10:00 AM — 08:00 PM IST.<br />
                Direct WhatsApp VIP Desk: concierge@ellext.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
