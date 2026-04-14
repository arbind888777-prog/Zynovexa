'use client';
import { useState } from 'react';

const NICHES = ['Fashion', 'Fitness', 'Food', 'Travel', 'Tech', 'Finance', 'Business', 'Beauty', 'Gaming', 'Education', 'Lifestyle', 'Photography'];
const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'YouTube'];

/* ── Niche hashtag pools (30 each) ────────────────────────────── */

const NICHE_TAGS: Record<string, string[]> = {
  Fashion: ['#Fashion', '#OOTD', '#Style', '#Fashionista', '#OutfitOfTheDay', '#FashionBlogger', '#Streetwear', '#WhatIWore', '#FashionPhotography', '#Minimal', '#FashionWeek', '#Trendy', '#OOTDInspiration', '#FashionInspo', '#StyleGoals', '#DailyLook', '#FashionLovers', '#Styling', '#FashionAddict', '#GRWM', '#FastFashion', '#SustainableFashion', '#VintageStyle', '#AestheticFashion', '#FashionBlog', '#FashionLife', '#FashionDesigner', '#FashionTrends', '#FashionPhotoshoot', '#ModaFashion'],
  Fitness: ['#Fitness', '#GymLife', '#Workout', '#FitFam', '#HealthyLifestyle', '#Training', '#FitnessMotivation', '#Gym', '#NoPainNoGain', '#FitnessJourney', '#BodyBuilding', '#GymMotivation', '#Gains', '#CardioKing', '#LiftHeavy', '#FitLife', '#CrossFit', '#WorkoutOfTheDay', '#HIIT', '#FitnessCommunity', '#PersonalTrainer', '#WeightLoss', '#MuscleBuilding', '#HealthAndFitness', '#ActiveLifestyle', '#FitnessGoals', '#StrengthTraining', '#FitnessAddict', '#TransformationTuesday', '#FitnessFreak'],
  Food: ['#Food', '#Foodie', '#FoodPhotography', '#Yummy', '#Delicious', '#FoodBlogger', '#EatingOut', '#Foodstagram', '#FoodLover', '#Cooking', '#ChefLife', '#Recipe', '#HomeCooking', '#FoodPorn', '#InstFood', '#Tasty', '#FoodPic', '#FoodGram', '#NomNom', '#Baking', '#VeganFood', '#HealthyFood', '#StreetFood', '#RestaurantReview', '#FoodReels', '#MealPrep', '#FoodTrends', '#GourmetFood', '#FoodBlog', '#ComfortFood'],
  Travel: ['#Travel', '#Wanderlust', '#TravelPhotography', '#Explore', '#Adventure', '#TravelBlogger', '#TravelGram', '#InstaTravel', '#Vacation', '#Backpacking', '#RoadTrip', '#TravelTheWorld', '#SoloTravel', '#TravelLife', '#BucketList', '#NatureLovers', '#Passport', '#DigitalNomad', '#WorldTravel', '#TravelAddict', '#HiddenGems', '#TravelDiaries', '#Globetrotter', '#WeekendGetaway', '#TravelInspiration', '#BeachLife', '#MountainVibes', '#TravelHack', '#Staycation', '#ExploreMore'],
  Tech: ['#Tech', '#Technology', '#Software', '#AI', '#MachineLearning', '#Programming', '#Coding', '#Developer', '#Startup', '#Innovation', '#TechNews', '#WebDevelopment', '#AppDevelopment', '#TechLife', '#DigitalTransformation', '#DataScience', '#CyberSecurity', '#CloudComputing', '#DevOps', '#OpenSource', '#TechTwitter', '#SoftwareEngineer', '#FullStack', '#JavaScript', '#Python', '#BuildInPublic', '#Indie', '#SaaS', '#ProductManagement', '#UXDesign'],
  Finance: ['#Finance', '#Money', '#Investing', '#WealthBuilding', '#FinancialFreedom', '#StockMarket', '#PersonalFinance', '#Crypto', '#BudgetTips', '#FinanceTips', '#PassiveIncome', '#Savings', '#MoneyMindset', '#Trading', '#InvestSmart', '#FinancialLiteracy', '#SideHustle', '#FIRE', '#WealthManagement', '#MoneySavingTips', '#CreditScore', '#RetirementPlanning', '#DayTrading', '#RealEstateInvesting', '#DebtFree', '#FinancialGoals', '#SmartMoney', '#MoneyMatters', '#Entrepreneur', '#CashFlow'],
  Business: ['#Business', '#Entrepreneur', '#StartupLife', '#SmallBusiness', '#CEO', '#Hustle', '#BusinessGrowth', '#Leadership', '#Branding', '#Marketing', '#DigitalMarketing', '#Ecommerce', '#BusinessTips', '#ScaleUp', '#BusinessOwner', '#GrindMode', '#Networking', '#B2B', '#SalesStrategy', '#GrowthHacking', '#BusinessMindset', '#WorkSmart', '#Solopreneur', '#FreelanceLife', '#FounderLife', '#BusinessStrategy', '#RevenueGrowth', '#StartupFounder', '#ClientWork', '#BusinessCoach'],
  Beauty: ['#Beauty', '#MakeupLover', '#Skincare', '#GlowUp', '#MakeupTutorial', '#BeautyBlogger', '#SkincareRoutine', '#NaturalBeauty', '#MakeupOfTheDay', '#BeautyTips', '#Cosmetics', '#SelfCare', '#HairCare', '#BeautyReview', '#CleanBeauty', '#DrugstoreMakeup', '#BeautyHacks', '#GRWM', '#SkincareTips', '#LipstickLover', '#CrueltyFreeBeauty', '#BeautyInfluencer', '#NailArt', '#GlamMakeup', '#DewySkin', '#FoundationReview', '#BeautyCommunity', '#HairStyle', '#BeautyProducts', '#MakeupInspo'],
  Gaming: ['#Gaming', '#Gamer', '#GamePlay', '#PS5', '#Xbox', '#PCGaming', '#GamingCommunity', '#Twitch', '#StreamerLife', '#Esports', '#GamingSetup', '#RetroGaming', '#GameReview', '#IndieGame', '#GamerLife', '#NintendoSwitch', '#GamingMemes', '#MultiPlayer', '#RPG', '#FPS', '#GameDev', '#StreamingTips', '#GamingClips', '#ProGamer', '#CozyGaming', '#GameNight', '#MobileGaming', '#GamingNews', '#LiveStream', '#ContentCreator'],
  Education: ['#Education', '#Learning', '#OnlineLearning', '#StudyTips', '#EdTech', '#Teaching', '#StudentLife', '#Knowledge', '#LifelongLearning', '#StudyMotivation', '#Elearning', '#Teacher', '#StudyWithMe', '#AcademicLife', '#SkillBuilding', '#STEM', '#CollegeLife', '#BookRecommendation', '#StudyHacks', '#PersonalDevelopment', '#OnlineCourse', '#LearnToCode', '#DigitalLearning', '#SchoolLife', '#Research', '#CourseCreator', '#TeacherLife', '#MindsetShift', '#GrowthMindset', '#LeadershipDevelopment'],
  Lifestyle: ['#Lifestyle', '#DailyRoutine', '#MorningRoutine', '#Aesthetic', '#LifeGoals', '#Minimal', '#SlowLiving', '#SelfImprovement', '#Motivation', '#ProductivityTips', '#HealthyLiving', '#WorkLifeBalance', '#Mindfulness', '#DayInMyLife', '#LifeHack', '#CleanLiving', '#Wellness', '#JournalWithMe', '#Intentional', '#DreamLife', '#LifestyleBlogger', '#LiveYourBestLife', '#LifeUpdate', '#GoodVibes', '#SundayReset', '#RoutineGoals', '#WellnessJourney', '#SimpleLiving', '#Positivity', '#ThatGirlRoutine'],
  Photography: ['#Photography', '#PhotoOfTheDay', '#NaturePhotography', '#PortraitPhotography', '#StreetPhotography', '#Canon', '#Nikon', '#SonyAlpha', '#Lightroom', '#RAWPhoto', '#GoldenHour', '#LandscapePhotography', '#PhotographyLovers', '#CameraLife', '#ShotOnIPhone', '#VisualStorytelling', '#EditingTips', '#PhotoTips', '#ExploreToCreate', '#MoodyGrams', '#TravelPhotography', '#BlackAndWhitePhotography', '#FoodPhotography', '#WeddingPhotography', '#DronePhotography', '#FilmPhotography', '#PhotoWalk', '#Composition', '#LightAndShadow', '#PhotoMagic'],
};

/* ── Platform-specific modifier tags ─────────────────────────── */

const PLATFORM_TAGS: Record<string, string[]> = {
  Instagram: ['#Reels', '#InstaDaily', '#InstaMood', '#IGers', '#InstaLove', '#ExplorePage', '#InstaViral', '#IGReels'],
  'Twitter/X': ['#Thread', '#XPost', '#TwitterTips', '#Quote', '#HotTake', '#MustRead', '#TwitterSpace', '#Discourse'],
  LinkedIn: ['#LinkedInCreator', '#CareerTips', '#ProfessionalGrowth', '#Hiring', '#ThoughtLeadership', '#Networking', '#OpenToWork', '#LinkedInTop'],
  YouTube: ['#YouTuber', '#Subscribe', '#YouTubeVideo', '#WatchNow', '#YouTubeShorts', '#YouTubeCreator', '#VideoOfTheDay', '#NewVideo'],
};

/* ── Deterministic shuffle using seed ────────────────────────── */

function seededShuffle(arr: string[], seed: number): string[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff);
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateHashtags(niche: string, platform: string, count: number): string[] {
  const nicheTags = NICHE_TAGS[niche] || NICHE_TAGS['Tech'];
  const platTags = PLATFORM_TAGS[platform] || PLATFORM_TAGS['Instagram'];

  const seed = simpleHash(niche + platform);

  // Mix: ~75% niche, ~25% platform
  const platCount = Math.max(2, Math.round(count * 0.25));
  const nicheCount = count - platCount;

  const shuffledNiche = seededShuffle(nicheTags, seed).slice(0, nicheCount);
  const shuffledPlat = seededShuffle(platTags, seed + 1).slice(0, platCount);

  return [...shuffledNiche, ...shuffledPlat];
}

export default function HashtagGeneratorClient() {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [count, setCount] = useState(20);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleGenerate = () => {
    setTouched(true);
    if (!niche) return;
    setLoading(true);
    setHashtags([]);
    setTimeout(() => {
      setHashtags(generateHashtags(niche, platform, count));
      setCopied(false);
      setLoading(false);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 sm:p-8 space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Your Niche</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${niche === n ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                  style={{ background: niche === n ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)' }}>
                  {n}
                </button>
              ))}
            </div>
            {touched && !niche && (
              <p className="text-xs text-red-400 mt-2">Please select a niche to generate hashtags.</p>
            )}
          </div>

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

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Number of hashtags: <span className="text-purple-400">{count}</span></label>
            <input type="range" min="5" max="30" value={count} onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-slate-600 mt-1"><span>5</span><span>30</span></div>
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="btn btn-primary w-full py-3 font-bold disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </span>
            ) : '# Generate Hashtags'}
          </button>
        </div>

        {hashtags.length > 0 && (
          <div className="mt-6 card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">{hashtags.length} hashtags for <span className="text-purple-300">{niche}</span> on <span className="text-purple-300">{platform}</span></p>
              <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                {copied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map(tag => (
                <button key={tag} onClick={() => handleCopyTag(tag)}
                  className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-105 transition-all hover:brightness-125"
                  style={{ background: copiedTag === tag ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.15)', color: copiedTag === tag ? '#6ee7b7' : '#a5b4fc', border: `1px solid ${copiedTag === tag ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}` }}
                  title={`Click to copy ${tag}`}>
                  {copiedTag === tag ? '✓ copied' : tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
