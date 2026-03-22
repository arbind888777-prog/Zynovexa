'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { commerceApi, uploadsApi, unwrapApiResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => commerceApi.getCreatorProducts().then(unwrapApiResponse),
  });

  // Populate form once
  useEffect(() => {
    if (loaded || !products) return;
    const list = Array.isArray(products) ? products : (products as any)?.products || [];
    const product = list.find((p: any) => p.id === productId);
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(((product.price || 0) / 100).toString());
      setStatus(product.status || 'PUBLISHED');
      setCoverPreview(product.coverImageUrl || '');
      setLoaded(true);
    }
  }, [products, productId, loaded]);

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
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      let coverImageUrl: string | undefined;
      if (coverFile) {
        const coverRes = await uploadsApi.uploadSingle(coverFile, 'covers');
        const coverData = coverRes.data?.data || coverRes.data;
        coverImageUrl = coverData?.url || coverData?.file?.url;
      }

      const priceInCents = Math.round(parseFloat(price || '0') * 100);
      await commerceApi.updateProduct(productId, {
        title: title.trim(),
        description: description.trim(),
        price: priceInCents,
        status,
        ...(coverImageUrl && { coverImageUrl }),
      });

      toast.success('Product updated!');
      router.push('/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">✏️ Edit Product</h1>
        <p className="text-slate-400 text-sm">Update your product details and pricing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={160}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={5000}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Price (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="9.99" min="0" step="0.01"
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors">
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image</label>
          <div onClick={() => coverRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/40 transition-colors overflow-hidden">
            <input ref={coverRef} type="file" className="hidden" accept="image/*" onChange={handleCoverSelect} />
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="max-h-40 mx-auto rounded-lg object-cover" />
            ) : (
              <p className="text-sm text-slate-400">Click to upload new cover</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" onClick={() => router.push('/products')}
            className="px-6 py-3.5 rounded-xl text-slate-400 font-medium border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
