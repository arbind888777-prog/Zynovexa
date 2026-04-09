'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  avatar_url: string;
  role: string;
  company: string;
  platform: string;
  result_text: string;
  before_followers: number;
  after_followers: number;
  growth_percentage: number;
  video_url: string;
  rating: number;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trust/testimonials?featured=1')
      .then((r) => r.json())
      .then((d) => setTestimonials(d.data?.testimonials ?? d ?? []))
      .catch(() => setTestimonials(FALLBACK_TESTIMONIALS))
      .finally(() => setLoading(false));
  }, []);

  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Early Access
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            What our early users are saying
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Hear from creators who joined Zynovexa early.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      t.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">
                      {t.role}{t.company ? ` at ${t.company}` : ''}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= t.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  &ldquo;{t.result_text}&rdquo;
                </p>

                {/* Growth Stat */}
                {t.growth_percentage > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-400">Follower growth</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{t.growth_percentage}%
                    </span>
                  </div>
                )}

                {/* Video link */}
                {t.video_url && (
                  <a
                    href={t.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch their story
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar_url: '',
    role: 'Lifestyle Creator',
    company: '',
    platform: 'Instagram',
    result_text: 'Zynovexa helped me go from 2K to 45K followers in 4 months. The AI captions are incredibly natural and engaging.',
    before_followers: 2000,
    after_followers: 45000,
    growth_percentage: 2150,
    video_url: '',
    rating: 5,
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    avatar_url: '',
    role: 'Tech YouTuber',
    company: '',
    platform: 'YouTube',
    result_text: 'The scheduling + AI scripts combo saves me 10+ hours per week. My subscriber growth rate doubled after switching.',
    before_followers: 8500,
    after_followers: 23000,
    growth_percentage: 170,
    video_url: '',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sarah Chen',
    avatar_url: '',
    role: 'Digital Marketing Agency',
    company: 'GrowthLabs',
    platform: 'Multi-platform',
    result_text: 'We manage 15 client accounts through Zynovexa. The analytics dashboard alone justified the investment.',
    before_followers: 0,
    after_followers: 0,
    growth_percentage: 0,
    video_url: '',
    rating: 5,
  },
];
