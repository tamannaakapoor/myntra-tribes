'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Heart, Bookmark, ThumbsUp, Flame, Zap } from 'lucide-react';

// Reusable Mini Avatar for Feed Cards
function MiniAvatar2D({ skinTone, hairStyle }: { skinTone: string, hairStyle: string }) {
  return (
    <svg viewBox="0 0 200 300" className="w-12 h-20 drop-shadow-sm absolute bottom-4 right-4 z-10">
      <defs>
        <linearGradient id="miniDress" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4d79" /><stop offset="100%" stopColor="#ff99b3" />
        </linearGradient>
      </defs>
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && (
        <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />
      )}
      <rect x="85" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <rect x="105" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <ellipse cx="90" cy="285" rx="12" ry="7" fill="#ff99b3" />
      <ellipse cx="110" cy="285" rx="12" ry="7" fill="#ff99b3" />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill="url(#miniDress)" />
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />
    </svg>
  );
}

// 9 Highly Curated Lookbooks with Indian Creators & 3 Tribes
const FEED_MOCK = [
  {
    id: 1, title: "Sun-Kissed Silks", handle: "@ananya_style", pieces: 4,
    desc: "Draped in golden hour glow. Effortless sunset energy.",
    tribe: "Golden Hour", likes: 84, loves: 241, saves: 45, skin: "#C29270", hair: "Long",
    images: ["https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400&auto=format&fit=crop"]
  },
  {
    id: 2, title: "Midnight Cyber", handle: "@kavya_neon", pieces: 5,
    desc: "Holographic textures and dark streets. Main character activated.",
    tribe: "Neon Static", likes: 112, loves: 305, saves: 89, skin: "#8A5A44", hair: "Bob",
    images: ["https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop"]
  },
  {
    id: 3, title: "Vintage Archive", handle: "@priya_y2k", pieces: 3,
    desc: "Rifling through the 90s archive. Denim on denim.",
    tribe: "Vault Heir", likes: 67, loves: 189, saves: 32, skin: "#F3D9C6", hair: "Long",
    images: ["https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1632996547902-064471618ef0?q=80&w=400&auto=format&fit=crop"]
  },
  {
    id: 4, title: "Ethereal Morning", handle: "@sneha_vibes", pieces: 4,
    desc: "Soft linen and warm light to start the day.",
    tribe: "Golden Hour", likes: 95, loves: 210, saves: 56, skin: "#4A2E2B", hair: "Bun",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=600&auto=format&fit=crop"]
  },
  {
    id: 5, title: "Electric Pulse", handle: "@ishita_fits", pieces: 6,
    desc: "High contrast, high energy. Built for the underground.",
    tribe: "Neon Static", likes: 156, loves: 420, saves: 112, skin: "#C29270", hair: "Long",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"]
  },
  {
    id: 6, title: "Heirloom Denim", handle: "@riya_retro", pieces: 3,
    desc: "Bringing back the 2000s silhouettes. Low rise only.",
    tribe: "Vault Heir", likes: 78, loves: 145, saves: 28, skin: "#8A5A44", hair: "Bob",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=400&auto=format&fit=crop"]
  },
  {
    id: 7, title: "Sunday Chai", handle: "@meera_glow", pieces: 3,
    desc: "Cozy knits and reading by the window. Pure peace.",
    tribe: "Golden Hour", likes: 110, loves: 340, saves: 88, skin: "#F5D0C5", hair: "Curly",
    images: ["https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1560857617-84149b7abe53?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
  },
  {
    id: 8, title: "Acid Rain", handle: "@tara_cyber", pieces: 5,
    desc: "Streetwear that reflects the city lights. Unapologetic.",
    tribe: "Neon Static", likes: 189, loves: 501, saves: 140, skin: "#C29270", hair: "Bob",
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1563630381190-77c336ea545a?q=80&w=400&auto=format&fit=crop"]
  },
  {
    id: 9, title: "Flip Phone Era", handle: "@naina_vault", pieces: 4,
    desc: "Cargo pants and tiny sunglasses. We are so back.",
    tribe: "Vault Heir", likes: 92, loves: 160, saves: 41, skin: "#F3D9C6", hair: "Long",
    images: ["https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop"]
  }
];

const TRIBES = ["All Tribes", "✨ Golden Hour", "🔥 Neon Static", "🦋 Vault Heir"];

export default function FeedPage() {
  const router = useRouter();
  const [activeTribe, setActiveTribe] = useState("All Tribes");

  // 👇 FIXED: Foolproof filtering using .includes() instead of regex!
  const filteredFeed = activeTribe === "All Tribes" 
    ? FEED_MOCK 
    : FEED_MOCK.filter(look => activeTribe.includes(look.tribe));

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-[#ff3f6c]/20">M</div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="text-[#666666] hover:text-black">Home</button>
            <button className="px-4 py-2 bg-black/5 rounded-full font-bold">Feed</button>
            <button onClick={() => router.push('/leaderboard')} className="text-[#666666] hover:text-black">Leaderboard</button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] shadow-md shadow-[#ff3f6c]/20">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#ff3f6c] uppercase mb-2">Creator Feed</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>The Tribes runway</h1>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-[#FBCFE8]/50 shadow-sm">
            <button className="px-4 py-2 rounded-full bg-[#ff3f6c] text-white text-sm font-bold flex items-center gap-2"><Flame className="w-4 h-4"/> Trending</button>
            <button className="px-4 py-2 rounded-full text-[#666666] hover:text-black text-sm font-bold flex items-center gap-2"><Zap className="w-4 h-4"/> New</button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
          {TRIBES.map(t => (
            <button 
              key={t} onClick={() => setActiveTribe(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border shadow-sm ${
                activeTribe === t ? 'bg-[#ff3f6c] text-white border-[#ff3f6c]' : 'bg-white text-[#111111] border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Lookbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeed.map((look) => (
            <div key={look.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#FBCFE8]/30 group cursor-pointer">
              {/* Image Collage with mini avatar overlay */}
              <div className="h-[320px] w-full bg-gradient-to-tr from-[#ff99b3] to-[#FBCFE8] p-2 flex gap-2 relative">
                <div className="w-1/2 h-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${look.images[0]}')` }} />
                <div className="w-1/2 h-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${look.images[1]}')` }} />
                <MiniAvatar2D skinTone={look.skin} hairStyle={look.hair} />
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{look.title}</h3>
                <p className="text-xs text-[#888888] mb-3">{look.handle} • {look.pieces} pieces</p>
                <p className="text-[#666666] text-sm mb-5 leading-relaxed">{look.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[#888888] text-sm font-medium">
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><ThumbsUp className="w-4 h-4" /> {look.likes}</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Heart className="w-4 h-4" /> {look.loves}</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Bookmark className="w-4 h-4" /> {look.saves}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] px-2 py-1 rounded-md">{look.tribe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}