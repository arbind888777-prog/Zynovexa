'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { commerceApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface LessonForm {
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  resourceUrl: string;
  position: number;
  isPreview: boolean;
}

const emptyLesson = (position: number): LessonForm => ({
  title: '', slug: '', description: '', content: '', videoUrl: '', resourceUrl: '', position, isPreview: false,
});

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [lessons, setLessons] = useState<LessonForm[]>([emptyLesson(1)]);

  const createMutation = useMutation({
    mutationFn: (data: any) => commerceApi.createCourse(data),
    onSuccess: () => {
      toast.success('Course created! 🎓');
      router.push('/courses');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create course'),
  });

  const autoSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === autoSlug(title)) setSlug(autoSlug(val));
  };

  const updateLesson = (idx: number, field: keyof LessonForm, value: any) => {
    setLessons(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'title' && (!updated[idx].slug || updated[idx].slug === autoSlug(prev[idx].title))) {
        updated[idx].slug = autoSlug(value);
      }
      return updated;
    });
  };

  const addLesson = () => {
    setLessons(prev => [...prev, emptyLesson(prev.length + 1)]);
  };

  const removeLesson = (idx: number) => {
    setLessons(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, position: i + 1 })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Title and slug are required');
      return;
    }

    const validLessons = lessons
      .filter(l => l.title.trim())
      .map(l => ({
        ...l,
        slug: l.slug || autoSlug(l.title),
      }));

    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      price: price ? Math.round(parseFloat(price) * 100) : 0,
      currency,
      coverImageUrl: coverImageUrl.trim() || undefined,
      introVideoUrl: introVideoUrl.trim() || undefined,
      status,
      lessons: validLessons.length ? validLessons : undefined,
    });
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/courses" className="text-slate-400 hover:text-white transition-colors">← Back</Link>
        <h1 className="text-2xl font-extrabold text-white">🎓 Create Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Course Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Course Title *</label>
              <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Master Reels in 30 Days"
                className="input w-full" required />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">URL Slug *</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="master-reels-30-days"
                className="input w-full" required />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Short Description</label>
            <input value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="One-line summary"
              className="input w-full" maxLength={200} />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              placeholder="What students will learn..." className="input w-full resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Price ($)</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0 = Free" className="input w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="input w-full">
                <option value="usd">USD</option>
                <option value="inr">INR</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="input w-full">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cover Image URL</label>
              <input value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} placeholder="https://..."
                className="input w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Intro Video URL</label>
              <input value={introVideoUrl} onChange={e => setIntroVideoUrl(e.target.value)} placeholder="https://..."
                className="input w-full" />
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">📚 Lessons ({lessons.length})</h2>
            <button type="button" onClick={addLesson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              + Add Lesson
            </button>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Lesson {idx + 1}</span>
                  {lessons.length > 1 && (
                    <button type="button" onClick={() => removeLesson(idx)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={lesson.title} onChange={e => updateLesson(idx, 'title', e.target.value)}
                    placeholder="Lesson title" className="input w-full" />
                  <input value={lesson.slug} onChange={e => updateLesson(idx, 'slug', e.target.value)}
                    placeholder="lesson-slug" className="input w-full" />
                </div>

                <input value={lesson.description} onChange={e => updateLesson(idx, 'description', e.target.value)}
                  placeholder="Brief description" className="input w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={lesson.videoUrl} onChange={e => updateLesson(idx, 'videoUrl', e.target.value)}
                    placeholder="Video URL (mp4, YouTube, etc.)" className="input w-full" />
                  <input value={lesson.resourceUrl} onChange={e => updateLesson(idx, 'resourceUrl', e.target.value)}
                    placeholder="Resource/attachment URL" className="input w-full" />
                </div>

                <textarea value={lesson.content} onChange={e => updateLesson(idx, 'content', e.target.value)}
                  placeholder="Lesson content (HTML or markdown)" rows={3} className="input w-full resize-none" />

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={lesson.isPreview}
                    onChange={e => updateLesson(idx, 'isPreview', e.target.checked)}
                    className="w-4 h-4 rounded" />
                  Free preview (visible to non-enrolled users)
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={createMutation.isPending}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50">
            {createMutation.isPending ? 'Creating...' : '🎓 Create Course'}
          </button>
          <Link href="/courses" className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 hover:bg-white/10 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
