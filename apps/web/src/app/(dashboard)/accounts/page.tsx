'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Platform } from '@/types';

const PLATFORM_ICONS: Record<string, string> = { INSTAGRAM: '📸', YOUTUBE: '▶️', TIKTOK: '🎵', TWITTER: '𝕏', LINKEDIN: '💼', FACEBOOK: '👤', SNAPCHAT: '👻' };
const PLATFORM_COLORS: Record<string, string> = { INSTAGRAM: '#e1306c', YOUTUBE: '#ff0000', TIKTOK: '#69c9d0', TWITTER: '#1da1f2', LINKEDIN: '#0077b5', FACEBOOK: '#1877f2', SNAPCHAT: '#fffc00' };
const ALL_PLATFORMS: Platform[] = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'SNAPCHAT'];

export default function AccountsPage() {
  const qc = useQueryClient();
  const [showConnect, setShowConnect] = useState(false);
  const [form, setForm] = useState({ platform: 'INSTAGRAM' as Platform, handle: '', displayName: '', accessToken: '', followersCount: '' });

  const { data: accounts, isLoading } = useQuery({ queryKey: ['accounts'], queryFn: () => accountsApi.getAll().then(r => r.data) });
  const { data: stats } = useQuery({ queryKey: ['account-stats'], queryFn: () => accountsApi.getStats().then(r => r.data) });

  const connect = useMutation({
    mutationFn: () => accountsApi.connect({ ...form, followersCount: parseInt(form.followersCount) || 0 }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); setShowConnect(false); toast.success('Account connected!'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to connect'),
  });

  const disconnect = useMutation({
    mutationFn: (id: string) => accountsApi.disconnect(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success('Account disconnected'); },
  });

  const connectedPlatforms = new Set(accounts?.map((a: any) => a.platform) || []);

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🔗 Connected Accounts</h1>
        <button onClick={() => setShowConnect(true)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>+ Connect Account</button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card p-4"><p className="text-2xl font-bold text-white">{stats.connected}</p><p className="text-sm text-gray-400">Connected Platforms</p></div>
          <div className="card p-4"><p className="text-2xl font-bold text-white">{(stats.totalFollowers || 0).toLocaleString()}</p><p className="text-sm text-gray-400">Total Followers</p></div>
        </div>
      )}

      {/* Platform Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_PLATFORMS.map(p => {
          const account = accounts?.find((a: any) => a.platform === p);
          const isConnected = !!account;
          return (
            <div key={p} className={`card p-5 transition-all ${isConnected ? 'card-hover' : 'opacity-60'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{PLATFORM_ICONS[p]}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{p}</p>
                    {isConnected && <p className="text-xs text-gray-400">{account.handle}</p>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isConnected ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-500/10'}`}>{isConnected ? 'Connected' : 'Not connected'}</span>
              </div>
              {isConnected && <p className="text-sm font-mono text-white mb-3">{(account.followersCount || 0).toLocaleString()} followers</p>}
              <button onClick={() => isConnected ? disconnect.mutate(account.id) : setShowConnect(true)}
                className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${isConnected ? 'text-red-400 hover:bg-red-400/10' : 'text-purple-400 hover:bg-purple-400/10'}`}
                style={{ border: '1px solid var(--border)' }}>
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Connect Modal */}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-white mb-5">Connect Social Account</h2>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-400 mb-1 block">Platform</label>
                <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value as Platform }))} className="w-full px-4 py-3 rounded-lg text-white text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {ALL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select></div>
              {[
                { key: 'handle', label: 'Handle / Username', placeholder: '@username' },
                { key: 'displayName', label: 'Display Name', placeholder: 'My Channel' },
                { key: 'accessToken', label: 'Access Token', placeholder: 'OAuth access token' },
                { key: 'followersCount', label: 'Followers Count', placeholder: '10000', type: 'number' },
              ].map(f => (
                <div key={f.key}><label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                  <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="w-full px-4 py-3 rounded-lg text-white text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} /></div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setShowConnect(false)} className="flex-1 py-2.5 rounded-lg text-sm text-gray-300 card">Cancel</button>
                <button onClick={() => connect.mutate()} disabled={connect.isPending} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  {connect.isPending ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
