'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  resourceUrl?: string;
  position: number;
  isPreview: boolean;
}

interface LessonProgress {
  id: string;
  lessonId: string;
  completedAt: string | null;
  lastViewedAt: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  introVideoUrl?: string;
  lessons: Lesson[];
  store: { name: string; slug: string };
  creator: { name: string; avatarUrl?: string };
}

interface Enrollment {
  id: string;
  courseId: string;
  progressPercent: number;
  course: Course;
  lessonProgress: LessonProgress[];
}

export default function LearnCoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonParam = searchParams.get('lesson');

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(0);

  // Load enrollment + course data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await commerceApi.getOwnedCourse(courseId);
        const data = unwrapApiResponse<Enrollment>(res);
        setEnrollment(data);
        setProgress(data.progressPercent || 0);

        // Auto-select lesson from URL or first lesson
        if (data.course.lessons.length) {
          const targetId = lessonParam || data.course.lessons[0].id;
          const found = data.course.lessons.find(l => l.id === targetId);
          if (found) {
            loadLesson(courseId, found.id);
          } else {
            loadLesson(courseId, data.course.lessons[0].id);
          }
        }
      } catch (err: any) {
        if (err?.response?.status === 403) {
          toast.error('You need to purchase this course first.');
          router.push('/purchases');
        } else {
          toast.error('Failed to load course');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLesson = async (cId: string, lessonId: string) => {
    setLessonLoading(true);
    try {
      const res = await commerceApi.getOwnedLesson(cId, lessonId);
      const lesson = unwrapApiResponse<Lesson>(res);
      setActiveLesson(lesson);
      // Update URL without full navigation
      window.history.replaceState(null, '', `/learn/${cId}?lesson=${lessonId}`);
    } catch {
      toast.error('Failed to load lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const toggleComplete = useCallback(async (lessonId: string) => {
    if (!enrollment) return;
    const isCompleted = enrollment.lessonProgress.some(
      p => p.lessonId === lessonId && p.completedAt
    );
    try {
      const res = await commerceApi.updateLessonProgress(courseId, lessonId, !isCompleted);
      const { progressPercent } = unwrapApiResponse<{ progressPercent: number }>(res);
      setProgress(progressPercent);

      // Update local lessonProgress state
      setEnrollment(prev => {
        if (!prev) return prev;
        const existing = prev.lessonProgress.find(p => p.lessonId === lessonId);
        const updatedProgress = existing
          ? prev.lessonProgress.map(p =>
              p.lessonId === lessonId
                ? { ...p, completedAt: isCompleted ? null : new Date().toISOString() }
                : p
            )
          : [...prev.lessonProgress, { id: 'temp', lessonId, completedAt: new Date().toISOString(), lastViewedAt: new Date().toISOString() }];
        return { ...prev, progressPercent, lessonProgress: updatedProgress };
      });

      toast.success(isCompleted ? 'Marked as incomplete' : 'Lesson completed! 🎉');
    } catch {
      toast.error('Failed to update progress');
    }
  }, [enrollment, courseId]);

  const navigateLesson = (direction: 'prev' | 'next') => {
    if (!enrollment || !activeLesson) return;
    const lessons = enrollment.course.lessons;
    const idx = lessons.findIndex(l => l.id === activeLesson.id);
    const targetIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (targetIdx >= 0 && targetIdx < lessons.length) {
      loadLesson(courseId, lessons[targetIdx].id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Course not found</p>
          <Link href="/purchases" className="text-purple-400 hover:text-purple-300">Back to Purchases</Link>
        </div>
      </div>
    );
  }

  const { course } = enrollment;
  const lessons = course.lessons;
  const activeLessonIdx = activeLesson ? lessons.findIndex(l => l.id === activeLesson.id) : -1;
  const isLessonCompleted = (lessonId: string) =>
    enrollment.lessonProgress.some(p => p.lessonId === lessonId && p.completedAt);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* ── Lesson Sidebar ─────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-300 overflow-hidden border-r border-white/5 bg-[#0d0d14] flex flex-col`}>
        {/* Course Header */}
        <div className="p-4 border-b border-white/5">
          <Link href="/purchases" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-flex items-center gap-1">
            ← Back to My Purchases
          </Link>
          <h2 className="text-sm font-bold text-white mt-2 line-clamp-2">{course.title}</h2>
          <p className="text-xs text-slate-500 mt-1">by {course.creator.name}</p>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-purple-400">{progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
            </div>
          </div>
        </div>

        {/* Lesson List */}
        <nav className="flex-1 overflow-y-auto py-2">
          {lessons.map((lesson, idx) => {
            const isActive = activeLesson?.id === lesson.id;
            const completed = isLessonCompleted(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => loadLesson(courseId, lesson.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all ${
                  isActive
                    ? 'bg-purple-500/10 border-l-2 border-purple-500'
                    : 'hover:bg-white/[0.03] border-l-2 border-transparent'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-white/5 text-slate-500'
                }`}>
                  {completed ? '✓' : idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm leading-snug ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {lesson.title}
                  </p>
                  {lesson.videoUrl && (
                    <span className="text-[10px] text-slate-500 mt-0.5 inline-flex items-center gap-1">
                      🎬 Video
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            {activeLesson && (
              <span className="text-sm text-slate-300 font-medium truncate max-w-[300px]">
                Lesson {activeLessonIdx + 1}: {activeLesson.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateLesson('prev')}
              disabled={activeLessonIdx <= 0}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/5">
              ← Prev
            </button>
            <button
              onClick={() => navigateLesson('next')}
              disabled={activeLessonIdx >= lessons.length - 1}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/5">
              Next →
            </button>
          </div>
        </header>

        {/* Lesson Content Area */}
        <div className="flex-1 overflow-y-auto">
          {lessonLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeLesson ? (
            <div className="max-w-5xl mx-auto">
              {/* Video Player */}
              {activeLesson.videoUrl && (
                <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
                  <video
                    key={activeLesson.id}
                    src={activeLesson.videoUrl}
                    controls
                    controlsList="nodownload"
                    onContextMenu={e => e.preventDefault()}
                    className="w-full h-full"
                    autoPlay
                  />
                </div>
              )}

              {/* Lesson Info */}
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h1>
                    {activeLesson.description && (
                      <p className="text-slate-400 text-sm">{activeLesson.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleComplete(activeLesson.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isLessonCompleted(activeLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-white/5 text-slate-300 hover:bg-purple-500/20 hover:text-purple-300'
                    }`}>
                    {isLessonCompleted(activeLesson.id) ? '✓ Completed' : 'Mark Complete'}
                  </button>
                </div>

                {/* Lesson Content */}
                {activeLesson.content && (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                )}

                {/* Resource Download */}
                {activeLesson.resourceUrl && (
                  <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📎</span>
                        <div>
                          <p className="text-sm font-medium text-white">Lesson Resources</p>
                          <p className="text-xs text-slate-500">Download attached materials</p>
                        </div>
                      </div>
                      <a
                        href={activeLesson.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                        Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between py-4 border-t border-white/5">
                  <button
                    onClick={() => navigateLesson('prev')}
                    disabled={activeLessonIdx <= 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    ← Previous Lesson
                  </button>
                  {activeLessonIdx < lessons.length - 1 ? (
                    <button
                      onClick={() => navigateLesson('next')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                      Next Lesson →
                    </button>
                  ) : (
                    <div className="text-sm text-emerald-400 font-semibold">🎉 Course Complete!</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <p className="text-6xl mb-4">📚</p>
                <p className="text-lg text-white font-medium mb-2">Select a lesson to begin</p>
                <p className="text-sm text-slate-500">Choose from the sidebar to start learning</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
