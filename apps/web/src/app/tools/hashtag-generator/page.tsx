'use client';
import MarketingLayout from '@/components/MarketingLayout';
import { useState } from 'react';

const NICHES = ['Fashion', 'Fitness', 'Food', 'Travel', 'Tech', 'Finance', 'Business', 'Beauty', 'Gaming', 'Education', 'Lifestyle', 'Photography'];
const PLATFORMS = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'YouTube'];

const HASHTAG_SETS: Record<string, string[][]> = {
  Fashion: [
    ['#Fashion', '#OOTD', '#Style', '#Fashionista', '#OutfitOfTheDay', '#FashionBlogger', '#Streetwear', '#WhatIWore', '#FashionPhotography', '#Minimal', '#FashionWeek', '#Trendy', '#OOTDInspiration', '#FashionInspo', '#StyleGoals', '#DailyLook', '#FashionLovers', '#Styling', '#FashionAddict', '#GRWM'],
    ['#FastFashion', '#SustainableFashion', '#VintageStyle', '#AestheticFashion', '#FashionBlog', '#FashionLife', '#FashionDesigner', '#FashionTrends', '#ModaFashion', '#FashionPhotoshoot'],
  ],
  Fitness: [
    ['#Fitness', '#GymLife', '#Workout', '#FitFam', '#HealthyLifestyle', '#Training', '#FitnessMotivation', '#Gym', '#NoPainNoGain', '#FitnessJourney', '#BodyBuilding', '#GymMotivation', '#Gains', '#CardioKing', '#LiftHeavy', '#FitLife', '#CrossFit', '#WorkoutOfTheDay', '#HIIT', '#FitnessCommunity'],
    ['#PersonalTrainer', '#WeightLoss', '#MuscleBuilding', '#HealthAndFitness', '#ActiveLifestyle', '#FitnessGoals', '#StrengthTraining', '#FitnessAddict', '#TransformationTuesday', '#FitnessFreak'],
  ],
  Food: [
    ['#Food', '#Foodie', '#FoodPhotography', '#Yummy', '#Delicious', '#FoodBlogger', '#EatingOut', '#Foodstagram', '#FoodLover', '#Cooking', '#ChefLife', '#Recipe', '#HomeCooking', '#FoodPorn', '#InstFood', '#Tasty', '#FoodPic', '#FoodGram', '#NomNom', '#Baking'],
    ['#VeganFood', '#HealthyFood', '#StreetFood', '#RestaurantReview', '#FoodReels', '#MealPrep', '#FoodTrends', '#GourmetFood', '#FoodBlog', '#ComfortFood'],
  ],
  Tech: [
    ['#Tech', '#Technology', '#Software', '#AI', '#MachineLearning', '#Programming', '#Coding', '#Developer', '#Startup', '#Innovation', '#TechNews', '#WebDevelopment', '#AppDevelopment', '#TechLife', '#DigitalTransformation', '#DataScience', '#CyberSecurity', '#CloudComputing', '#DevOps', '#OpenSource'],
    ['#TechTwitter', '#SoftwareEngineer', '#FullStack', '#JavaScript', '#Python', '#BuildInPublic', '#Indie', '#SaaS', '#ProductManagement', '#UXDesign'],
  ],
};

export default function HashtagGeneratorPage() {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [count, setCount] = useState(20);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const getHashtags = () => {
    const sets = HASHTAG_SETS[niche] || HASHTAG_SETS['Tech'];
    return [...sets[0], ...sets[1]].slice(0, count);
  };

  const handleGenerate = () => {
    if (!niche) return;
    setGenerated(true);
    setCopied(false);
  };

  const handleCopy = () => {
    const tags = getHashtags().join(' ');
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MarketingLayout>
      <section className="pt-32 pb-12 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-pink w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🆓 Free Tool</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            Hashtag<br /><span className="gradient-text">Generator</span>
          </h1>
          <p className="text-slate-400 text-xl">Find the perfect hashtags to boost your reach. Curated for your niche and platform.</p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-6 sm:p-8 space-y-6">
            {/* Niche */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Your Niche</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {NICHES.map(n => (
                  <button key={n} onClick={() => { setNiche(n); setGenerated(false); }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${niche === n ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    style={{ background: niche === n ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${platform === p ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    style={{ background: platform === p ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Number of hashtags: <span className="text-purple-400">{count}</span></label>
              <input type="range" min="5" max="30" value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full accent-indigo-500" />
              <div className="flex justify-between text-xs text-slate-600 mt-1"><span>5</span><span>30</span></div>
            </div>

            <button onClick={handleGenerate} disabled={!niche}
              className="btn btn-primary w-full py-3 font-bold disabled:opacity-40">
              # Generate Hashtags
            </button>
          </div>

          {/* Results */}
          {generated && (
            <div className="mt-6 card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">{count} hashtags for <span className="text-purple-300">{niche}</span> on <span className="text-purple-300">{platform}</span></p>
                <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                  {copied ? '✓ Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {getHashtags().map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upsell */}
      <section className="py-16 px-4 sm:px-6 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-3">Want AI-optimised hashtags with every post?</h2>
          <p className="text-slate-400 mb-6 text-sm">Zynovexa automatically suggests the best hashtags when you write your posts. No more manual research.</p>
          <a href="/signup" className="btn btn-primary">Try Zynovexa Free →</a>
        </div>
      </section>
    </MarketingLayout>
  );
}
