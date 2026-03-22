'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { commerceApi, uploadsApi } from '@/lib/api';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const PRODUCT_TYPES = [
  { value: 'DIGITAL', label: '📄 Digital Download', desc: 'PDF, ZIP, files' },
  { value: 'TEMPLATE', label: '📐 Template', desc: 'Notion, Figma, etc.' },
  { value: 'EBOOK', label: '📚 E-Book', desc: 'EPUB, PDF books' },
  { value: 'COACHING', label: '🎯 Coaching', desc: '1-on-1 sessions' },
] as const;

export default function CreateProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [productType, setProductType] = useState<string>('DIGITAL');
  const [tagsInput, setTagsInput] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);

  // File state
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be under 50MB');
      return;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price) {
      toast.error('Title, description, and price are required');
      return;
    }
    if (!assetFile) {
      toast.error('Please upload a product file (PDF, ZIP, etc.)');
      return;
    }

    setSaving(true);
    try {
      // 1. Upload the product file
      const assetRes = await uploadsApi.uploadSingle(assetFile, 'products');
      const assetData = assetRes.data?.data || assetRes.data;
      const assetUrl = assetData?.url || assetData?.file?.url;

      // 2. Upload cover image if provided
      let coverImageUrl: string | undefined;
      if (coverFile) {
        const coverRes = await uploadsApi.uploadSingle(coverFile, 'covers');
        const coverData = coverRes.data?.data || coverRes.data;
        coverImageUrl = coverData?.url || coverData?.file?.url;
      }

      // 3. Create the product
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const priceInCents = Math.round(parseFloat(price) * 100);
      const originalPriceInCents = originalPrice ? Math.round(parseFloat(originalPrice) * 100) : undefined;
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      await commerceApi.createProduct({
        title: title.trim(),
        slug,
        description: description.trim(),
        price: priceInCents,
        originalPrice: originalPriceInCents,
        type: productType,
        tags: tags.length > 0 ? tags : undefined,
        assetUrl: assetUrl || '',
        coverImageUrl,
        status: 'PUBLISHED',
      });

      toast.success('Product created! 🎉');
      router.push('/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">🛍️ Create Product</h1>
        <p className="text-slate-400 text-sm">Upload a digital product and start selling in under 2 minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Product Type</label>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setProductType(t.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  productType === t.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
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
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Instagram Growth Playbook"
            maxLength={160}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does the buyer get? Why is it valuable?"
            rows={4}
            maxLength={5000}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>

        {/* Price Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                min="0"
                step="1"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Original Price (₹) <span className="text-slate-500">optional</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="499"
                min="0"
                step="1"
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
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="marketing, growth, instagram"
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Product File */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Product File *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/40 transition-colors"
          >
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.zip,.rar,.epub,.mp4,.mp3" onChange={handleFileSelect} />
            {fileName ? (
              <div>
                <span className="text-2xl">📄</span>
                <p className="text-sm text-white mt-2">{fileName}</p>
                <p className="text-xs text-slate-500">Click to change</p>
              </div>
            ) : (
              <div>
                <span className="text-3xl">📁</span>
                <p className="text-sm text-slate-400 mt-2">Click to upload PDF, ZIP, or media file</p>
                <p className="text-xs text-slate-500">Max 50MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image (optional)</label>
          <div
            onClick={() => coverRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/40 transition-colors overflow-hidden"
          >
            <input ref={coverRef} type="file" className="hidden" accept="image/*" onChange={handleCoverSelect} />
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="max-h-40 mx-auto rounded-lg object-cover" />
            ) : (
              <div>
                <span className="text-3xl">🖼️</span>
                <p className="text-sm text-slate-400 mt-2">Add a thumbnail to attract buyers</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Creating...' : '🚀 Publish Product'}
        </button>
      </form>
    </div>
  );
}
