'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTribeStore } from '@/store/useTribeStore';
import { Check, ChevronRight } from 'lucide-react';

const GENDERS = [
  { id: 'female', label: 'Womenswear', desc: 'Curated feminine & unisex fits' },
  { id: 'male', label: 'Menswear', desc: 'Curated masculine & unisex fits' },
  { id: 'neutral', label: 'Fluid', desc: 'The complete unfiltered catalog' }
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim / Petite' },
  { id: 'athletic', label: 'Athletic / Toned' },
  { id: 'curvy', label: 'Curvy / Mid-Size' },
  { id: 'plus', label: 'Plus / Broad' }
];

const HAIR_COLORS = [
  { id: 'black', hex: '#0a0a0a' }, { id: 'dark-brown', hex: '#2C1B18' },
  { id: 'light-brown', hex: '#5C3A21' }, { id: 'blonde', hex: '#E5C07B' },
  { id: 'red', hex: '#8B1E09' }, { id: 'silver', hex: '#D1D5DB' },
  { id: 'pink', hex: '#ff3f6c' }, { id: 'blue', hex: '#2563EB' }
];

const SKIN_TONES = [
  { id: 'tone-1', hex: '#FDF1E6' }, { id: 'tone-2', hex: '#F3D9C6' },
  { id: 'tone-3', hex: '#E0B594' }, { id: 'tone-4', hex: '#C68E65' },
  { id: 'tone-5', hex: '#9E643C' }, { id: 'tone-6', hex: '#713F21' },
  { id: 'tone-7', hex: '#4A2511' }, { id: 'tone-8', hex: '#2B1408' }
];

export default function PersonaStudio() {
  const router = useRouter();
  const { setAvatarId, setUserGender } = useTribeStore();
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Selection State
  const [gender, setGender] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [skinTone, setSkinTone] = useState('');

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const jwt = localStorage.getItem('tribe_jwt');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
      
      const res = await fetch(`${API_URL}/avatars/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        // 👇 UPDATED: Perfectly matches Aditi's backend schema!
        body: JSON.stringify({
          name: "My Digital Twin", // Backend requires this
          hair: hairColor,         // Maps to Aditi's 'hair'
          skin_color: skinTone,    // Maps to Aditi's 'skin_color'
          body_type: bodyType      // Maps to Aditi's 'body_type'
        })
      });

      let newAvatarId = "mock_avatar_999"; 

      if (res.ok) {
        const data = await res.json();
        newAvatarId = data.avatar?.id || data.id || newAvatarId;
      } else {
        const errorData = await res.json();
        console.warn("Backend failed:", errorData.message);
        await new Promise(r => setTimeout(r, 1500)); // Mock delay if backend fails
      }

      // Save to Zustand! 
      setAvatarId(newAvatarId);
      
      // We STILL save gender locally so your catalog can filter products beautifully!
      setUserGender(gender); 
      
      // Success! Route to the builder.
      router.push('/builder');

    } catch (error) {
      console.error("Avatar creation failed", error);
      alert("Failed to create avatar. Check console.");
      setIsGenerating(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return gender !== '';
    if (step === 2) return bodyType !== '';
    if (step === 3) return hairColor !== '';
    if (step === 4) return skinTone !== '';
    return false;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      
      {/* Cinematic Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[150px] pointer-events-none opacity-60 mix-blend-screen" />

      <div className="w-full max-w-2xl relative z-10 flex flex-col h-[600px]">
        
        {/* Header & Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {step > 1 ? (
              <button onClick={handleBack} className="text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                ← Back
              </button>
            ) : <div />}
            <span className="text-[var(--accent)] font-bold tracking-widest text-xs uppercase">
              Step {step} of 4
            </span>
          </div>
          
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step Content Area */}
        <div className="flex-grow relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: GENDER */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Who are you dressing?</h2>
                <p className="text-white/50 mb-8">This determines the catalog you'll pull from.</p>
                <div className="grid gap-4">
                  {GENDERS.map(g => (
                    <button key={g.id} onClick={() => setGender(g.id)} className={`p-6 rounded-2xl border text-left transition-all ${gender === g.id ? 'bg-white/10 border-[var(--accent)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                      <h3 className="text-xl font-bold">{g.label}</h3>
                      <p className="text-white/50 text-sm mt-1">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: BODY TYPE */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Select your build.</h2>
                <p className="text-white/50 mb-8">To ensure your digital twin models fits perfectly.</p>
                <div className="grid grid-cols-2 gap-4">
                  {BODY_TYPES.map(b => (
                    <button key={b.id} onClick={() => setBodyType(b.id)} className={`p-8 rounded-2xl border text-center transition-all ${bodyType === b.id ? 'bg-white/10 border-[var(--accent)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                      <h3 className="text-lg font-bold">{b.label}</h3>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: HAIR COLOR */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Hair color.</h2>
                <div className="grid grid-cols-4 gap-6">
                  {HAIR_COLORS.map(h => (
                    <button key={h.id} onClick={() => setHairColor(h.hex)} className={`relative aspect-square rounded-full flex items-center justify-center transition-all ${hairColor === h.hex ? 'scale-110 ring-2 ring-white ring-offset-4 ring-offset-[#0a0a0a]' : 'hover:scale-105'}`} style={{ backgroundColor: h.hex }}>
                      {hairColor === h.hex && <Check className="w-6 h-6 text-white drop-shadow-md mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SKIN TONE */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Skin tone.</h2>
                <div className="grid grid-cols-4 gap-6">
                  {SKIN_TONES.map(s => (
                    <button key={s.id} onClick={() => setSkinTone(s.hex)} className={`relative aspect-square rounded-full flex items-center justify-center transition-all ${skinTone === s.hex ? 'scale-110 ring-2 ring-white ring-offset-4 ring-offset-[#0a0a0a]' : 'hover:scale-105'}`} style={{ backgroundColor: s.hex }}>
                      {skinTone === s.hex && <Check className="w-6 h-6 text-black/50 drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-white/10 mt-auto">
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className="w-full py-4 rounded-xl font-bold tracking-wide transition-all bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleGenerate} 
              disabled={!isStepValid() || isGenerating}
              className="w-full py-4 rounded-xl font-bold tracking-wide transition-all bg-[var(--accent)] text-[var(--bg-primary)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-[0_0_40px_var(--accent)] shadow-[var(--accent)]/30"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full animate-spin" />
              ) : (
                "Generate Digital Twin"
              )}
            </button>
          )}
        </div>

      </div>
    </main>
  );
}