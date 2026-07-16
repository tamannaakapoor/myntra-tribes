'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

// Reusable 2D Avatar mapped for Leaderboard
function LeaderboardAvatar({ skinTone, hairStyle, color1, color2 }: { skinTone: string, hairStyle: string, color1: string, color2: string }) {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-sm shrink-0">
      <defs>
        <linearGradient id={`grad-${color1.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color1} /><stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      <rect x="85" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <rect x="105" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <ellipse cx="90" cy="285" rx="12" ry="7" fill={color2} />
      <ellipse cx="110" cy="285" rx="12" ry="7" fill={color2} />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill={`url(#grad-${color1.slice(1)})`} />
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />
    </svg>
  );
}

// Indian Creators & 3 Tribes Only
const LEADERS_MOCK = [
  { rank: 1, name: "Kavya", handle: "@kavya_neon", tribe: "Neon Static", lookbooks: 5, pts: 1240, badge: "Fashion Oracle", badgeEmoji: "🔮", skin: "#8A5A44", hair: "Bob", c1: "#8A2BE2", c2: "#39FF14" },
  { rank: 2, name: "Ananya", handle: "@ananya_style", tribe: "Golden Hour", lookbooks: 4, pts: 1180, badge: "Fashion Oracle", badgeEmoji: "🔮", skin: "#C29270", hair: "Long", c1: "#ff4d79", c2: "#ff99b3" },
  { rank: 3, name: "Priya", handle: "@priya_y2k", tribe: "Vault Heir", lookbooks: 3, pts: 950, badge: "Style Icon", badgeEmoji: "👑", skin: "#F3D9C6", hair: "Bun", c1: "#D2B48C", c2: "#F5E6CC" },
  { rank: 4, name: "Ishita", handle: "@ishita_fits", tribe: "Neon Static", lookbooks: 6, pts: 680, badge: "Style Icon", badgeEmoji: "👑", skin: "#4A2E2B", hair: "Long", c1: "#FF4500", c2: "#FFA500" },
  { rank: 5, name: "Sneha", handle: "@sneha_vibes", tribe: "Golden Hour", lookbooks: 4, pts: 310, badge: "Trendsetter", badgeEmoji: "💫", skin: "#8A5A44", hair: "Long", c1: "#ff99b3", c2: "#ffffff" },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl">M</div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="text-[#666666] hover:text-black">Home</button>
            <button onClick={() => router.push('/feed')} className="text-[#666666] hover:text-black">Feed</button>
            <button className="px-4 py-2 bg-black/5 rounded-full font-bold">Leaderboard</button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48]">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1000px] mx-auto px-6 pt-32">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#ff3f6c] uppercase mb-2">Creator Leaderboard</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>Fashion's rising stars</h1>
          <p className="text-lg text-[#666666]">Every vote is worth 10 points. Every publish, 20. Climb the ranks.</p>
        </div>

        {/* PODIUM (Top 3) - FIXED OVERLAP */}
        <div className="flex justify-center items-end gap-4 md:gap-8 mt-16 mb-16">
          {/* Rank 2 */}
          <div className="flex flex-col items-center w-1/3">
            <div className="h-32 w-24 mb-2"><LeaderboardAvatar skinTone={LEADERS_MOCK[1].skin} hairStyle={LEADERS_MOCK[1].hair} color1={LEADERS_MOCK[1].c1} color2={LEADERS_MOCK[1].c2} /></div>
            <h3 className="font-bold text-xl font-serif">{LEADERS_MOCK[1].name}</h3>
            <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{LEADERS_MOCK[1].badgeEmoji} {LEADERS_MOCK[1].badge}</p>
            <div className="w-full bg-[#ff99b3] rounded-t-3xl h-[120px] flex items-center justify-center text-white font-black text-4xl shadow-sm">#2</div>
          </div>
          
          {/* Rank 1 */}
          <div className="flex flex-col items-center w-1/3 z-10">
            <div className="h-40 w-28 mb-2"><LeaderboardAvatar skinTone={LEADERS_MOCK[0].skin} hairStyle={LEADERS_MOCK[0].hair} color1={LEADERS_MOCK[0].c1} color2={LEADERS_MOCK[0].c2} /></div>
            <div className="text-2xl mb-1">👑</div>
            <h3 className="font-bold text-2xl font-serif">{LEADERS_MOCK[0].name}</h3>
            <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{LEADERS_MOCK[0].badgeEmoji} {LEADERS_MOCK[0].badge}</p>
            <div className="w-full bg-[#ff4d79] rounded-t-3xl h-[160px] flex items-center justify-center text-white font-black text-5xl shadow-xl">#1</div>
          </div>
          
          {/* Rank 3 */}
          <div className="flex flex-col items-center w-1/3">
            <div className="h-32 w-24 mb-2"><LeaderboardAvatar skinTone={LEADERS_MOCK[2].skin} hairStyle={LEADERS_MOCK[2].hair} color1={LEADERS_MOCK[2].c1} color2={LEADERS_MOCK[2].c2} /></div>
            <h3 className="font-bold text-xl font-serif">{LEADERS_MOCK[2].name}</h3>
            <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{LEADERS_MOCK[2].badgeEmoji} {LEADERS_MOCK[2].badge}</p>
            <div className="w-full bg-[#ffb3c6] rounded-t-3xl h-[100px] flex items-center justify-center text-white font-black text-4xl shadow-sm">#3</div>
          </div>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-4 mb-20">
          {LEADERS_MOCK.map((user, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm border border-[#FBCFE8]/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <span className="text-3xl font-bold text-[#ffb3c6] w-8 text-center">{user.rank}</span>
                <div className="h-20 w-12"><LeaderboardAvatar skinTone={user.skin} hairStyle={user.hair} color1={user.c1} color2={user.c2} /></div>
                <div>
                  <h4 className="font-bold text-xl font-serif">{user.name}</h4>
                  <p className="text-xs text-[#888888]">{user.handle} • {user.tribe} • {user.lookbooks} lookbooks</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[#ff3f6c] font-black text-2xl">{user.pts}</span>
                <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] border border-[#ff3f6c]/20 px-3 py-1 rounded-full flex items-center gap-1">
                  {user.badgeEmoji} {user.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BADGE LADDER */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-8">Badge Ladder</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['🌱 Trend Sprout', '✨ Style Rookie', '💫 Trendsetter', '👑 Style Icon', '🔮 Fashion Oracle'].map((badge, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl flex flex-col items-center text-center shadow-sm border border-[#FBCFE8]/30">
                <span className="text-3xl mb-3">{badge.split(' ')[0]}</span>
                <h4 className="font-bold text-sm mb-1">{badge.split(' ').slice(1).join(' ')}</h4>
                <p className="text-xs text-[#888888]">{[0, 50, 150, 400, 1000][i]}+ pts</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}