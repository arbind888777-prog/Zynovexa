'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface SeoAnalysis {
  id: string;
  url: string;
  overallScore: number;
  readabilityScore: number;
  wordCount: number;
  issues: any;
  suggestions: any;
  headings: any;
  createdAt: string;
}

export default function SeoDashboardPage() {
  const queryClient = useQueryClient();
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<SeoAnalysis | null>(null);

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['seo-overview'],
    queryFn: () => api.get('/seo/overview').then((res) => res.data?.data || res.data),
  });

  const { data: analysesData, isLoading: listLoading } = useQuery({
    queryKey: ['seo-list'],
    queryFn: () => api.get('/seo').then((res) => res.data?.data || res.data),
  });

  const analyzeMutation = useMutation({
    mutationFn: (url: string) => api.post('/seo/analyze', { targetUrl: url }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['seo-list'] });
      queryClient.invalidateQueries({ queryKey: ['seo-overview'] });
      toast.success('SEO Scan Complete!');
      setTargetUrl('');
      // Select the newly scanned item if possible
      const newAnalysis = res.data?.data || res.data;
      if (newAnalysis && newAnalysis.id) {
        setSelectedAnalysis(newAnalysis);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to scan URL.');
    },
  });

  const reanalyzeMutation = useMutation({
    mutationFn: (id: string) => api.put(`/seo/${id}/re-analyze`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['seo-list'] });
      toast.success('Re-scan Complete!');
      if (selectedAnalysis?.id === res.data?.data?.id) {
        setSelectedAnalysis(res.data?.data || res.data);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/seo/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-list'] });
      queryClient.invalidateQueries({ queryKey: ['seo-overview'] });
      toast.success('Analysis deleted');
      setSelectedAnalysis(null);
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;
    
    // Add https:// if missing
    let finalUrl = targetUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    analyzeMutation.mutate(finalUrl);
  };

  const list = analysesData?.analyses || [];
  const averageScore = overview?.averageScore || 0;

  return (
    <div className="p-6 md:p-8 animate-fade-in max-w-7xl mx-auto h-[calc(100vh-60px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🔍 SEO Scanner</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze your blog posts and landing pages for SEO performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <div className="col-span-1 md:col-span-3">
          <form onSubmit={handleScan} className="flex gap-2">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter URL to scan (e.g. yourwebsite.com/blog/post)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={analyzeMutation.isPending}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {analyzeMutation.isPending ? 'Scanning...' : 'Scan URL'}
            </button>
          </form>
        </div>

        <div className="dashboard-panel rounded-xl p-4 flex items-center justify-between border border-white/5">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Avg Score</div>
            <div className="text-2xl font-bold text-white">{Math.round(averageScore)}/100</div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
            ${averageScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : averageScore >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}
          `}>
            {averageScore >= 80 ? 'A' : averageScore >= 50 ? 'C' : 'F'}
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left column: History */}
        <div className="w-1/3 flex flex-col bg-[#1e1e24] border border-white/5 rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/5 font-semibold text-slate-300">Scan History</div>
          <div className="flex-1 overflow-y-auto p-2">
            {listLoading ? (
              <p className="text-center text-slate-500 p-4">Loading history...</p>
            ) : list.length === 0 ? (
              <p className="text-center text-slate-500 p-4">No scans yet</p>
            ) : (
              <div className="space-y-2">
                {list.map((item: SeoAnalysis) => {
                  const urlObj = new URL(item.url);
                  const isSelected = selectedAnalysis?.id === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAnalysis(item)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold text-white truncate pr-2">{urlObj.hostname}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                          item.overallScore >= 50 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>{item.overallScore}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{urlObj.pathname}</div>
                      <div className="text-[10px] text-slate-500 mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Details */}
        <div className="flex-1 flex flex-col dashboard-panel rounded-2xl border border-white/5 overflow-hidden">
          {selectedAnalysis ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Analysis Results</h2>
                  <a href={selectedAnalysis.url} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:underline">
                    {selectedAnalysis.url}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => reanalyzeMutation.mutate(selectedAnalysis.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    {reanalyzeMutation.isPending ? 'Rescanning...' : 'Re-scan'}
                  </button>
                  <button onClick={() => deleteMutation.mutate(selectedAnalysis.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{selectedAnalysis.overallScore}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Overall SEO</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{selectedAnalysis.readabilityScore}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Readability</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{selectedAnalysis.wordCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Words</div>
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span>⚠️</span> Critical Issues ({Array.isArray(selectedAnalysis.issues) ? selectedAnalysis.issues.length : 0})
                  </h3>
                  <div className="space-y-2">
                    {Array.isArray(selectedAnalysis.issues) && selectedAnalysis.issues.length > 0 ? (
                      selectedAnalysis.issues.map((issue: string, i: number) => (
                        <div key={i} className="text-sm text-slate-300 bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                          • {issue}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500 p-3">No critical issues found!</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span>💡</span> Suggestions ({Array.isArray(selectedAnalysis.suggestions) ? selectedAnalysis.suggestions.length : 0})
                  </h3>
                  <div className="space-y-2">
                    {Array.isArray(selectedAnalysis.suggestions) && selectedAnalysis.suggestions.length > 0 ? (
                      selectedAnalysis.suggestions.map((sug: string, i: number) => (
                        <div key={i} className="text-sm text-slate-300 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                          • {sug}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500 p-3">Looks good!</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Headings */}
              {selectedAnalysis.headings && Object.keys(selectedAnalysis.headings).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Heading Structure</h3>
                  <div className="bg-white/5 rounded-xl p-4 overflow-x-auto text-sm text-slate-300 whitespace-pre">
                    {JSON.stringify(selectedAnalysis.headings, null, 2)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-white mb-2">Select an analysis</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Click on a scan result from the sidebar to view detailed SEO metrics, issues, and suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
