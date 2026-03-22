'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface Lesson {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  resourceUrl: string;
  position: number;
  isPreview: boolean;
  _isNew?: boolean;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const qc = useQueryClient();
  const courseId = params.courseId as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => commerceApi.getCreatorCourses().then(unwrapApiResponse),
  });

  // Populate form from fetched data
  useEffect(() => {
    const list = (Array.isArray(courses) ? courses : []) as any[];
    const course = list.find((c: any) => c.id === courseId);
    if (course) {
      setTitle(course.title || '');
      setSlug(course.slug || '');
      setDescription(course.description || '');
      setShortDescription(course.shortDescription || '');
      setPrice(course.price ? (course.price / 100).toString() : '');
      setCurrency(course.currency || 'usd');
      setCoverImageUrl(course.coverImageUrl || '');
      setIntroVideoUrl(course.introVideoUrl || '');
      setStatus(course.status || 'DRAFT');
      setLessons((course.lessons || []).map((l: any) => ({
        id: l.id,
        title: l.title || '',
        slug: l.slug || '',
        description: l.description || '',
        content: l.content || '',
        videoUrl: l.videoUrl || '',
        resourceUrl: l.resourceUrl || '',
        position: l.position,
        isPreview: l.isPreview || false,
      })));
    }
  }, [courses, courseId]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => commerceApi.updateCourse(courseId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated! ✅');
      router.push('/courses');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update course'),
  });

  const addLessonMutation = useMutation({
    mutationFn: (data: any) => commerceApi.addLesson(courseId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Lesson added');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to add lesson'),
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: any }) => commerceApi.updateLesson(courseId, lessonId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: string) => commerceApi.deleteLesson(courseId, lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Lesson removed');
    },
  });

  const autoSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updateLessonField = (idx: number, field: keyof Lesson, value: any) => {
    setLessons(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addNewLesson = () => {
    setLessons(prev => [...prev, {
      title: '', slug: '', description: '', content: '', videoUrl: '', resourceUrl: '',
      position: prev.length + 1, isPreview: false, _isNew: true,
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update course metadata
    updateMutation.mutate({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      price: price ? Math.round(parseFloat(price) * 100) : 0,
      currency,
      coverImageUrl: coverImageUrl.trim() || undefined,
      introVideoUrl: introVideoUrl.trim() || undefined,
      status,
    });

    // Handle new lessons
    for (const lesson of lessons) {
      if (lesson._isNew && lesson.title.trim()) {
        await addLessonMutation.mutateAsync({
          title: lesson.title.trim(),
          slug: lesson.slug || autoSlug(lesson.title),
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl || undefined,
          resourceUrl: lesson.resourceUrl || undefined,
          position: lesson.position,
          isPreview: lesson.isPreview,
        });
      } else if (lesson.id) {
        // Update existing lessons
        await updateLessonMutation.mutateAsync({
          lessonId: lesson.id,
          data: {
            title: lesson.title.trim(),
            slug: lesson.slug,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl || undefined,
            resourceUrl: lesson.resourceUrl || undefined,
            position: lesson.position,
            isPreview: lesson.isPreview,
          },
        });
      }
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/courses" className="text-slate-400 hover:text-white transition-colors">← Back</Link>
        <h1 className="text-2xl font-extrabold text-white">✏️ Edit Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Course Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Course Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input w-full" required />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">URL Slug *</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} className="input w-full" required />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Short Description</label>
            <input value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="input w-full" maxLength={200} />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="input w-full resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Price ($)</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="input w-full" />
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
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cover Image URL</label>
              <input value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Intro Video URL</label>
              <input value={introVideoUrl} onChange={e => setIntroVideoUrl(e.target.value)} className="input w-full" />
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">📚 Lessons ({lessons.length})</h2>
            <button type="button" onClick={addNewLesson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              + Add Lesson
            </button>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id || `new-${idx}`} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">
                    Lesson {idx + 1} {lesson._isNew && <span className="text-emerald-400">(New)</span>}
                  </span>
                  <button type="button" onClick={() => {
                    if (lesson.id) {
                      if (confirm('Delete this lesson?')) deleteLessonMutation.mutate(lesson.id);
                    } else {
                      setLessons(prev => prev.filter((_, i) => i !== idx));
                    }
                  }} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={lesson.title} onChange={e => updateLessonField(idx, 'title', e.target.value)}
                    placeholder="Lesson title" className="input w-full" />
                  <input value={lesson.slug} onChange={e => updateLessonField(idx, 'slug', e.target.value)}
                    placeholder="lesson-slug" className="input w-full" />
                </div>

                <input value={lesson.description} onChange={e => updateLessonField(idx, 'description', e.target.value)}
                  placeholder="Brief description" className="input w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={lesson.videoUrl} onChange={e => updateLessonField(idx, 'videoUrl', e.target.value)}
                    placeholder="Video URL" className="input w-full" />
                  <input value={lesson.resourceUrl} onChange={e => updateLessonField(idx, 'resourceUrl', e.target.value)}
                    placeholder="Resource URL" className="input w-full" />
                </div>

                <textarea value={lesson.content} onChange={e => updateLessonField(idx, 'content', e.target.value)}
                  placeholder="Lesson content" rows={3} className="input w-full resize-none" />

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={lesson.isPreview}
                    onChange={e => updateLessonField(idx, 'isPreview', e.target.checked)} className="w-4 h-4 rounded" />
                  Free preview
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={updateMutation.isPending}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50">
            {updateMutation.isPending ? 'Saving...' : '💾 Save Changes'}
          </button>
          <Link href="/courses" className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 hover:bg-white/10 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
