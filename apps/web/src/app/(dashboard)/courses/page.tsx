'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PUBLISHED: { bg: '#10b98120', color: '#10b981', label: '✅ Live' },
  DRAFT:     { bg: '#6b728020', color: '#6b7280', label: '📝 Draft' },
  ARCHIVED:  { bg: '#f59e0b20', color: '#f59e0b', label: '📦 Archived' },
};

export default function CoursesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => commerceApi.getCreatorCourses().then(unwrapApiResponse),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => commerceApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted');
    },
    onError: () => toast.error('Failed to delete course'),
  });

  const list = (Array.isArray(courses) ? courses : []) as any[];
  const filtered = filter ? list.filter((c: any) => c.status === filter) : list;

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🎓 My Courses</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage your online courses</p>
        </div>
        <Link href="/courses/create"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity whitespace-nowrap">
          + Create Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Courses</div>
          <div className="text-2xl font-bold text-white">{list.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Published</div>
          <div className="text-2xl font-bold text-emerald-400">{list.filter((c: any) => c.status === 'PUBLISHED').length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Lessons</div>
          <div className="text-2xl font-bold text-blue-400">{list.reduce((sum: number, c: any) => sum + (c.lessons?.length || 0), 0)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Enrollments</div>
          <div className="text-2xl font-bold text-pink-400">{list.reduce((sum: number, c: any) => sum + (c.enrollments?.length || 0), 0)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['' , 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={{ background: filter === s ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)', border: '1px solid var(--border)' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Courses List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card h-56 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-lg font-semibold text-white mb-2">No courses yet</p>
          <p className="text-slate-400 text-sm mb-6">Create your first course and start teaching online.</p>
          <Link href="/courses/create"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course: any) => {
            const status = STATUS_STYLES[course.status] || STATUS_STYLES.DRAFT;
            return (
              <div key={course.id} className="card overflow-hidden group">
                {/* Cover */}
                <div className="h-36 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
                  {course.coverImageUrl ? (
                    <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🎓</div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{course.title}</h3>
                  {course.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{course.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>📚 {course.lessons?.length || 0} lessons</span>
                    <span>👥 {course.enrollments?.length || 0} enrolled</span>
                    <span className="font-semibold text-purple-400">
                      {course.price ? `$${(course.price / 100).toFixed(2)}` : 'Free'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/courses/${course.id}/edit`}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Delete this course? This cannot be undone.')) {
                          deleteMutation.mutate(course.id);
                        }
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
