'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Trophy, LogOut, Plus, Sparkles, ImageIcon, Wand2, ArrowRight, ArrowLeft,
  BookOpen, CheckCircle2, ShieldAlert, Award, Server
} from 'lucide-react';

// --- FIXED NAV MINI AVATAR ---
function NavAvatar({ skinTone, hairStyle }: { skinTone: string, hairStyle: string }) {
  return (
    <svg viewBox="40 20 120 120" className="w-full h-full pt-2 drop-shadow-sm">
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />}
      <rect x="92" y="110" width="16" height="20" fill={skinTone} />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill="#ff4d79" />
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <circle cx="72" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <circle cx="128" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <path d="M 92 92 Q 100 100 108 92" stroke="#ff4d79" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
      {hairStyle !== 'Buzz' && <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />}
      {hairStyle === 'Buzz' && <path d="M 62 80 A 38 38 0 0 1 138 80 A 40 40 0 0 0 62 80 Z" fill="#2C1B18" opacity="0.8" />}
    </svg>
  );
}

export default function AcademyPage() {
  const router = useRouter();
  
  const [avatarConfig, setAvatarConfig] = useState({ skin_color: '#E0B594', hair: 'Long' });
  const [points, setPoints] = useState(500);

  // Separate Navigation State from Completion State
  const [guideStep, setGuideStep] = useState(0); 
  const [isCompleted, setIsCompleted] = useState(false);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;
    return url;
  };

  useEffect(() => {
    // Check local storage for persistent points and completion status
    const savedPoints = localStorage.getItem('tribe_points');
    if (savedPoints) setPoints(Number(savedPoints));

    const completedStatus = localStorage.getItem('academy_completed');
    if (completedStatus === 'true') {
      setIsCompleted(true);
      // We removed the setGuideStep(2) here so the user always starts on page 1 when revisiting!
    }

    // Fetch Avatar
    const token = localStorage.getItem('tribe_jwt');
    const fetchAvatar = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${getApiUrl()}/avatar/me`, { headers: { "Authorization": `Bearer ${token}` } });
        const data = await res.json();
        const avatarData = data.avatar || data.data || data;
        if (res.ok && avatarData && avatarData.skin_color) setAvatarConfig(avatarData);
      } catch (error) {}
    };
    fetchAvatar();
  }, []);

  // --- NAVIGATION CONTROLS ---
  const handleNext = () => {
    if (guideStep < 2) setGuideStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (guideStep > 0) setGuideStep(prev => prev - 1);
  };

  const handleClaimReward = () => {
    // Only add points if they haven't completed it before
    if (!isCompleted) {
      setIsCompleted(true);
      const currentPoints = Number(localStorage.getItem('tribe_points') || 500);
      const newPoints = currentPoints + 100;
      
      localStorage.setItem('tribe_points', newPoints.toString());
      localStorage.setItem('academy_completed', 'true');
      setPoints(newPoints);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans relative overflow-x-hidden pb-20">
      
      {/* Background aesthetic */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#ff3f6c]/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-[#ff3f6c]/20">M</div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="text-[#666666] hover:text-black transition-colors">Home</button>
            <button onClick={() => router.push('/feed')} className="text-[#666666] hover:text-black transition-colors">Feed</button>
            <button onClick={() => router.push('/leaderboard')} className="text-[#666666] hover:text-black transition-colors">Leaderboard</button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] transition-colors shadow-md shadow-[#ff3f6c]/20">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>

          <div className="flex items-center gap-4">
            <motion.div 
              key={points} 
              initial={{ scale: 1.2, backgroundColor: '#4ade80' }} animate={{ scale: 1, backgroundColor: 'rgba(255, 63, 108, 0.1)' }}
              className="hidden sm:flex items-center gap-2 text-[#ff3f6c] px-4 py-2 rounded-full font-bold text-sm transition-colors duration-500"
            >
              <Trophy className="w-4 h-4" /> {points} pts
            </motion.div>
            <button onClick={() => router.push('/persona')} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ring-2 ring-transparent hover:ring-[#ff3f6c]/30" style={{ backgroundColor: `${avatarConfig.skin_color}40` }}>
               <NavAvatar skinTone={avatarConfig.skin_color} hairStyle={avatarConfig.hair} />
            </button>
            <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="text-[#888888] hover:text-black transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 relative z-10">
        
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-sm font-bold text-[#888888] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 overflow-hidden relative shadow-lg border border-[#FBCFE8]/50">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left Column: Progress Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#ff3f6c] mb-4">
                  <span className="bg-[#FFF5F8] p-2 rounded-full"><BookOpen className="w-5 h-5" /></span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">User Guide</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 text-[#111111]" style={{ fontFamily: 'Georgia, serif' }}>
                  Tribe Academy.
                </h2>
                <p className="text-[#666666] text-sm leading-relaxed mb-8">
                  Master the Lookbook builder, understand how our backend curates your feed, and learn how to earn Tribe Points to dominate the leaderboard.
                </p>
              </div>

              {/* Progress Tracker vs Badge */}
              {!isCompleted ? (
                <div className="bg-[#FFF5F8] border border-[#FBCFE8] p-6 rounded-3xl">
                  <div className="flex justify-between text-xs font-bold text-[#888888] mb-3 uppercase tracking-wider">
                    <span>Progress</span>
                    <span className="text-[#ff3f6c]">{Math.round((guideStep / 2) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-4 border border-[#FBCFE8]/50">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(guideStep / 2) * 100}%` }} 
                      className="h-full bg-gradient-to-r from-[#ff3f6c] to-[#ff99b3]"
                    />
                  </div>
                  <p className="text-xs text-[#888888] flex items-center gap-1.5"><Award className="w-4 h-4 text-[#E5C07B]"/> Complete to earn +100 pts</p>
                </div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#f0fdf4] border border-[#4ade80]/30 p-6 rounded-3xl flex items-center gap-4">
                  <CheckCircle2 className="w-10 h-10 text-[#15803d]" />
                  <div>
                    <p className="text-sm font-bold text-[#022c16]">Initiate Badge Unlocked!</p>
                    <p className="text-xs text-[#15803d]">You permanently claimed +100 pts.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Guide Content */}
            <div className="w-full lg:w-2/3">
              <AnimatePresence mode="wait">
                
                {guideStep === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-6"><Sparkles className="w-8 h-8 text-[#E5C07B]"/><h3 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>1. Understand Your Tribe</h3></div>
                    <p className="text-[#666666] mb-8 leading-relaxed">When you take the Vibe Quiz, the Myntra algorithm analyzes your aesthetic and assigns you to one of three elite fashion collectives. The entire app re-themes instantly to match you.</p>
                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><h4 className="font-bold text-[#D2B48C] text-lg mb-1">Golden Hour</h4><p className="text-sm text-[#888888]">Effortless. Elevated. Ethereal. Think sun-kissed silks and minimal sunset energy.</p></div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><h4 className="font-bold text-[#ff3f6c] text-lg mb-1">Neon Static</h4><p className="text-sm text-[#888888]">Concrete jungle royalty. Cyber aesthetics, dark palettes, and bold streetwear silhouettes.</p></div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><h4 className="font-bold text-[#8A2BE2] text-lg mb-1">Vault Heir</h4><p className="text-sm text-[#888888]">Millennium bug, upgraded. Archival Y2K fashion meets modern grunge.</p></div>
                    </div>
                  </motion.div>
                )}

                {guideStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-6"><Server className="w-8 h-8 text-[#ff3f6c]"/><h3 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>2. Smart Curated Editing</h3></div>
                    <p className="text-[#666666] mb-8 leading-relaxed">You don't need to hunt for clothes that fit your vibe. Our backend automatically scrapes and filters the Myntra catalog to only show you items that perfectly match your Tribe.</p>
                    <ul className="space-y-6 text-[#666666]">
                      <li className="flex items-start gap-4"><div className="bg-white p-2 rounded-full shadow-sm"><ShieldAlert className="w-5 h-5 text-[#ff3f6c]" /></div><div><strong className="text-[#111111] block mb-1">The Rule of 5</strong>A true Lookbook is focused. You are strictly limited to selecting a maximum of 5 curated items per post.</div></li>
                      <li className="flex items-start gap-4"><div className="bg-white p-2 rounded-full shadow-sm"><Wand2 className="w-5 h-5 text-[#ff3f6c]" /></div><div><strong className="text-[#111111] block mb-1">Algorithmic Match</strong>You will only see garments mathematically proven to fit your aesthetic.</div></li>
                      <li className="flex items-start gap-4"><div className="bg-white p-2 rounded-full shadow-sm"><ImageIcon className="w-5 h-5 text-[#ff3f6c]" /></div><div><strong className="text-[#111111] block mb-1">Editorial Layout</strong>Select your pieces and let our builder arrange them into a magazine-quality layout ready for publishing.</div></li>
                    </ul>
                  </motion.div>
                )}

                {guideStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-6"><Trophy className="w-8 h-8 text-[#4ade80]"/><h3 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>3. The Points Economy</h3></div>
                    <p className="text-[#666666] mb-8 leading-relaxed">Your clout isn't just for show. High Tribe Points push your profile to the top of the Live Leaderboard. Here is exactly how to earn them:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-white p-6 rounded-2xl text-center border border-[#FBCFE8]/50 shadow-sm">
                        <p className="text-[#ff3f6c] font-black text-3xl mb-1">+500</p>
                        <p className="text-xs text-[#888888] font-bold uppercase">Account Signup</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl text-center border border-[#FBCFE8]/50 shadow-sm">
                        <p className="text-[#E5C07B] font-black text-3xl mb-1">+100</p>
                        <p className="text-xs text-[#888888] font-bold uppercase">Publish Lookbook</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl text-center border border-[#FBCFE8]/50 shadow-sm">
                        <p className="text-[#4ade80] font-black text-3xl mb-1">+10</p>
                        <p className="text-xs text-[#888888] font-bold uppercase">Per Feed Upvote</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#888888] italic bg-white p-4 rounded-xl border border-gray-100">*Spamming low-quality lookbooks will result in community downvotes, strictly deducting points from your account.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- NEW DYNAMIC NAVIGATION BUTTONS --- */}
              <div className="mt-8 flex items-center justify-between w-full">
                
                {/* Previous Button (Hidden on step 0) */}
                {guideStep > 0 ? (
                  <button onClick={handlePrev} className="text-[#888888] hover:text-[#111111] font-bold flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                ) : <div />}

                {/* Next / Finish Buttons */}
                <div>
                  {guideStep < 2 ? (
                    <button 
                      onClick={handleNext} 
                      className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#222222] transition-colors shadow-lg"
                    >
                      Next Chapter <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : !isCompleted ? (
                    <button 
                      onClick={handleClaimReward} 
                      className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#222222] transition-colors shadow-lg"
                    >
                      Claim +100 pts & Finish <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => router.push('/builder')} 
                      className="bg-[#ff3f6c] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] transition-colors shadow-lg shadow-[#ff3f6c]/20"
                    >
                      Start Building Lookbooks <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}