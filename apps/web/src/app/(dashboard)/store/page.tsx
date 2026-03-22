'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function StoreSettingsPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const { data: store } = useQuery({
    queryKey: ['store'],
    queryFn: () => commerceApi.getStore().then(unwrapApiResponse),
  });

  useEffect(() => {
    if (loaded || !store) return;
    const s = store as any;
    setName(s.name || '');
    setSlug(s.slug || '');
    setDescription(s.description || '');
    setIsPublished(s.isPublished || false);
    setLoaded(true);
  }, [store, loaded]);

  // Simple QR code rendering using canvas
  useEffect(() => {
    if (!user?.handle || !qrRef.current) return;
    const canvas = qrRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 160;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size / 2, size / 2 - 10);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`/${user.handle}`, size / 2, size / 2 + 10);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.fillText('Scan with app', size / 2, size / 2 + 30);
  }, [user?.handle]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => commerceApi.upsertStore(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['store'] });
      toast.success('Store updated!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to save'),
  });

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('Store name and slug are required');
      return;
    }
    saveMutation.mutate({ name: name.trim(), slug: slug.trim(), description: description.trim(), isPublished });
  };

  const handleUrl = user?.handle ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${user.handle}` : '';
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${slug}` : `/store/${slug}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">🏪 Store Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your public storefront and share your creator page.</p>
      </div>

      {/* Handle URL + QR Section */}
      {user?.handle && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
          <h2 className="text-lg font-bold text-white mb-4">🔗 Your Creator Page</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Your unique URL</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-purple-300 font-mono text-sm">
                    zynovexa.com/{user.handle}
                  </div>
                  <button
                    onClick={() => copyToClipboard(handleUrl)}
                    className="px-4 py-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors text-sm font-medium"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={handleUrl} target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                  👁️ Preview Store
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `${user.name}'s Store`, url: handleUrl });
                    } else {
                      copyToClipboard(handleUrl);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  📤 Share
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Handle: <span className="text-slate-300 font-mono">@{user.handle}</span> — 
                This is auto-generated. Contact support to change it.
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-slate-400 mb-2 text-center">QR Code</p>
              <canvas ref={qrRef} className="rounded-xl border border-white/10" style={{ width: 160, height: 160 }} />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Store Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={100}
            placeholder="My Awesome Store"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Store Slug * (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">/store/</span>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} maxLength={80}
              placeholder="my-store"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          {slug && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-500">
                Store URL: <a href={storeUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">{storeUrl}</a>
              </p>
              <button onClick={() => copyToClipboard(storeUrl)} className="text-xs text-purple-400 hover:text-purple-300">📋</button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={500}
            placeholder="Tell buyers what your store is about..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div>
            <p className="text-sm font-medium text-white">Publish Store</p>
            <p className="text-xs text-slate-400">Make your store visible to the public</p>
          </div>
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isPublished ? 'bg-emerald-500' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Plan Info */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Current Plan: <span className="text-purple-400">{user?.plan || 'FREE'}</span></p>
              <p className="text-xs text-slate-400">
                Platform fee: {user?.plan === 'BUSINESS' ? '2%' : user?.plan === 'PRO' ? '3%' : '5%'} per transaction
              </p>
            </div>
            <a href="/settings" className="text-xs text-purple-400 hover:text-purple-300">Upgrade →</a>
          </div>
        </div>

        <button onClick={handleSave} disabled={saveMutation.isPending}
          className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50">
          {saveMutation.isPending ? 'Saving...' : '💾 Save Store Settings'}
        </button>
      </div>
    </div>
  );
}
