'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTribeStore, ThemeConfig, TribeType } from '@/store/useTribeStore';
import { Sparkles, ArrowRight } from 'lucide-react';

// --- TRIBE DATA WITH IMAGES ---
const TRIBES = {
  'neon-static': {
    name: 'Neon Static',
    slug: 'neon-static' as TribeType,
    description: 'Cyberpunk × Y2K fusion with glitch aesthetics',
    colors: ['#8A2BE2', '#39FF14'],
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
    config: { font: "Orbitron", mode: "dark", text: "#FFFFFF", accent: "#39FF14", primary: "#8A2BE2", surface: "#1A1A1A", cardStyle: "glass", secondary: "#39FF14", background: "#0B0B0B", buttonStyle: "neon", bannerAnimation: "glitch" } as ThemeConfig
  },
  'golden-hour': {
    name: 'Golden Hour',
    slug: 'golden-hour' as TribeType,
    description: 'Cottagecore × Soft Girl fusion',
    colors: ['#F5E6CC', '#C97B63'],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    config: { font: "Playfair Display", mode: "light", text: "#4B3A2F", accent: "#A3B18A", primary: "#F5E6CC", surface: "#FFFFFF", cardStyle: "soft", secondary: "#C97B63", background: "#FFF8EE", buttonStyle: "rounded", bannerAnimation: "fade" } as ThemeConfig
  },
  'vault-heir': {
    name: 'Vault Heir',
    slug: 'vault-heir' as TribeType,
    description: 'Old Money × Quiet Luxury',
    colors: ['#1F3A5F', '#D2B48C'],
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop',
    config: { font: "Cormorant Garamond", mode: "light", text: "#1F3A5F", accent: "#355070", primary: "#1F3A5F", surface: "#F8F8F8", cardStyle: "outline", secondary: "#D2B48C", background: "#FFFFFF", buttonStyle: "minimal", bannerAnimation: "slide" } as ThemeConfig
  }
};

const QUESTION_IMAGES: Record<string, string> = {
  weekend: 'https://images.unsplash.com/photo-1563804447971-6e113ab80713?q=80&w=1200&auto=format&fit=crop',
  colors: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
  vacation: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop',
  room: 'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?q=80&w=1200&auto=format&fit=crop',
  accessory: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop',
};

const FALLBACK_QUESTIONS = [
  { id: 1, key: "weekend", question: "What's your ideal weekend?", options: ["Neon city nightlife", "Picnic in nature", "Brunch at a luxury club"] },
  { id: 2, key: "colors", question: "Which color palette attracts you most?", options: ["Purple & Green", "Cream & Sage", "Navy & Beige"] },
  { id: 3, key: "shoes", question: "Pick your favorite footwear", options: ["Chunky Sneakers", "Sandals", "Loafers"] },
  { id: 4, key: "vacation", question: "Choose your dream vacation", options: ["Tokyo", "Swiss Countryside", "Monaco"] },
  { id: 5, key: "room", question: "Your room aesthetic?", options: ["LED lights", "Plants & Wood", "Minimal Luxury"] },
  { id: 6, key: "accessory", question: "Pick an accessory", options: ["Silver Chains", "Straw Hat", "Luxury Watch"] }
];

export default function OnboardingPage() {
  const router = useRouter();
  const setTribe = useTribeStore((state) => state.setTribe);
  
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [showManual, setShowManual] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  
  // NEW: Store the revealed tribe before routing
  const [revealedTribe, setRevealedTribe] = useState<typeof TRIBES['neon-static'] | null>(null);

  // Use live API url or fallback to localhost if not set in Vercel yet
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/quiz/questions`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.questions.length > 0) {
            setQuestions(data.questions);
          }
        }
      } catch (error) {
        console.warn("Backend not reachable, using fallback questions.");
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = async (questionKey: string, selectedOption: string) => {
    const newAnswers = { ...answers, [questionKey]: selectedOption };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      await submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setIsCalculating(true);
    let finalSlug: keyof typeof TRIBES = 'neon-static';

    try {
      const res = await fetch(`${API_URL}/tribes/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }) // Wrapped in answers object just in case
      });
      
      if (res.ok) {
        const data = await res.json();
        // Bulletproof parsing of backend response
        finalSlug = data?.assignedTribe?.slug || data?.tribe?.slug || data?.slug || 'neon-static';
      } else {
        throw new Error("API failed, falling back to local calculation");
      }
    } catch (error) {
      // BULLETPROOF FALLBACK: If API fails or structures mismatch, we calculate it perfectly here.
      const counts = { 'neon-static': 0, 'golden-hour': 0, 'vault-heir': 0 };
      Object.values(finalAnswers).forEach(ans => {
        if (ans.includes('Neon') || ans.includes('Purple') || ans.includes('Sneakers') || ans.includes('Tokyo') || ans.includes('LED') || ans.includes('Silver')) counts['neon-static']++;
        else if (ans.includes('nature') || ans.includes('Cream') || ans.includes('Sandals') || ans.includes('Swiss') || ans.includes('Plants') || ans.includes('Straw')) counts['golden-hour']++;
        else counts['vault-heir']++;
      });
      
      finalSlug = (Object.keys(counts).reduce((a, b) => counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b) as keyof typeof TRIBES);
    }

    // Keep the calculation spinner for 2 seconds for dramatic effect
    await new Promise(r => setTimeout(r, 2000));
    
    setIsCalculating(false);
    
    // Trigger the Reveal Screen!
    setRevealedTribe(TRIBES[finalSlug] || TRIBES['neon-static']);
  };

  // If chosen manually, skip the reveal and go straight to builder!
  const manuallyAssignTribe = (slug: keyof typeof TRIBES) => {
    const selected = TRIBES[slug];
    setTribe(selected.slug, selected.config);
    router.push('/builder');
  };

  // The final step from the reveal screen
  const acceptTribeAndContinue = () => {
    if (!revealedTribe) return;
    setTribe(revealedTribe.slug, revealedTribe.config);
    router.push('/builder');
  };

  if (isLoadingQuestions) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#ff3f6c] rounded-full animate-spin" />
      </main>
    );
  }

  // --- REVEAL SCREEN ---
  if (revealedTribe) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Tribe specific background fade */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: `url(${revealedTribe.image})` }}
        />
        
        {/* Tribe specific gradient overlay */}
        <div 
          className="absolute inset-0 opacity-80 mix-blend-overlay"
          style={{ background: `linear-gradient(135deg, ${revealedTribe.colors[0]}, ${revealedTribe.colors[1]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="z-10 text-center flex flex-col items-center"
        >
          <Sparkles className="w-12 h-12 mb-6" style={{ color: revealedTribe.colors[1] }} />
          <h3 className="text-white/60 font-bold tracking-[0.3em] uppercase text-sm mb-4">Your Aesthetic Is</h3>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
            {revealedTribe.name}
          </h1>
          <p className="text-xl text-white/80 max-w-md mx-auto mb-12">
            {revealedTribe.description}
          </p>

          <button 
            onClick={acceptTribeAndContinue}
            className="px-10 py-5 rounded-full font-bold text-lg tracking-wide transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
            style={{ backgroundColor: revealedTribe.colors[0], color: revealedTribe.colors[0] === '#1F3A5F' ? '#FFFFFF' : '#000000' }}
          >
            Enter the Studio <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </main>
    );
  }

  // --- MANUAL OVERRIDE VIEW ---
  if (showManual) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
        <button 
          onClick={() => setShowManual(false)}
          className="absolute top-8 left-8 opacity-50 hover:opacity-100 transition-opacity font-bold tracking-widest text-xs uppercase z-20"
        >
          ← Back to Quiz
        </button>

        <div className="z-10 text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Choose Your <span className="text-[#ff3f6c]">Aesthetic</span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto">Select your vibe manually to instantly reskin the studio and begin curating your looks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full z-10">
          {Object.values(TRIBES).map((tribe) => (
            <button
              key={tribe.slug}
              onClick={() => manuallyAssignTribe(tribe.slug as keyof typeof TRIBES)}
              className="group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 text-left"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${tribe.image})` }}
              />
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 mix-blend-overlay"
                style={{ background: `linear-gradient(135deg, ${tribe.colors[0]}, ${tribe.colors[1]})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              
              <div className="relative h-full flex flex-col justify-end p-8">
                <Sparkles className="w-8 h-8 mb-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500" style={{ color: tribe.colors[1] }} />
                <h3 className="text-3xl font-black tracking-tight mb-2">{tribe.name}</h3>
                <p className="text-sm text-white/70">{tribe.description}</p>
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
        <h2 className="text-2xl font-bold tracking-widest uppercase animate-pulse">Calculating Vibe...</h2>
      </main>
    );
  }

  // --- INTERACTIVE QUIZ VIEW ---
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const bgImage = QUESTION_IMAGES[currentQ.key] || QUESTION_IMAGES['weekend']; 

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.key}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#ff3f6c] to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="w-full max-w-2xl z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col space-y-10"
          >
            
            <div className="text-center space-y-4">
              <span className="text-[#ff3f6c] font-bold tracking-widest text-xs uppercase drop-shadow-md">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
                {currentQ.question}
              </h2>
            </div>

            <div className="flex flex-col space-y-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(currentQ.key, option)}
                  className="w-full p-6 rounded-2xl bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 text-white font-medium text-xl hover:bg-white/10 hover:border-[#ff3f6c]/50 transition-all duration-300 flex items-center justify-between group shadow-xl"
                >
                  {option}
                  <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#ff3f6c]" />
                </button>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 z-20">
        <button 
          onClick={() => setShowManual(true)}
          className="text-white/40 hover:text-white transition-colors text-sm font-semibold tracking-widest uppercase"
        >
          Skip & Choose Manually
        </button>
      </div>
    </main>
  );
}