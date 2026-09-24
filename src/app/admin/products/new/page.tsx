'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  X,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Package
} from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function NewProductStoryWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  // 4-Step Wizard: 1 = Upload, 2 = Edit Info & Pricing, 3 = Variants & Inventory, 4 = Customer Live Preview
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // Upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(100);

  // Product Data
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('jewells');
  const [collection, setCollection] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [freeShipping, setFreeShipping] = useState(false);

  // Inventory & SKU
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(2);

  // Variants (Dynamic based on Category)
  const [clothingSizes, setClothingSizes] = useState([
    { size: 'XS', stock: 0 },
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 0 }
  ]);

  // Derived discount
  const discountPercent =
    originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;
  const isSale = discountPercent > 0;

  const handleSimulateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    const invalidType = files.find(file => !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type));
    if (invalidType) {
      showToast('Choose JPEG, PNG, WebP, or AVIF images.', 'error');
      return;
    }
    if (files.some(file => file.size > 10 * 1024 * 1024)) {
      showToast('Each image must be 10 MB or smaller.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    try {
      const savedImages = await Promise.all(files.map(file => api.uploadProductImage(file)));
      setUploadProgress(100);
      setUploadedImages(prev => [...prev, ...savedImages.map(image => image.url)]);
      showToast(`${savedImages.length} image${savedImages.length === 1 ? '' : 's'} uploaded and saved.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Image upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
    if (coverImageIndex === idx) setCoverImageIndex(0);
  };

  const handlePublish = async (status: 'active' | 'draft') => {
    if (!name.trim()) {
      showToast('Please enter a product name.', 'error');
      return;
    }
    if (uploadedImages.length === 0) {
      showToast('Please upload at least one image.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cover = uploadedImages[coverImageIndex] || uploadedImages[0];

      const newProductPayload = {
        name,
        slug,
        category,
        collection,
        shortDescription,
        description,
        sellingPrice,
        originalPrice,
        freeShipping,
        discountPercent,
        isSale,
        sku: sku || `ELX-${category.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        stock: category === 'clothing'
          ? clothingSizes.reduce((total, variant) => total + variant.stock, 0)
          : stock,
        lowStockThreshold,
        images: uploadedImages,
        coverImage: cover,
        rating: 0,
        reviewsCount: 0,
        status,
        tags: []
      };

      await api.createProduct(newProductPayload);
      showToast(status === 'active' ? 'Product published to customer storefront!' : 'Draft saved.', 'success');
      router.push('/admin/products');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to publish product.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="product-wizard-page" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Header */}
      <div className="product-wizard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085' }}>
            Fast Creation Workflow
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#101828' }}>
            New Product Story
          </h1>
        </div>

        <div className="product-wizard-header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => handlePublish('draft')}
            disabled={isPublishing}
            className="elx-btn elx-btn-secondary elx-btn-sm"
          >
            Save Draft
          </button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isPublishing}
            onClick={() => handlePublish('active')}
          >
            Publish Live
          </Button>
        </div>
      </div>

      {/* STEPPER BAR (Instagram Story inspired) */}
      <div className="story-creator-wrap">
        <div className="story-steps-indicator">
          {[
            { step: 1, label: 'Upload Photos', icon: ImageIcon },
            { step: 2, label: 'Edit Info & Price', icon: DollarSign },
            { step: 3, label: 'Stock & Variants', icon: Package },
            { step: 4, label: 'Storefront Preview', icon: Eye }
          ].map(s => {
            const isCurrent = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                className={`story-step-item ${isCurrent ? 'active' : ''}`}
                onClick={() => setCurrentStep(s.step)}
                role="button"
                tabIndex={0}
                aria-label={`Step ${s.step}: ${s.label}`}
                aria-current={isCurrent ? 'step' : undefined}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setCurrentStep(s.step);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="story-step-num">
                  {isDone ? <Check size={14} /> : s.step}
                </div>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* ====================================================================
            STEP 1: UPLOAD PHOTOS
            ==================================================================== */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '6px' }}>
              Upload Product Photos
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#667085', marginBottom: '24px' }}>
              Drag and drop high-resolution photographs. Select a cover photo for customer discovery tiles.
            </p>

            {/* Dropzone */}
            <label className="story-dropzone" style={{ display: 'block' }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSimulateFileUpload}
                style={{ display: 'none' }}
              />
              <UploadCloud size={40} style={{ margin: '0 auto 12px', color: '#667085' }} />
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#101828' }}>
                Click or drag photographs here to upload
              </div>
              <p style={{ fontSize: '0.75rem', color: '#667085', marginTop: '4px' }}>
                Supports JPEG, PNG, WebP, AVIF up to 10MB each
              </p>
            </label>

            {/* Uploaded Images Preview Grid with Reorder and Set Cover */}
            <div style={{ marginTop: '32px' }}>
              <div className="product-wizard-gallery-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#101828' }}>
                  Uploaded Gallery ({uploadedImages.length} images)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#667085' }}>
                  Click star to set Cover Image
                </span>
              </div>

              <div className="photo-preview-grid">
                {uploadedImages.map((img, idx) => {
                  const isCover = coverImageIndex === idx;
                  return (
                    <div key={img + idx} className={`preview-thumb-box ${isCover ? 'cover' : ''}`}>
                      <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />

                      {isCover && <span className="preview-cover-tag">Cover Photo</span>}

                      {/* Controls overlay */}
                      <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setCoverImageIndex(idx)}
                          title="Set as Cover Image"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            color: isCover ? '#FFD700' : '#FFF',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Star size={12} fill={isCover ? '#FFD700' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Delete photo"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            color: '#FFF',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="product-wizard-step-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '36px' }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(2)}
                disabled={uploadedImages.length === 0}
              >
                Continue to Product Info <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 2: EDIT INFO & PRICING
            ==================================================================== */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '6px' }}>
              Product Information & Pricing
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#667085', marginBottom: '24px' }}>
              Provide the high-fashion editorial title, collection, narrative, and pricing structure.
            </p>

            <Input
              label="Product Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Imperial Polki & Emerald Choker Set"
            />

            <div className="form-2col">
              <Select
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
              >
                <option value="jewells">Fine Jewells</option>
                <option value="clothing">Couture Clothing</option>
              </Select>

              <Input
                label="Collection (optional)"
                value={collection}
                onChange={e => setCollection(e.target.value)}
                placeholder="Use a collection already created in Collections"
              />
            </div>

            {/* Pricing Matrix */}
            <div style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--admin-border)', borderRadius: 'var(--radius-sm)', padding: '20px', margin: '20px 0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#101828', display: 'block', marginBottom: '14px' }}>
                Pricing & Sale Badge Automation
              </span>

              <div className="form-2col">
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  required
                  value={sellingPrice}
                  onChange={e => setSellingPrice(parseInt(e.target.value) || 0)}
                />
                <Input
                  label="Original / Compare-At Price (₹)"
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(parseInt(e.target.value) || 0)}
                />
              </div>

              {isSale ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0E8345', fontSize: '0.8125rem', fontWeight: 500 }}>
                  <Badge variant="sale" size="sm">-{discountPercent}% OFF</Badge>
                  <span>Customer will automatically see a -{discountPercent}% privilege badge!</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#667085' }}>
                  Set original price higher than selling price to automatically expose a Sale badge.
                </span>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', color: '#101828', fontSize: '0.8125rem', fontWeight: 600 }}>
                <input type="checkbox" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)} />
                Free shipping for this product
              </label>
              <p style={{ fontSize: '0.75rem', color: '#667085', marginTop: '6px' }}>
                When enabled, this product does not add the Kerala or outside-Kerala delivery charge.
              </p>
            </div>

            <div className="elx-input-group">
              <label className="elx-label">Short Tagline Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                className="elx-input"
                placeholder="One sentence summary shown on quick view and cart..."
              />
            </div>

            <div className="elx-input-group">
              <label className="elx-label">Full Atelier Craftsmanship Story</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="elx-textarea"
                placeholder="Detailed craftsmanship narrative..."
              />
            </div>

            <div className="product-wizard-step-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
              <Button variant="secondary" size="md" onClick={() => setCurrentStep(1)}>
                <ArrowLeft size={15} /> Back to Photos
              </Button>
              <Button variant="primary" size="md" onClick={() => setCurrentStep(3)}>
                Configure Variants & Stock <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 3: STOCK & VARIANTS
            ==================================================================== */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '6px' }}>
              Inventory & Variant Matrix
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#667085', marginBottom: '24px' }}>
              Specify inventory thresholds and stock per size or metal finish.
            </p>

            <div className="form-2col">
              <Input
                label="Master SKU"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="ELX-JW-01"
              />
              <Input
                label="Low Stock Warning Threshold"
                type="number"
                value={lowStockThreshold}
                onChange={e => setLowStockThreshold(parseInt(e.target.value) || 2)}
                hint="Triggers urgent restock alert in dashboard"
              />
            </div>

            {/* Clothing Specific Variants */}
            {category === 'clothing' ? (
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--admin-border)', borderRadius: 'var(--radius-sm)', padding: '20px', marginTop: '16px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#101828', display: 'block', marginBottom: '12px' }}>
                  Clothing Sizes Matrix
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  {clothingSizes.map((item, idx) => (
                    <div key={item.size} style={{ backgroundColor: '#FFF', padding: '12px', border: '1px solid #D0D5DD', borderRadius: 'var(--radius-xs)' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Size {item.size}</span>
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '0.6875rem', color: '#667085', display: 'block' }}>Stock Units</label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={item.stock}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            setClothingSizes(prev => {
                              const updated = [...prev];
                              updated[idx].stock = val;
                              return updated;
                            });
                          }}
                          className="inline-stock-input"
                          style={{ width: '100%', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Product-level inventory */
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--admin-border)', borderRadius: 'var(--radius-sm)', padding: '20px', marginTop: '16px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#101828', display: 'block', marginBottom: '12px' }}>
                  Product Stock
                </span>
                <Input
                  label="Stock quantity"
                  type="number"
                  min={0}
                  step={1}
                  value={stock}
                  onChange={e => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            )}

            <div className="product-wizard-step-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
              <Button variant="secondary" size="md" onClick={() => setCurrentStep(2)}>
                <ArrowLeft size={15} /> Back to Pricing
              </Button>
              <Button variant="primary" size="md" onClick={() => setCurrentStep(4)}>
                Inspect Storefront Preview <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 4: LIVE STOREFRONT PREVIEW & PUBLISH
            ==================================================================== */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#101828' }}>
                  Customer Storefront Preview
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#667085' }}>
                  Exact representation of how patrons will experience this creation on mobile & desktop.
                </p>
              </div>
              <Badge variant="gold" size="md">Live Preview</Badge>
            </div>

            {/* Preview Box Styled Exactly Like PDP */}
            <div
              className="product-wizard-preview"
              style={{
                backgroundColor: '#FAF8F5',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '36px'
              }}
            >
              {/* Left Image Viewport */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: '#E8E3DA'
                }}
              >
                <Image
                  src={uploadedImages[coverImageIndex] || uploadedImages[0]}
                  alt={name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {isSale && (
                  <span style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge variant="sale">-{discountPercent}%</Badge>
                  </span>
                )}
              </div>

              {/* Right Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {collection} • {category === 'jewells' ? 'Fine Jewells' : 'Couture Clothing'}
                </span>

                <h2 className="font-serif" style={{ fontSize: '1.875rem', lineHeight: 1.25 }}>
                  {name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '1.375rem', fontWeight: 600 }}>
                    ₹{sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {originalPrice > sellingPrice && (
                    <span style={{ fontSize: '1rem', color: '#888', textDecoration: 'line-through' }}>
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: '#444', lineHeight: 1.6 }}>
                  {shortDescription}
                </p>

                <div style={{ padding: '12px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', color: '#666' }}>
                  SKU: <strong>{sku}</strong> • Estimated Arrival: 3–5 Business Days
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button type="button" className="elx-btn elx-btn-primary elx-btn-md" style={{ flex: 1 }}>
                    Add to Bag
                  </button>
                  <button type="button" className="elx-btn elx-btn-gold elx-btn-md" style={{ flex: 1 }}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Final Actions */}
            <div className="product-wizard-step-actions product-wizard-publish-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px' }}>
              <Button variant="secondary" size="md" onClick={() => setCurrentStep(3)}>
                <ArrowLeft size={15} /> Edit Variants
              </Button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handlePublish('draft')}
                  className="elx-btn elx-btn-outline elx-btn-md"
                >
                  Save as Draft
                </button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isPublishing}
                  onClick={() => handlePublish('active')}
                >
                  <Check size={16} /> Publish Creation to Storefront
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
