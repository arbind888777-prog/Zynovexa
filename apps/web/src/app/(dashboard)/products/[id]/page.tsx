'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, uploadsApi, unwrapApiResponse } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import { toast } from 'sonner';
import Link from 'next/link';

const PRODUCT_TYPES = [
  { value: 'DIGITAL', label: '📄 Digital Download', desc: 'PDF, ZIP, files' },
  { value: 'TEMPLATE', label: '📐 Template', desc: 'Notion, Figma, etc.' },
  { value: 'EBOOK', label: '📚 E-Book', desc: 'EPUB, PDF books' },
  { value: 'COACHING', label: '🎯 Coaching', desc: '1-on-1 sessions' },
] as const;

export default function EditProductPage() {
  const { id: productId } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [productType, setProductType] = useState('DIGITAL');
  const [tagsInput, setTagsInput] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('DRAFT');
  const [saving, setSaving] = useState(false);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Load existing product
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => commerceApi.getCreatorProducts().then(unwrapApiResponse),
  });

  const product = (Array.isArray(products) ? products : (products as any)?.products || [])
    .find((p: any) => p.id === productId) as any;

  // Pre-fill form when product loads
  useEffect(() => {
    if (product && !initialized) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(product.price ? String(product.price / 100) : '');
      setOriginalPrice(product.originalPrice ? String(product.originalPrice / 100) : '');
      setProductType(product.type || 'DIGITAL');
      setTagsInput((product.tags || []).join(', '));
      setCoverPreview(product.coverImageUrl || '');
      setStatus(product.status || 'DRAFT');
      setInitialized(true);
    }
  }, [product, initialized]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error('File must be under 50MB'); return; }
    setAssetFile(file);
    setFileName(file.name);
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus?: 'PUBLISHED' | 'DRAFT') => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price) {
      toast.error('Title, description, and price are required');
      return;
    }

    setSaving(true);
    try {
      let assetUrl: string | undefined;
      let coverImageUrl: string | undefined;

      if (assetFile) {
        const res = await uploadsApi.uploadSingle(assetFile, 'products');
        const d = res.data?.data || res.data;
        assetUrl = d?.url || d?.file?.url;
      }

      if (coverFile) {
        const res = await uploadsApi.uploadSingle(coverFile, 'covers');
        const d = res.data?.data || res.data;
        coverImageUrl = d?.url || d?.file?.url;
      }

      const finalStatus = targetStatus || status;
      const priceInCents = Math.round(parseFloat(price) * 100);
      const originalPriceInCents = originalPrice ? Math.round(parseFloat(originalPrice) * 100) : undefined;
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      await commerceApi.updateProduct(productId, {
        title: title.trim(),
        description: description.trim(),
        type: productType,
        price: priceInCents,
        originalPrice: originalPriceInCents,
        tags,
        status: finalStatus,
        ...(assetUrl && { assetUrl }),
        ...(coverImageUrl && { coverImageUrl }),
      });

      setStatus(finalStatus);
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(finalStatus === 'PUBLISHED' ? '✅ Product is now Live!' : '📝 Saved as Draft');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!product && initialized === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <Link href="/products" className="text-xs text-slate-500 hover:text-purple-400 mb-2 flex items-center gap-1">← My Products</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">✏️ Edit Product</h1>
          <p className="text-slate-400 text-sm mt-1">Update details, price, or files</p>
        </div>

        {/* Status badge + store preview */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: status === 'PUBLISHED' ? 'rgba(16,185,129,0.15)' : status === 'DRAFT' ? 'rgba(107,114,128,0.15)' : 'rgba(245,158,11,0.15)',
              color: status === 'PUBLISHED' ? '#10b981' : status === 'DRAFT' ? '#9ca3af' : '#f59e0b',
              border: `1px solid ${status === 'PUBLISHED' ? 'rgba(16,185,129,0.25)' : status === 'DRAFT' ? 'rgba(107,114,128,0.25)' : 'rgba(245,158,11,0.25)'}`,
            }}
          >
            {status === 'PUBLISHED' ? '✅ Live' : status === 'DRAFT' ? '📝 Draft' : '📦 Archived'}
          </span>
          {product?.totalSales > 0 && (
            <span className="text-xs text-slate-400">
              {product.totalSales} sales · {formatMoneyFromMinor(product.totalRevenue || 0, product.currency || 'inr')} earned
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Product Type</label>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setProductType(t.value)}
                className="p-3 rounded-xl border text-left transition-all"
                style={{
                  borderColor: productType === t.value ? '#a855f7' : 'rgba(255,255,255,0.08)',
                  background: productType === t.value ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <p className="text-sm font-medium text-white">{t.label}</p>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Product Title *</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Instagram Growth Playbook" maxLength={160}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What does the buyer get? Why is it valuable?" rows={4} maxLength={5000}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>

        {/* Price Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="299" min="0" step="1"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Original Price (₹) <span className="text-slate-500">optional</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="499" min="0" step="1"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            {originalPrice && price && parseFloat(originalPrice) > parseFloat(price) && (
              <p className="text-xs text-emerald-400 mt-1">
                {Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)}% off
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tags <span className="text-slate-500">comma separated</span></label>
          <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            placeholder="marketing, growth, instagram" maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Replace File (optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Replace Product File <span className="text-slate-500">optional — leave blank to keep current</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
            style={{ borderColor: assetFile ? '#a855f7' : 'rgba(255,255,255,0.1)' }}
          >
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.zip,.rar,.epub,.mp4,.mp3" onChange={handleFileSelect} />
            {fileName ? (
              <div><span className="text-2xl">📄</span><p className="text-sm text-white mt-2">{fileName}</p><p className="text-xs text-slate-500">Click to change</p></div>
            ) : (
              <div><span className="text-2xl">📁</span><p className="text-sm text-slate-400 mt-2">Click to upload new file</p></div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image <span className="text-slate-500">optional</span></label>
          <div
            onClick={() => coverRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors overflow-hidden"
            style={{ borderColor: coverFile ? '#a855f7' : 'rgba(255,255,255,0.1)' }}
          >
            <input ref={coverRef} type="file" className="hidden" accept="image/*" onChange={handleCoverSelect} />
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="max-h-40 mx-auto rounded-lg object-cover" />
            ) : (
              <div><span className="text-2xl">🖼️</span><p className="text-sm text-slate-400 mt-2">Click to upload thumbnail</p></div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {/* Save as Draft */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, 'DRAFT')}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            {saving ? '⏳' : '💾'} Save Draft
          </button>

          {/* Publish / Unpublish Toggle */}
          {status === 'PUBLISHED' ? (
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, 'DRAFT')}
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-amber-400 transition-all disabled:opacity-50"
              style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)' }}
            >
              📤 Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, 'PUBLISHED')}
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              🚀 Publish Live
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
