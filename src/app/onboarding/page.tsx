'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTribeStore, ThemeConfig, TribeType } from '@/store/useTribeStore';
import { X, Heart, Sparkles } from 'lucide-react';

// --- TRIBE DATA (From Aditi's DB Snippet) ---
const TRIBES = {
  'neon-static': {
    name: 'Neon Static',
    slug: 'neon-static' as TribeType,
    description: 'Cyberpunk × Y2K fusion with glitch aesthetics',
    colors: ['#8A2BE2', '#39FF14'],
    config: { font: "Orbitron", mode: "dark", text: "#FFFFFF", accent: "#39FF14", primary: "#8A2BE2", surface: "#1A1A1A", cardStyle: "glass", secondary: "#39FF14", background: "#0B0B0B", buttonStyle: "neon", bannerAnimation: "glitch" } as ThemeConfig
  },
  'golden-hour': {
    name: 'Golden Hour',
    slug: 'golden-hour' as TribeType,
    description: 'Cottagecore × Soft Girl fusion',
    colors: ['#F5E6CC', '#C97B63'],
    config: { font: "Playfair Display", mode: "light", text: "#4B3A2F", accent: "#A3B18A", primary: "#F5E6CC", surface: "#FFFFFF", cardStyle: "soft", secondary: "#C97B63", background: "#FFF8EE", buttonStyle: "rounded", bannerAnimation: "fade" } as ThemeConfig
  },
  'vault-heir': {
    name: 'Vault Heir',
    slug: 'vault-heir' as TribeType,
    description: 'Old Money × Quiet Luxury',
    colors: ['#1F3A5F', '#D2B48C'],
    config: { font: "Cormorant Garamond", mode: "light", text: "#1F3A5F", accent: "#355070", primary: "#1F3A5F", surface: "#F8F8F8", cardStyle: "outline", secondary: "#D2B48C", background: "#FFFFFF", buttonStyle: "minimal", bannerAnimation: "slide" } as ThemeConfig
  }
};

// --- MOODBOARD IMAGES ---
const CARDS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop', tribe: 'neon-static' },
  { id: 2, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', tribe: 'golden-hour' },
  { id: 3, url: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop', tribe: 'vault-heir' },
  { id: 4, url: 'https://images.unsplash.com/photo-1616091093714-c64882e9ab55?q=80&w=800&auto=format&fit=crop', tribe: 'neon-static' },
  { id: 5, url: 'https://images.unsplash.com/photo-1492447105260-2e947425b5cc?q=80&w=800&auto=format&fit=crop', tribe: 'golden-hour' },
  { id: 6, url: 'https://images.unsplash.com/photo-1578939700101-8bf77d3f2719?q=80&w=800&auto=format&fit=crop', tribe: 'vault-heir' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const setTribe = useTribeStore((state) => state.setTribe);
  
  const [cards, setCards] = useState(CARDS);
  const [scores, setScores] = useState({ 'neon-static': 0, 'golden-hour': 0, 'vault-heir': 0 });
  const [showManual, setShowManual] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Framer Motion Drag Values for the active card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityRight = useTransform(x, [0, 150], [0, 1]);
  const opacityLeft = useTransform(x, [0, -150], [0, 1]);

  const handleSwipe = (direction: 'left' | 'right', tribeSlug: string) => {
    if (direction === 'right') {
      setScores(prev => ({ ...prev, [tribeSlug]: prev[tribeSlug as keyof typeof scores] + 1 }));
    }
    
    setTimeout(() => {
      setCards(prev => prev.slice(1));
    }, 200);
  };

  // Watch for end of quiz
  useEffect(() => {
    if (cards.length === 0 && !showManual && !isCalculating) {
      calculateAndAssignTribe();
    }
  }, [cards.length]);

  const calculateAndAssignTribe = async () => {
    setIsCalculating(true);
    
    // Simulate backend calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find the highest score
    const winningSlug = Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    ) as keyof typeof TRIBES;

    const winner = TRIBES[winningSlug];
    
    // Update Global Zustand State to trigger immediate UI reskin
    setTribe(winner.slug, winner.config);
    
    router.push('/builder');
  };

  const manuallyAssignTribe = (slug: keyof typeof TRIBES) => {
    const selected = TRIBES[slug];
    setTribe(selected.slug, selected.config);
    router.push('/builder');
  };

  // --- MANUAL OVERRIDE VIEW ---
  if (showManual) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
        <button 
          onClick={() => setShowManual(false)}
          className="absolute top-8 left-8 opacity-50 hover:opacity-100 transition-opacity font-bold tracking-widest text-xs uppercase"
        >
          ← Back to Quiz
        </button>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center">
          Choose Your <span className="text-[#ff3f6c]">Aesthetic</span>
        </h1>
        <p className="text-white/50 mb-12 text-center max-w-md">Select your vibe manually to instantly reskin the studio and begin curating your looks.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {Object.values(TRIBES).map((tribe) => (
            <button
              key={tribe.slug}
              onClick={() => manuallyAssignTribe(tribe.slug as keyof typeof TRIBES)}
              className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 text-left"
            >
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${tribe.colors[0]}, ${tribe.colors[1]})` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="relative h-full flex flex-col justify-end p-6">
                <Sparkles className="w-6 h-6 mb-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500" style={{ color: tribe.colors[1] }} />
                <h3 className="text-2xl font-black tracking-tight">{tribe.name}</h3>
                <p className="text-sm text-white/70 mt-1">{tribe.description}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // --- CALCULATING VIEW ---
  if (isCalculating) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#ff3f6c] rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold tracking-widest uppercase animate-pulse">Analyzing Vibe...</h2>
      </main>
    );
  }

  // --- SWIPE QUIZ VIEW ---
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#ff3f6c]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center z-10 mb-8 mt-12">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">What's your vibe?</h1>
        <p className="text-white/50 text-sm mt-2">Swipe Right to Keep, Left to Toss.</p>
      </div>

      {/* The Stack */}
      <div className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center perspective-1000">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === 0;

            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 w-full h-full bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 origin-bottom"
                style={{
                  x: isTop ? x : 0,
                  rotate: isTop ? rotate : 0,
                  scale: isTop ? 1 : 1 - index * 0.04,
                  y: isTop ? 0 : index * -15,
                  zIndex: cards.length - index,
                  backgroundImage: `url(${card.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) handleSwipe('right', card.tribe);
                  else if (info.offset.x < -100) handleSwipe('left', card.tribe);
                }}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: isTop ? 1 : 1 - index * 0.04, opacity: 1, y: isTop ? 0 : index * -15 }}
                exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                
                {/* Swipe Indicators (Heart/X) */}
                {isTop && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center"
                      style={{ opacity: opacityRight }}
                    >
                      <div className="bg-green-500 rounded-full p-6 shadow-2xl scale-150">
                        <Heart className="w-12 h-12 text-white fill-white" />
                      </div>
                    </motion.div>
                    <motion.div 
                      className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center"
                      style={{ opacity: opacityLeft }}
                    >
                      <div className="bg-red-500 rounded-full p-6 shadow-2xl scale-150">
                        <X className="w-12 h-12 text-white stroke-[4px]" />
                      </div>
                    </motion.div>
                  </>
                )}
                
                {/* Image Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="z-10 mt-12 mb-8">
        <button 
          onClick={() => setShowManual(true)}
          className="text-white/40 hover:text-white transition-colors text-sm font-semibold tracking-wide uppercase"
        >
          Know your aesthetic? Choose manually.
        </button>
      </div>
    </main>
  );
}