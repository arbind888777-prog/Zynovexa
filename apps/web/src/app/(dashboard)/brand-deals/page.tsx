'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monetizationApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import { formatMoneyFromMinor } from '@/lib/commerce';

interface BrandDeal {
  id: string;
  brandName: string;
  contactEmail?: string;
  contactName?: string;
  platform?: string;
  dealValue: number;
  currency: string;
  status: 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deliverables?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  isPaid: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  NEGOTIATING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ACCEPTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  IN_PROGRESS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function BrandDealsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<BrandDeal | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    brandName: '',
    contactEmail: '',
    platform: 'INSTAGRAM',
    dealValue: '',
    status: 'PENDING',
    deliverables: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['brand-deals'],
    queryFn: () => monetizationApi.getDeals().then(unwrapApiResponse),
  });

  const deals = (data as any)?.deals || [];

  const createMutation = useMutation({
    mutationFn: (newDeal: any) => monetizationApi.createDeal(newDeal).then(unwrapApiResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-deals'] });
      toast.success('Deal created successfully!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to create deal.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      monetizationApi.updateDeal(id, updates).then(unwrapApiResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-deals'] });
      toast.success('Deal updated!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to update deal.'),
  });

  const resetForm = () => {
    setEditingDeal(null);
    setFormData({
      brandName: '',
      contactEmail: '',
      platform: 'INSTAGRAM',
      dealValue: '',
      status: 'PENDING',
      deliverables: '',
    });
  };

  const handleOpenEdit = (deal: BrandDeal) => {
    setEditingDeal(deal);
    setFormData({
      brandName: deal.brandName,
      contactEmail: deal.contactEmail || '',
      platform: deal.platform || 'INSTAGRAM',
      dealValue: String(deal.dealValue / 100), // Assuming DB stores minor units (paise/cents) if matching commerce
      status: deal.status,
      deliverables: deal.deliverables || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dealValue: parseFloat(formData.dealValue || '0') * 100, // Convert to minor units
    };

    if (editingDeal) {
      updateMutation.mutate({ id: editingDeal.id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const totalValue = deals.reduce((acc: number, d: BrandDeal) => acc + (d.status !== 'CANCELLED' ? d.dealValue : 0), 0);
  const activeDeals = deals.filter((d: BrandDeal) => !['COMPLETED', 'CANCELLED'].includes(d.status)).length;

  return (
    <div className="p-6 md:p-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🤝 Brand Deals</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your sponsorships, track deliverables, and negotiate deals.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          + New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-5 border border-purple-500/20">
          <div className="text-2xl mb-2">💼</div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Total Deal Value</div>
          <div className="text-3xl font-bold text-white">
            {isLoading ? '...' : formatMoneyFromMinor(totalValue, 'usd')}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Active Deals</div>
          <div className="text-3xl font-bold text-emerald-400">
            {isLoading ? '...' : activeDeals}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Completed</div>
          <div className="text-3xl font-bold text-blue-400">
            {isLoading ? '...' : deals.filter((d: BrandDeal) => d.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading your deals...</div>
        ) : deals.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-white mb-2">No brand deals yet</h3>
            <p className="text-sm text-slate-400 mb-6">Start tracking your sponsorships and brand collaborations.</p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
            >
              Add Your First Deal
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Brand</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                  <th className="px-6 py-4 font-semibold">Deliverables</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deals.map((deal: BrandDeal) => (
                  <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{deal.brandName}</div>
                      <div className="text-xs text-slate-500">{deal.platform || 'General'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[deal.status] || STATUS_COLORS.PENDING}`}>
                        {deal.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {formatMoneyFromMinor(deal.dealValue, deal.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="line-clamp-1 max-w-xs">{deal.deliverables || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(deal)}
                        className="text-purple-400 hover:text-purple-300 font-medium px-3 py-1 rounded-lg hover:bg-purple-500/10 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editingDeal ? 'Edit Deal' : 'New Brand Deal'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                  placeholder="e.g. Nike, NordVPN"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Deal Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.dealValue}
                    onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="500.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#1e1e24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="NEGOTIATING">Negotiating</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full bg-[#1e1e24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="TWITTER">Twitter</option>
                  <option value="LINKEDIN">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Deliverables (Notes)</label>
                <textarea
                  rows={3}
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="e.g. 1 Instagram Reel + 1 Story"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
