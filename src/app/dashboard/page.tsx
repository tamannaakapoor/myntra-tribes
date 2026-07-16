'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Trophy, LogOut, Plus, Sparkles, Flame, Droplets, 
  Heart, Bookmark, ThumbsUp, Palette, Image as ImageIcon, Wand2
} from 'lucide-react';

// --- FIXED NAV MINI AVATAR ---
// Uses the exact same code as your Persona Studio, but zoomed in on the face!
function NavAvatar({ skinTone, hairStyle }: { skinTone: string, hairStyle: string }) {
  return (
    <svg viewBox="40 20 120 120" className="w-full h-full pt-2 drop-shadow-sm">
      {/* Hair (Back Layer) */}
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && (
        <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />
      )}

      {/* Neck & Shoulders */}
      <rect x="92" y="110" width="16" height="20" fill={skinTone} />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill="#ff4d79" />

      {/* Head */}
      <circle cx="100" cy="80" r="38" fill={skinTone} />

      {/* Face Details */}
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <circle cx="72" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <circle cx="128" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <path d="M 92 92 Q 100 100 108 92" stroke="#ff4d79" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />

      {/* Hair (Front Bangs) */}
      {hairStyle !== 'Buzz' && (
        <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />
      )}
      {hairStyle === 'Buzz' && (
        <path d="M 62 80 A 38 38 0 0 1 138 80 A 40 40 0 0 0 62 80 Z" fill="#2C1B18" opacity="0.8" />
      )}
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  
  const [avatarConfig, setAvatarConfig] = useState({
    skin_color: '#E0B594',
    hair: 'Long'
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";

  useEffect(() => {
    const userStr = localStorage.getItem('tribe_user');
    const token = localStorage.getItem('tribe_jwt');

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.username || user.name) setUsername(user.username || user.name);
      } catch (e) {}
    }

    const fetchAvatar = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/avatar/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.avatar) {
          setAvatarConfig(data.avatar);
        }
      } catch (error) {
        console.warn("Could not fetch avatar for navbar.");
      }
    };

    fetchAvatar();
  }, [API_URL]);

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans relative overflow-x-hidden pb-20">
      
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#ff3f6c]/15 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-[#ff3f6c]/20">
              M
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-black/5 rounded-full font-bold">
              Home
            </button>
            <button onClick={() => router.push('/feed')} className="text-[#666666] hover:text-black transition-colors">
              Feed
            </button>
            <button onClick={() => router.push('/leaderboard')} className="text-[#666666] hover:text-black transition-colors">
              Leaderboard
            </button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] transition-colors shadow-md shadow-[#ff3f6c]/20">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#ff3f6c]/10 text-[#ff3f6c] px-4 py-2 rounded-full font-bold text-sm">
              <Trophy className="w-4 h-4" /> 0 pts
            </div>
            
            {/* 👇 AVATAR BUTTON */}
            <button 
              onClick={() => router.push('/persona')}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ring-2 ring-transparent hover:ring-[#ff3f6c]/30"
              style={{ backgroundColor: `${avatarConfig.skin_color}40` }}
            >
               <NavAvatar skinTone={avatarConfig.skin_color} hairStyle={avatarConfig.hair} />
            </button>

            <button onClick={() => router.push('/auth')} className="text-[#888888] hover:text-black transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-32 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-3xl mb-24">
          <p className="text-[11px] font-bold tracking-[0.25em] text-[#ff3f6c] uppercase mb-6 flex items-center gap-2">
            Welcome{username ? `, ${username}` : ''} <span className="text-[#888888]">• Myntra Tribes</span>
          </p>
          
          <h1 className="text-6xl md:text-[80px] font-bold leading-[1.05] mb-8 tracking-tight text-[#111111]" style={{ fontFamily: 'Georgia, serif' }}>
            Find your <span className="text-[#ff3f6c] italic">tribe</span>.<br/>
            Build your <span className="text-[#111111] italic">look</span>.<br/>
            Become a <span className="text-[#ff3f6c] italic">creator</span>.
          </h1>
          
          <p className="text-lg text-[#666666] max-w-xl mb-10 leading-relaxed">
            Take a 60-second vibe quiz. Watch the entire app transform to match your aesthetic. Then start publishing lookbooks and climb the creator leaderboard.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => router.push('/onboarding')} className="bg-[#ff3f6c] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] transition-all shadow-lg shadow-[#ff3f6c]/20 hover:-translate-y-0.5">
              <Wand2 className="w-5 h-5" /> Take the Vibe Quiz
            </button>
            
            <button 
              onClick={() => router.push('/builder')}
              className="bg-transparent border-2 border-[#ff3f6c]/20 text-[#ff3f6c] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#ff3f6c]/5 transition-all"
            >
              <ImageIcon className="w-5 h-5" /> Build a Lookbook
            </button>
          </div>
        </section>

        {/* --- TRIBES SHOWCASE --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl">✨</div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Golden Hour</h3>
                <p className="text-white/80 text-sm">Effortless. Elevated. Ethereal.</p>
              </div>
            </div>

            <div className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl">🔥</div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Neon Static</h3>
                <p className="text-white/80 text-sm">Concrete jungle royalty.</p>
              </div>
            </div>

            <div className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl">🦋</div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Vault Heir</h3>
                <p className="text-white/80 text-sm">Millennium bug, upgraded.</p>
              </div>
            </div>

          </div>
        </section>

        {/* --- LIVE LEADERBOARD --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#888888] uppercase mb-2">Top Creators This Week</p>
              <h2 className="text-4xl font-bold text-[#111111]" style={{ fontFamily: 'Georgia, serif' }}>Live Leaderboard</h2>
            </div>
            <button onClick={() => router.push('/leaderboard')} className="text-[#ff3f6c] font-bold text-sm hover:underline">See all &gt;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#FBCFE8]/30 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#8A2BE2] to-[#39FF14] flex items-end justify-center overflow-hidden shadow-inner">
                  <div className="w-8 h-10 bg-[#E0B594] rounded-t-full relative"><div className="absolute top-0 w-full h-4 bg-[#2C1B18] rounded-t-full" /></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>Kavya</h4>
                  <p className="text-xs text-[#888888] mb-1">@kavya_neon</p>
                  <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] px-2 py-1 rounded-md">🔮 Fashion Oracle</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black text-[#FBCFE8]">#1</h3>
                <p className="font-bold text-[#ff3f6c]">1240 <span className="text-[10px] text-[#888888] font-normal">points</span></p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#FBCFE8]/30 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#ff4d79] to-[#ff99b3] flex items-end justify-center overflow-hidden shadow-inner">
                  <div className="w-8 h-10 bg-[#C29270] rounded-t-full relative"><div className="absolute top-0 w-full h-4 bg-[#0a0a0a] rounded-t-full" /></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>Ananya</h4>
                  <p className="text-xs text-[#888888] mb-1">@ananya_style</p>
                  <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] px-2 py-1 rounded-md">👑 Style Icon</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black text-[#FBCFE8]">#2</h3>
                <p className="font-bold text-[#ff3f6c]">1180 <span className="text-[10px] text-[#888888] font-normal">points</span></p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#FBCFE8]/30 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#D2B48C] to-[#F5E6CC] flex items-end justify-center overflow-hidden shadow-inner">
                  <div className="w-8 h-10 bg-[#F3D9C6] rounded-t-full relative"><div className="absolute top-0 w-full h-5 bg-[#E5C07B] rounded-t-full" /></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>Priya</h4>
                  <p className="text-xs text-[#888888] mb-1">@priya_y2k</p>
                  <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] px-2 py-1 rounded-md">💫 Trendsetter</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black text-[#FBCFE8]">#3</h3>
                <p className="font-bold text-[#ff3f6c]">950 <span className="text-[10px] text-[#888888] font-normal">points</span></p>
              </div>
            </div>

          </div>
        </section>

        {/* --- FEATURED LOOKBOOKS --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#888888] uppercase mb-2">Editorial Picks</p>
              <h2 className="text-4xl font-bold text-[#111111]" style={{ fontFamily: 'Georgia, serif' }}>Featured Lookbooks</h2>
            </div>
            <button onClick={() => router.push('/feed')} className="text-[#ff3f6c] font-bold text-sm hover:underline">Explore feed &gt;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div onClick={() => router.push('/feed')} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-[#FBCFE8]/30 group cursor-pointer hover:shadow-xl transition-all">
              <div className="h-[300px] w-full bg-gradient-to-r from-[#8A2BE2] to-[#39FF14] p-2 flex gap-2">
                <div className="w-1/2 h-full rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=600&auto=format&fit=crop')" }} />
                <div className="w-1/2 h-full rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop')" }} />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Midnight Cyber</h3>
                <p className="text-xs text-[#888888] mb-4">@kavya_neon • 5 pieces</p>
                <p className="text-[#666666] text-sm mb-6">Holographic textures and dark streets. Main character activated.</p>
                <div className="flex items-center justify-between border-t border-[#FBCFE8]/30 pt-4">
                  <div className="flex items-center gap-4 text-[#888888] text-sm font-medium">
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><ThumbsUp className="w-4 h-4" /> 112</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Heart className="w-4 h-4" /> 305</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Bookmark className="w-4 h-4" /> 89</span>
                  </div>
                  <button className="text-[#ff3f6c] font-bold text-sm">View</button>
                </div>
              </div>
            </div>

            <div onClick={() => router.push('/feed')} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-[#FBCFE8]/30 group cursor-pointer hover:shadow-xl transition-all">
              <div className="h-[300px] w-full bg-gradient-to-r from-[#D2B48C] to-[#F5E6CC] p-2 flex gap-2">
                <div className="w-1/2 h-full rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=687&auto=format&fit=crop')" }} />
                <div className="w-1/2 h-full rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop')" }} />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Sun-Kissed Silks</h3>
                <p className="text-xs text-[#888888] mb-4">@ananya_style • 4 pieces</p>
                <p className="text-[#666666] text-sm mb-6">Draped in golden hour glow. Effortless sunset energy.</p>
                <div className="flex items-center justify-between border-t border-[#FBCFE8]/30 pt-4">
                  <div className="flex items-center gap-4 text-[#888888] text-sm font-medium">
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><ThumbsUp className="w-4 h-4" /> 84</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Heart className="w-4 h-4" /> 241</span>
                    <span className="flex items-center gap-1 hover:text-[#ff3f6c]"><Bookmark className="w-4 h-4" /> 45</span>
                  </div>
                  <button className="text-[#ff3f6c] font-bold text-sm">View</button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- APP FEATURES --- */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#FBCFE8]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#FFF5F8] text-[#ff3f6c] rounded-xl flex items-center justify-center mb-6"><Wand2 className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Vibe Quiz</h3>
              <p className="text-sm text-[#666666]">Swipe your way to your aesthetic in 60s.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#FBCFE8]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#FFF5F8] text-[#ff3f6c] rounded-xl flex items-center justify-center mb-6"><Palette className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Reskin Engine</h3>
              <p className="text-sm text-[#666666]">The app rethemes to match YOU.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#FBCFE8]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#FFF5F8] text-[#ff3f6c] rounded-xl flex items-center justify-center mb-6"><ImageIcon className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Lookbook Builder</h3>
              <p className="text-sm text-[#666666]">Drag, drop, publish. Editorial-grade.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#FBCFE8]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#FFF5F8] text-[#ff3f6c] rounded-xl flex items-center justify-center mb-6"><Trophy className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Creator Leaderboard</h3>
              <p className="text-sm text-[#666666]">Votes → Points → Badges → Fame.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}