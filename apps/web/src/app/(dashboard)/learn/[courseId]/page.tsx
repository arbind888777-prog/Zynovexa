'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

function ProgressRing({ percent }: { percent: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="52" height="52" className="-rotate-90">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke="url(#prog)" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <defs>
        <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  // Load full course structure
  const { data: enrollment, isLoading, refetch } = useQuery({
    queryKey: ['owned-course', courseId],
    queryFn: () => commerceApi.getOwnedCourse(courseId).then(unwrapApiResponse),
    retry: false,
    onError: () => {
      toast.error('Access denied — purchase required');
      router.replace('/purchases');
    },
  } as any);

  // Load active lesson content
  const { data: lessonData, isLoading: lessonLoading } = useQuery({
    queryKey: ['owned-lesson', courseId, activeLesson],
    queryFn: () => commerceApi.getOwnedLesson(courseId, activeLesson!).then(unwrapApiResponse),
    enabled: !!activeLesson,
  });

  const progressMutation = useMutation({
    mutationFn: ({ lessonId, completed }: { lessonId: string; completed: boolean }) =>
      commerceApi.updateLessonProgress(courseId, lessonId, completed),
    onSuccess: () => refetch(),
  });

  const course = (enrollment as any)?.course;
  const lessons = course?.lessons || [];
  const lessonProgress = (enrollment as any)?.lessonProgress || [];
  const progressPercent = (enrollment as any)?.progressPercent || 0;

  const isCompleted = (lessonId: string) =>
    lessonProgress.some((lp: any) => lp.lessonId === lessonId && lp.completedAt);

  const currentLesson = lessonData as any;

  // Auto-select first incomplete lesson
  if (!activeLesson && lessons.length > 0 && !isLoading) {
    const first = lessons.find((l: any) => !isCompleted(l.id)) || lessons[0];
    setActiveLesson(first.id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar — Lesson List */}
      <aside className="w-full lg:w-72 shrink-0 border-r p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        {/* Course Header */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link href="/purchases" className="text-xs text-slate-500 hover:text-purple-400 mb-3 flex items-center gap-1">
            ← My Library
          </Link>
          <h2 className="text-sm font-bold text-white line-clamp-2 mb-3">{course.title}</h2>
          <div className="flex items-center gap-3">
            <ProgressRing percent={progressPercent} />
            <div>
              <p className="text-xs text-slate-400">Progress</p>
              <p className="text-lg font-bold text-purple-400">{progressPercent}%</p>
            </div>
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-1">
          {lessons.map((lesson: any, idx: number) => {
            const done = isCompleted(lesson.id);
            const active = activeLesson === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson.id)}
                className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}
              >
                {/* Status dot */}
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: done ? 'rgba(16,185,129,0.2)' : active ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                    color: done ? '#10b981' : active ? '#a78bfa' : '#64748b',
                    border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : active ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                  }}
                >
                  {done ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${active ? 'text-white' : done ? 'text-slate-400' : 'text-slate-300'}`}>
                    {lesson.title}
                  </p>
                  {lesson.isPreview && !done && (
                    <span className="text-[10px] text-emerald-400 mt-0.5">Preview</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 max-w-4xl">
        {lessonLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentLesson ? (
          <div className="animate-fade-in space-y-6">
            {/* Lesson Header */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                Lesson {lessons.findIndex((l: any) => l.id === activeLesson) + 1} of {lessons.length}
              </p>
              <h1 className="text-2xl font-bold text-white">{currentLesson.title}</h1>
              {currentLesson.description && (
                <p className="text-slate-400 mt-2 text-sm">{currentLesson.description}</p>
              )}
            </div>

            {/* Video Player */}
            {currentLesson.videoUrl && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black">
                <video
                  controls
                  className="w-full h-full"
                  src={currentLesson.videoUrl}
                  key={currentLesson.id}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {/* Text Content */}
            {currentLesson.content && (
              <div
                className="prose prose-invert prose-sm max-w-none rounded-2xl p-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            )}

            {/* Resource Link */}
            {currentLesson.resourceUrl && (
              <a
                href={currentLesson.resourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-400 transition-all hover:text-purple-300"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
              >
                📎 Download Resources
              </a>
            )}

            {/* Mark Complete / Navigation */}
            <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              {/* Previous */}
              <button
                onClick={() => {
                  const idx = lessons.findIndex((l: any) => l.id === activeLesson);
                  if (idx > 0) setActiveLesson(lessons[idx - 1].id);
                }}
                disabled={lessons.findIndex((l: any) => l.id === activeLesson) === 0}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all disabled:opacity-30"
                style={{ border: '1px solid var(--border)' }}
              >
                ← Previous
              </button>

              {/* Mark complete */}
              {!isCompleted(activeLesson!) ? (
                <button
                  onClick={() => {
                    progressMutation.mutate({ lessonId: activeLesson!, completed: true });
                    toast.success('Lesson marked as complete! 🎉');
                  }}
                  disabled={progressMutation.isPending}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  {progressMutation.isPending ? '⏳ Saving...' : '✓ Mark Complete'}
                </button>
              ) : (
                <span className="text-sm text-emerald-400 font-semibold">✅ Completed</span>
              )}

              {/* Next */}
              <button
                onClick={() => {
                  const idx = lessons.findIndex((l: any) => l.id === activeLesson);
                  if (idx < lessons.length - 1) setActiveLesson(lessons[idx + 1].id);
                }}
                disabled={lessons.findIndex((l: any) => l.id === activeLesson) === lessons.length - 1}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all disabled:opacity-30"
                style={{ border: '1px solid var(--border)' }}
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 mt-20">
            <p className="text-4xl mb-4">🎬</p>
            <p>Select a lesson from the left to begin</p>
          </div>
        )}
      </main>
    </div>
  );
}
