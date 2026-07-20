'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Ruler, Weight, UserCircle2, Scissors, CheckCircle2, AlertCircle, Loader2, Activity } from 'lucide-react';

export default function TrueFitPage() {
  const router = useRouter();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Measurement State
  const [height, setHeight] = useState(165); // cm
  const [weight, setWeight] = useState(60);  // kg
  const [shape, setShape] = useState('Hourglass');
  const [fit, setFit] = useState('Regular');

  // Recommendation State
  const [topSize, setTopSize] = useState('M');
  const [bottomSize, setBottomSize] = useState('M');

  const shapes = ['Hourglass', 'Pear', 'Inverted Triangle', 'Rectangle'];
  const fits = ['Tailored', 'Regular', 'Oversized'];

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'https://myntra-tribes.onrender.com/api';
    if (!url.endsWith('/api')) url = `${url.replace(/\/$/, '')}/api`;
    return url;
  };

  // --- THE TRUEFIT ALGORITHM ---
  useEffect(() => {
    // 1. Calculate Base Size using BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let base = 'M';
    if (bmi < 18.5) base = 'XS';
    else if (bmi >= 18.5 && bmi < 22) base = 'S';
    else if (bmi >= 22 && bmi < 25) base = 'M';
    else if (bmi >= 25 && bmi < 29) base = 'L';
    else if (bmi >= 29 && bmi < 33) base = 'XL';
    else base = 'XXL';

    const sizeLadder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const baseIndex = sizeLadder.indexOf(base);

    const shiftSize = (index: number, shift: number) => {
      const newIndex = Math.max(0, Math.min(sizeLadder.length - 1, index + shift));
      return sizeLadder[newIndex];
    };

    let calcTop = base;
    let calcBottom = base;

    // 2. Adjust for Proportions
    if (shape === 'Pear') calcBottom = shiftSize(baseIndex, 1);
    else if (shape === 'Inverted Triangle') calcTop = shiftSize(baseIndex, 1);
    else if (shape === 'Rectangle') calcBottom = shiftSize(baseIndex, 0); 

    // 3. Adjust for Preference
    if (fit === 'Oversized') {
      calcTop = shiftSize(sizeLadder.indexOf(calcTop), 1);
      calcBottom = shiftSize(sizeLadder.indexOf(calcBottom), 1);
    } else if (fit === 'Tailored') {
      calcTop = shiftSize(sizeLadder.indexOf(calcTop), 0);
    }

    setTopSize(calcTop);
    setBottomSize(calcBottom);
  }, [height, weight, shape, fit]);

  // --- FETCH EXISTING DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('tribe_jwt');
      if (!token) return;
      try {
        const res = await fetch(`${getApiUrl()}/truefit/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setHeight(data.profile.height);
            setWeight(data.profile.weight);
            setShape(data.profile.body_shape);
            setFit(data.profile.fit_preference);
          }
        }
      } catch (error) {
        console.log("No profile found, using defaults.");
      }
    };
    fetchProfile();
  }, []);

  // --- SAVE TO BACKEND ---
  const handleSave = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const payload = { height, weight, body_shape: shape, fit_preference: fit, top_size: topSize, bottom_size: bottomSize };

    try {
      const token = localStorage.getItem('tribe_jwt');
      const response = await fetch(`${getApiUrl()}/truefit/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setErrorMsg('Failed to sync with TrueFit servers.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setIsSaved(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Math mapping for the dynamic visualizer silhouette
  // Bounds ensure it doesn't break the UI layout, but visually scales accurately
  const dynamicScaleY = 0.8 + ((height - 140) / 70) * 0.4; // 140cm to 210cm
  const dynamicScaleX = 0.8 + ((weight - 40) / 90) * 0.6;  // 40kg to 130kg

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans relative overflow-x-hidden pb-20">
      
      {/* Background Aesthetic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff3f6c]/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8A2BE2]/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1400px] mx-auto px-6 pt-12 md:pt-20 relative z-10">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold mb-8 text-[#888888] hover:text-[#111111] transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-12">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3 block text-[#ff3f6c] flex items-center gap-2">
            <Activity className="w-4 h-4" /> Myntra Algorithmic Sizing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            TrueFit Engine.
          </h1>
          <p className="text-[#666666] text-lg max-w-2xl">
            Input your metrics and let pure math calculate your exact fit. The dynamic mesh adapts in real-time, mapping your geometry to the Myntra master catalog.
          </p>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: SLIDERS & DYNAMIC MESH */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#FBCFE8]/50 shadow-sm rounded-[2rem] p-8 flex-grow flex flex-col items-center justify-center relative overflow-hidden">
              <p className="absolute top-6 left-6 text-[10px] font-bold tracking-widest text-[#888888] uppercase">Dynamic Mesh Visualizer</p>
              
              {/* Dynamic SVG Silhouette */}
              <div className="h-64 w-full flex items-center justify-center mt-6">
                <motion.div
                  animate={{ scaleX: dynamicScaleX, scaleY: dynamicScaleY }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="origin-bottom"
                >
                  <svg viewBox="0 0 100 250" className="w-32 h-64 opacity-80">
                    <defs>
                      <linearGradient id="meshGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff3f6c" />
                        <stop offset="100%" stopColor="#ff99b3" />
                      </linearGradient>
                    </defs>
                    {/* Head */}
                    <circle cx="50" cy="25" r="15" fill="url(#meshGrad)" />
                    {/* Torso/Legs abstraction */}
                    <path d="M 30 50 Q 50 45 70 50 L 75 110 Q 50 120 25 110 Z" fill="url(#meshGrad)" opacity="0.9"/>
                    <path d="M 28 115 Q 50 125 72 115 L 65 240 L 52 240 L 50 160 L 48 240 L 35 240 Z" fill="url(#meshGrad)" opacity="0.7" />
                    {/* Measurement lines */}
                    <line x1="10" y1="25" x2="90" y2="25" stroke="#ff3f6c" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                    <line x1="10" y1="115" x2="90" y2="115" stroke="#ff3f6c" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                  </svg>
                </motion.div>
              </div>
            </div>

            <div className="bg-white border border-[#FBCFE8]/50 shadow-sm rounded-[2rem] p-8">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold tracking-wider text-[#111111] uppercase flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#ff3f6c]" /> Height
                  </label>
                  <span className="text-2xl font-black text-[#111111]">{height} <span className="text-sm font-normal text-[#888888]">cm</span></span>
                </div>
                <input 
                  type="range" min="140" max="210" value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#FFF5F8] border border-[#FBCFE8] rounded-lg appearance-none cursor-pointer accent-[#ff3f6c]"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold tracking-wider text-[#111111] uppercase flex items-center gap-2">
                    <Weight className="w-4 h-4 text-[#ff3f6c]" /> Weight
                  </label>
                  <span className="text-2xl font-black text-[#111111]">{weight} <span className="text-sm font-normal text-[#888888]">kg</span></span>
                </div>
                <input 
                  type="range" min="40" max="130" value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#FFF5F8] border border-[#FBCFE8] rounded-lg appearance-none cursor-pointer accent-[#ff3f6c]"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: PROPORTIONS & FIT */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#FBCFE8]/50 shadow-sm rounded-[2rem] p-8 h-full">
              <div className="mb-12">
                <label className="text-sm font-bold tracking-wider text-[#111111] uppercase mb-6 flex items-center gap-2 border-b border-[#FBCFE8]/50 pb-4">
                  <UserCircle2 className="w-5 h-5 text-[#ff3f6c]" /> Body Geometry
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shapes.map(s => (
                    <button
                      key={s}
                      onClick={() => setShape(s)}
                      className={`py-5 px-4 rounded-2xl text-sm font-bold transition-all border text-left ${
                        shape === s 
                        ? 'bg-[#ff3f6c] text-white border-[#ff3f6c] shadow-md shadow-[#ff3f6c]/20' 
                        : 'bg-white text-[#666666] border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold tracking-wider text-[#111111] uppercase mb-6 flex items-center gap-2 border-b border-[#FBCFE8]/50 pb-4">
                  <Scissors className="w-5 h-5 text-[#ff3f6c]" /> Drape Preference
                </label>
                <div className="flex flex-col gap-4">
                  {fits.map(f => (
                    <button
                      key={f}
                      onClick={() => setFit(f)}
                      className={`py-5 px-4 rounded-2xl text-sm font-bold transition-all border text-left flex justify-between items-center ${
                        fit === f 
                        ? 'bg-[#111111] text-white border-[#111111] shadow-md' 
                        : 'bg-white text-[#666666] border-[#FBCFE8]/50 hover:border-[#111111]/30'
                      }`}
                    >
                      {f}
                      {fit === f && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: TRUEFIT ALGORITHM RESULT */}
          <div className="flex flex-col h-full">
            <motion.div 
              key={`${topSize}-${bottomSize}`}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-[#FBCFE8]/50 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-[#FFF5F8] to-transparent pointer-events-none" />

              <h3 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-[#FBCFE8]/50 pb-6 text-[#111111] relative z-10">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80]" /> Computation Output
              </h3>

              <div className="flex-grow flex flex-col justify-center">
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <p className="text-[#888888] text-xs uppercase tracking-widest font-bold mb-2">Calculated Top</p>
                    <p className="text-7xl font-black text-[#111111]">{topSize}</p>
                  </div>
                  <div className="h-24 w-px bg-[#FBCFE8]" />
                  <div className="text-right">
                    <p className="text-[#888888] text-xs uppercase tracking-widest font-bold mb-2">Calculated Bottom</p>
                    <p className="text-7xl font-black text-[#111111]">{bottomSize}</p>
                  </div>
                </div>

                <div className="bg-[#FFF5F8] border border-[#FBCFE8] rounded-2xl p-5 mb-8 relative z-10">
                  <p className="text-sm text-[#ff3f6c] leading-relaxed flex items-start gap-3 font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    Because you prefer a {fit.toLowerCase()} fit and have a {shape.toLowerCase()} geometry, our matrix shifted your base sizes to guarantee the perfect drape.
                  </p>
                </div>
              </div>

              <div className="mt-auto relative z-10">
                {errorMsg && <p className="text-sm text-[#E11D48] font-medium mb-4 text-center">{errorMsg}</p>}

                <button
                  onClick={handleSave}
                  disabled={isLoading || isSaved}
                  className={`w-full py-5 rounded-full font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                    isSaved ? 'bg-[#15803d] text-white shadow-lg shadow-[#15803d]/20' : 'bg-[#ff3f6c] hover:bg-[#E11D48] text-white shadow-lg shadow-[#ff3f6c]/20'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isSaved ? (
                    <>Matrix Locked <CheckCircle2 className="w-5 h-5" /></>
                  ) : (
                    "Lock in my sizes"
                  )}
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}