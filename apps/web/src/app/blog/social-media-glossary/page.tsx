import MarketingLayout from '@/components/MarketingLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Glossary | Zynovexa',
  description: 'Complete A-Z glossary of social media terms, marketing acronyms, and creator economy vocabulary. Your definitive social media dictionary.',
};

const TERMS: Record<string, { term: string; def: string }[]> = {
  A: [
    { term: 'Algorithm', def: 'The set of rules a platform uses to decide what content to show to users and in what order.' },
    { term: 'Analytics', def: 'Data about your social media performance — including reach, engagement, follower growth, and conversions.' },
    { term: 'Authentic Content', def: 'Content that feels genuine and honest rather than overly polished or promotional.' },
    { term: 'Audience Persona', def: 'A fictional profile representing your ideal follower or customer, used to guide content strategy.' },
  ],
  B: [
    { term: 'Brand Voice', def: 'The consistent personality and tone a brand uses across all its social media communications.' },
    { term: 'Boosted Post', def: 'An organic social media post that has been paid to reach a wider audience.' },
    { term: 'Bio Link', def: 'The single clickable link in a social media profile biography, often used to drive traffic.' },
  ],
  C: [
    { term: 'Caption', def: 'The text accompanying a social media post, which may include hashtags, mentions, and calls to action.' },
    { term: 'CTA (Call to Action)', def: 'A prompt encouraging the audience to take a specific action, like "Click the link" or "Comment below".' },
    { term: 'Content Calendar', def: 'A planning tool that maps out what, when, and where content will be published.' },
    { term: 'Conversion Rate', def: 'The percentage of people who take a desired action after seeing your content.' },
  ],
  D: [
    { term: 'DM (Direct Message)', def: 'A private message sent between users on a social platform.' },
    { term: 'Dark Social', def: 'Sharing of content that occurs through private channels like messaging apps, which is hard to track.' },
  ],
  E: [
    { term: 'Engagement Rate', def: 'A metric showing how much your audience interacts with your content (likes + comments + shares ÷ reach).' },
    { term: 'Evergreen Content', def: 'Content that remains relevant and valuable over a long period of time.' },
    { term: 'Explore Page', def: 'Instagram\'s discovery feature that shows personalised content to users based on interests.' },
  ],
  F: [
    { term: 'Follower-to-Following Ratio', def: 'A metric comparing how many accounts follow you vs. how many you follow.' },
    { term: 'Funnel', def: 'The journey a potential customer takes from first discovering you to making a purchase.' },
  ],
  G: [
    { term: 'Growth Hacking', def: 'Rapid experimentation across marketing channels to identify the most efficient ways to grow.' },
    { term: 'Ghost Followers', def: 'Inactive accounts that follow you but never engage with your content.' },
  ],
  H: [
    { term: 'Hashtag', def: 'A word or phrase preceded by # that categorises content and makes it discoverable.' },
    { term: 'Hook', def: 'The opening of a video or post designed to immediately grab attention and prevent scrolling.' },
    { term: 'Hyperlocal Content', def: 'Content targeting a very specific geographic area or community.' },
  ],
  I: [
    { term: 'Impressions', def: 'The total number of times your content has been displayed, including multiple views by the same person.' },
    { term: 'Influencer', def: 'A social media creator with an engaged audience who can affect the purchasing decisions of followers.' },
    { term: 'Instagram Reels', def: 'Short-form vertical videos on Instagram designed for discovery and fast engagement.' },
  ],
  K: [
    { term: 'KPI (Key Performance Indicator)', def: 'A measurable value that indicates how effectively a campaign is achieving objectives.' },
  ],
  L: [
    { term: 'Link in Bio', def: 'A refer to the single clickable URL allowed in most social media profiles.' },
    { term: 'Live Streaming', def: 'Broadcasting video content in real-time to your followers.' },
  ],
  M: [
    { term: 'Micro-Influencer', def: 'A creator with 10K–100K followers who typically has higher engagement rates than larger accounts.' },
    { term: 'Meme Marketing', def: 'Using viral meme formats to promote a brand or message in a relatable, shareable way.' },
  ],
  N: [
    { term: 'Niche', def: 'A specific, focused topic or audience segment a creator or brand focuses their content around.' },
    { term: 'Nano-Influencer', def: 'Creators with under 10K followers, known for very high engagement and tight-knit communities.' },
  ],
  O: [
    { term: 'Organic Reach', def: 'The number of people who see your content without paid promotion.' },
    { term: 'Owned Media', def: 'Content channels you fully control, like your website, email list, and social profiles.' },
  ],
  R: [
    { term: 'Reach', def: 'The number of unique accounts that have seen your content.' },
    { term: 'Repurposing', def: 'Taking existing content and adapting it for different platforms or formats.' },
    { term: 'ROI (Return on Investment)', def: 'The profitability metric comparing revenue earned to money spent on a campaign.' },
  ],
  S: [
    { term: 'Shadowban', def: 'When a platform suppresses your content visibility without notifying you.' },
    { term: 'Social Proof', def: 'Evidence like follower counts, reviews, or testimonials that builds trust.' },
    { term: 'Stories', def: 'Vertical, temporary content on platforms like Instagram and Facebook that disappears after 24 hours.' },
  ],
  U: [
    { term: 'UGC (User-Generated Content)', def: 'Content created by your audience or customers rather than your brand.' },
    { term: 'UTM Parameters', def: 'Tags added to URLs to track the source of web traffic in analytics tools.' },
  ],
  V: [
    { term: 'Viral Content', def: 'Content that spreads rapidly across the internet due to high organic sharing.' },
    { term: 'Video SEO', def: 'Optimising video titles, descriptions, and tags to appear in search results.' },
  ],
};

const LETTERS = Object.keys(TERMS).sort();

export default function SocialMediaGlossaryPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-4 inline-block">📖 Glossary</span>
          <h1 className="text-5xl font-black text-white mb-4">Social Media Glossary</h1>
          <p className="text-slate-400 text-xl">The definitive A-Z dictionary of social media marketing terms, acronyms, and creator economy vocabulary.</p>
        </div>
      </section>

      {/* Alphabet nav */}
      <section className="py-4 px-4 sm:px-6 sticky top-16 z-30 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap gap-1 justify-center">
          {LETTERS.map(l => (
            <a key={l} href={`#letter-${l}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              {l}
            </a>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {LETTERS.map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="text-4xl font-black gradient-text mb-6">{letter}</h2>
              <div className="space-y-3">
                {TERMS[letter].map(t => (
                  <div key={t.term} className="card p-5">
                    <h3 className="text-white font-bold mb-1">{t.term}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t.def}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
