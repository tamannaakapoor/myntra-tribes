'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTribeStore, ThemeConfig, TribeType } from '@/store/useTribeStore';
import { Sparkles, ArrowRight } from 'lucide-react';

// --- TRIBE DATA (For Manual Bypass) ---
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

// Fallback questions in case the backend API isn't live on Vercel yet
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

  // 1. Fetch Questions from Aditi's Backend on Mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/questions`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.questions.length > 0) {
            setQuestions(data.questions);
          }
        }
      } catch (error) {
        console.warn("Backend not reachable, using fallback questions for UI testing.");
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. Handle Option Selection
  const handleOptionSelect = async (questionKey: string, selectedOption: string) => {
    const newAnswers = { ...answers, [questionKey]: selectedOption };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      await submitQuiz(newAnswers);
    }
  };

  // 3. Submit Answers to Assign Tribe API
  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setIsCalculating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tribes/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers)
      });
      
      let assignedTribe;

      if (res.ok) {
        const data = await res.json();
        assignedTribe = data.assignedTribe;
      } else {
        // Mock calculation if API fails
        await new Promise(r => setTimeout(r, 1500));
        assignedTribe = TRIBES['neon-static'].config; // default fallback
      }

      setTribe(assignedTribe.slug, assignedTribe.theme_config || assignedTribe);
      router.push('/builder');

    } catch (error) {
      console.error("Assignment failed", error);
      // Fallback
      setTribe('neon-static', TRIBES['neon-static'].config);
      router.push('/builder');
    }
  };

  const manuallyAssignTribe = (slug: keyof typeof TRIBES) => {
    const selected = TRIBES[slug];
    setTribe(selected.slug, selected.config);
    router.push('/builder');
  };

  // --- LOADING VIEW ---
  if (isLoadingQuestions) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#ff3f6c] rounded-full animate-spin" />
      </main>
    );
  }

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
        <h2 className="text-2xl font-bold tracking-widest uppercase animate-pulse">Calculating Vibe...</h2>
      </main>
    );
  }

  // --- INTERACTIVE QUIZ VIEW ---
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#ff3f6c]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#ff3f6c] to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            
            <div className="text-center space-y-3">
              <span className="text-[#ff3f6c] font-bold tracking-widest text-xs uppercase">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {currentQ.question}
              </h2>
            </div>

            <div className="flex flex-col space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(currentQ.key, option)}
                  className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 hover:border-[#ff3f6c]/50 transition-all flex items-center justify-between group"
                >
                  {option}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#ff3f6c]" />
                </button>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 z-10">
        <button 
          onClick={() => setShowManual(true)}
          className="text-white/40 hover:text-white transition-colors text-sm font-semibold tracking-wide uppercase"
        >
          Skip & Choose Manually
        </button>
      </div>
    </main>
  );
}