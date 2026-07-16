'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTribeStore, ThemeConfig, TribeType } from '@/store/useTribeStore';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

// --- TRIBE DATA ---
const TRIBES = {
  'golden-hour': {
    name: 'Golden Hour',
    slug: 'golden-hour' as TribeType,
    description: 'Effortless. Elevated. Ethereal.',
    emoji: '✨',
    colors: ['#F5E6CC', '#C97B63'],
    image: 'https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    config: { font: "Playfair Display", mode: "light", text: "#4B3A2F", accent: "#A3B18A", primary: "#F5E6CC", surface: "#FFFFFF", cardStyle: "soft", secondary: "#C97B63", background: "#FFF8EE", buttonStyle: "rounded", bannerAnimation: "fade" } as ThemeConfig
  },
  'neon-static': {
    name: 'Neon Static',
    slug: 'neon-static' as TribeType,
    description: 'Concrete jungle royalty.',
    emoji: '🔥',
    colors: ['#8A2BE2', '#39FF14'],
    image: 'https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    config: { font: "Orbitron", mode: "dark", text: "#FFFFFF", accent: "#39FF14", primary: "#8A2BE2", surface: "#1A1A1A", cardStyle: "glass", secondary: "#39FF14", background: "#0B0B0B", buttonStyle: "neon", bannerAnimation: "glitch" } as ThemeConfig
  },
  'vault-heir': {
    name: 'Vault Heir',
    slug: 'vault-heir' as TribeType,
    description: 'Millennium bug, upgraded.',
    emoji: '🦋',
    colors: ['#1F3A5F', '#D2B48C'],
    image: 'https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    config: { font: "Cormorant Garamond", mode: "light", text: "#1F3A5F", accent: "#355070", primary: "#1F3A5F", surface: "#F8F8F8", cardStyle: "outline", secondary: "#D2B48C", background: "#FFFFFF", buttonStyle: "minimal", bannerAnimation: "slide" } as ThemeConfig
  }
};

// --- DYNAMIC QUESTION IMAGES MAPPED BY KEY ---
const DYNAMIC_IMAGES: Record<string, string[]> = {
  weekend: [
    'https://images.unsplash.com/photo-1560857617-84149b7abe53?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Cafe
    'https://images.unsplash.com/photo-1659059717901-45e523207d43?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rooftop
    'https://images.unsplash.com/photo-1773450970959-cef81e9b1053?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Luxury brunch
  ],
  colors: [
    'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=600&auto=format&fit=crop', // Blush/Cream
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop', // Neon
    'https://images.unsplash.com/photo-1632996547902-064471618ef0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beige/Linen
  ],
  shoes: [
    'https://images.unsplash.com/photo-1645477352686-8c2a686564f8?q=80&w=762&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sandals
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop', // Chunky Sneakers
    'https://images.unsplash.com/photo-1616406432452-07bc5938759d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Loafers
  ],
  vacation: [
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=600&auto=format&fit=crop', // Swiss
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1631173384324-6716de52d8bb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Monaco
  ],
  room: [
    'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=600&auto=format&fit=crop', // Plants
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', // LED
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', // Minimal Luxury
  ],
  accessory: [
    'https://images.unsplash.com/photo-1517472292914-9570a594783b?q=80&w=1133&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Silk Scarf
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Silver Chains
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop', // Vintage Watch
  ]
};

// Fallback images just in case backend adds a new question key we don't have mapped
const FALLBACK_OPTION_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?q=80&w=600&auto=format&fit=crop', 
];

const FALLBACK_QUESTIONS = [
  { id: 1, key: "weekend", question: "Your ideal Sunday morning?", options: ["Cafe & croissants", "Rooftop downtown", "Luxury brunch"] },
  { id: 2, key: "colors", question: "Pick a color palette", options: ["Blush + pearl + cream", "Neon + black + chrome", "Beige + gold + linen"] },
  { id: 3, key: "shoes", question: "Pick your footwear", options: ["Strappy Sandals", "Chunky Sneakers", "Leather Loafers"] },
  { id: 4, key: "vacation", question: "Dream destination", options: ["Swiss Countryside", "Tokyo Nights", "Monaco Coast"] },
  { id: 5, key: "room", question: "Your room aesthetic?", options: ["Plants & Wood", "LED & Chrome", "Minimal Luxury"] },
  { id: 6, key: "accessory", question: "Essential accessory", options: ["Silk Scarf", "Silver Chains", "Vintage Watch"] }
];

export default function OnboardingPage() {
  const router = useRouter();
  const setTribe = useTribeStore((state) => state.setTribe);
  
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [username, setUsername] = useState('tamtam');
  
  const [showManual, setShowManual] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [revealedTribe, setRevealedTribe] = useState<typeof TRIBES['golden-hour'] | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";

  // Fetch Questions & Username on Mount
  useEffect(() => {
    const userStr = localStorage.getItem('tribe_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.username || user.name) setUsername(user.username || user.name);
      } catch (e) {}
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/quiz/questions`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.questions.length > 0) setQuestions(data.questions);
        }
      } catch (error) {
        console.warn("Backend not reachable, using fallback questions.");
      }
    };
    fetchQuestions();
  }, [API_URL]);

  const handleOptionSelect = async (questionKey: string, selectedText: string, index: number) => {
    setSelectedOption(index);
    const newAnswers = { ...answers, [questionKey]: selectedText };
    setAnswers(newAnswers);

    setTimeout(async () => {
      setSelectedOption(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        await submitQuiz(newAnswers);
      }
    }, 400); 
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setIsCalculating(true);
    let finalSlug: keyof typeof TRIBES = 'golden-hour';

    try {
      const res = await fetch(`${API_URL}/tribes/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers })
      });
      if (res.ok) {
        const data = await res.json();
        finalSlug = data?.assignedTribe?.slug || data?.tribe?.slug || data?.slug || 'golden-hour';
      }
    } catch (error) {
      const counts = { 'golden-hour': 0, 'neon-static': 0, 'vault-heir': 0 };
      Object.values(finalAnswers).forEach(ans => {
        if (ans.includes('Cafe') || ans.includes('Blush') || ans.includes('Sandals') || ans.includes('Swiss')) counts['golden-hour']++;
        else if (ans.includes('Rooftop') || ans.includes('Neon') || ans.includes('Sneakers') || ans.includes('Tokyo')) counts['neon-static']++;
        else counts['vault-heir']++;
      });
      finalSlug = (Object.keys(counts).reduce((a, b) => counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b) as keyof typeof TRIBES);
    }

    await new Promise(r => setTimeout(r, 1000));
    setIsCalculating(false);
    setRevealedTribe(TRIBES[finalSlug] || TRIBES['golden-hour']);
  };

  // 👇 UPDATED: Trigger the reveal screen instead of skipping it!
  const manuallyAssignTribe = (slug: keyof typeof TRIBES) => {
    const selected = TRIBES[slug];
    setShowManual(false); // Hide the manual selection grid
    setRevealedTribe(selected); // Show the beautiful reveal card
  };

  const acceptTribeAndContinue = () => {
    if (!revealedTribe) return;
    setTribe(revealedTribe.slug, revealedTribe.config);
    router.push('/dashboard');
  };

  // --- REVEAL SCREEN (MATCHING YOUR SCREENSHOT EXACTLY) ---
  if (revealedTribe) {
    return (
      <main className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans">
        
        {/* Background Image - Heavily blurred & desaturated slightly */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${revealedTribe.image})`,
            filter: 'blur(24px) brightness(0.9) contrast(0.8)',
            transform: 'scale(1.15)' // Scale up to hide blur edges
          }}
        />
        
        {/* Soft whitish/pinkish overlay to ensure the card pops */}
        <div className="absolute inset-0 bg-[#FFF5F8]/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-white/30" />

        {/* The Central Glassmorphic Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="z-10 relative flex flex-col items-center py-16 px-12 md:px-24 bg-[#FDFBFB] rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] max-w-xl w-[90%] text-center border border-white/60"
        >
          <div className="text-5xl md:text-6xl mb-4 drop-shadow-sm">{revealedTribe.emoji}</div>
          <h3 className="text-[#ff3f6c] font-bold tracking-[0.2em] uppercase text-[10px] mb-4">Your Aesthetic Is</h3>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#111111] mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {revealedTribe.name}
          </h1>
          
          <p className="text-base text-[#666666] mb-10">
            {revealedTribe.description}
          </p>
          
          <button 
            onClick={acceptTribeAndContinue}
            className="px-12 py-4 rounded-full font-bold text-white text-sm tracking-wide bg-[#ff3f6c] hover:bg-[#E11D48] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Enter the Studio
          </button>
        </motion.div>
      </main>
    );
  }

  // --- MANUAL OVERRIDE VIEW ---
  if (showManual) {
    return (
      <main className="h-screen w-full bg-[#FFF5F8] flex flex-col p-6 relative overflow-hidden font-sans">
        <div className="w-full max-w-7xl mx-auto pt-6 flex items-center justify-between mb-8">
          <button onClick={() => setShowManual(false)} className="flex items-center gap-2 text-[#111111] font-medium hover:text-[#ff3f6c] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col h-full pb-10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#ff3f6c] uppercase mb-2">Choose your own</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-10" style={{ fontFamily: 'Georgia, serif' }}>
            Pick your tribe
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
            {Object.values(TRIBES).map((tribe) => (
              <button
                key={tribe.slug}
                onClick={() => manuallyAssignTribe(tribe.slug as keyof typeof TRIBES)}
                className="group relative h-full w-full rounded-[2rem] overflow-hidden border-4 border-transparent hover:border-[#ff3f6c]/30 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${tribe.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="text-4xl mb-3 transform group-hover:-translate-y-2 transition-transform duration-300">{tribe.emoji}</div>
                  <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>{tribe.name}</h3>
                  <p className="text-sm text-white/80">{tribe.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // --- CALCULATING VIEW ---
  if (isCalculating) {
    return (
      <main className="h-screen w-full bg-[#FFF5F8] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#FBCFE8] border-t-[#ff3f6c] rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold tracking-widest uppercase text-[#111111]">Analyzing Vibe...</h2>
      </main>
    );
  }

  // --- INTERACTIVE QUIZ VIEW ---
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className="h-screen w-full bg-gradient-to-br from-[#FFF5F8] to-white flex flex-col overflow-hidden font-sans">
      
      {/* Top Navigation Bar */}
      <header className="w-full px-8 py-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff3f6c] uppercase mb-1">Vibe Quiz</span>
          <div className="relative">
            <h2 className="text-2xl font-bold text-[#111111]" style={{ fontFamily: 'Georgia, serif' }}>
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <div className="absolute -bottom-2 left-0 h-1 bg-[#FBCFE8] w-full rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#ff3f6c]" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Welcome Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#022c16] text-[#4ade80] px-5 py-2.5 rounded-md shadow-sm">
          <CheckCircle2 className="w-4 h-4 fill-[#4ade80] text-[#022c16]" />
          <span className="text-sm font-medium">Welcome, {username} ✨</span>
        </div>

        <button onClick={() => setShowManual(true)} className="text-[#111111] hover:text-[#ff3f6c] text-sm font-medium transition-colors">
          Skip & choose manually
        </button>
      </header>

      {/* Quiz Content Area */}
      <div className="flex-grow flex flex-col items-center px-8 pb-12 pt-6 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl h-full flex flex-col"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#111111] text-center mb-10 shrink-0" style={{ fontFamily: 'Georgia, serif' }}>
              {currentQ.question}
            </h1>

            {/* Image Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
              {currentQ.options.slice(0, 3).map((option, idx) => {
                const isSelected = selectedOption === idx;
                
                // Fetch the unique image mapped specifically to this question and option index!
                const bgImage = DYNAMIC_IMAGES[currentQ.key]?.[idx] || FALLBACK_OPTION_IMAGES[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(currentQ.key, option, idx)}
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden text-left transition-all duration-300 group
                      ${isSelected ? 'ring-4 ring-[#ff3f6c] scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-xl'}`}
                  >
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${bgImage})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    
                    {/* Pink Star Icon for Selected State */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-[#ff3f6c] text-white p-2 rounded-full shadow-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                        Option {String.fromCharCode(65 + idx)}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        {option}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}