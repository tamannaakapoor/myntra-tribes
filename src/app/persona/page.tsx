'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// --- DYNAMIC 2D AVATAR COMPONENT ---
function FemaleAvatar2D({ skinTone, hairStyle, bodyType }: { skinTone: string, hairStyle: string, bodyType: string }) {
  const bodyWidth = bodyType === 'Slim' ? 70 : bodyType === 'Athletic' ? 85 : bodyType === 'Curvy' ? 105 : 125;

  return (
    <svg viewBox="0 0 200 300" className="w-full h-full max-w-[300px] drop-shadow-sm">
      <defs>
        <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4d79" />
          <stop offset="100%" stopColor="#ff99b3" />
        </linearGradient>
      </defs>

      {/* --- HAIR (BACK LAYER) --- */}
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && (
        <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />
      )}

      {/* --- LEGS & SHOES & NECK --- */}
      <rect x="85" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <rect x="105" y="210" width="10" height="70" rx="5" fill={skinTone} />
      
      {/* <ellipse cx="90" cy="285" rx="12" ry="7" fill="#ff99b3" /> */}
      {/* <ellipse cx="110" cy="285" rx="12" ry="7" fill="#ff99b3" /> */}
      
      {/* Sneakers */}
      <path
        d="M76 278
           Q88 272 100 278
           L100 286
           L76 286 Z"
        fill="white"
      />

      <path
        d="M100 278
           Q112 272 124 278
           L124 286
           L100 286 Z"
        fill="white"
      />

      <line x1="82" y1="282" x2="94" y2="282" stroke="#999" strokeWidth="1.5" />
      <line x1="106" y1="282" x2="118" y2="282" stroke="#999" strokeWidth="1.5" />
      
      {/* <rect x="92" y="110" width="16" height="20" fill={skinTone} /> */}
      
      <rect x="92" y="108" width="16" height="26" rx="6" fill={skinTone} />

      {/* --- DRESS / BODY --- */}
      {/* <path 
        d={`M ${100 - bodyWidth/2} 125 L ${100 + bodyWidth/2} 125 L ${100 + bodyWidth/2 - 5} 220 L ${100 - bodyWidth/2 + 5} 220 Z`} 
        fill="url(#dressGrad)" 
      /> */}
      
      {/* Arms */}
      <rect
        x={100-bodyWidth/2-12}
        y="126"
        width="10"
        height="62"
        rx="6"
        fill={skinTone}
        transform={`rotate(8 ${100-bodyWidth/2-12} 126)`}
      />

      <rect
        x={100+bodyWidth/2+2}
        y="126"
        width="10"
        height="62"
        rx="6"
        fill={skinTone}
        transform={`rotate(-8 ${100+bodyWidth/2+2} 126)`}
      />
      
      {/* ================== HOODIE ================== */}
      <path
        d={`
            M ${100-bodyWidth/2} 122
            Q 100 112 ${100+bodyWidth/2} 122
            L ${100+bodyWidth/2-6} 170
            Q 100 180 ${100-bodyWidth/2+6} 170
            Z
        `}
        fill="#FF3F6C"
      />

      {/* Hoodie Pocket */}
      <rect x="82" y="148" width="36" height="18" rx="8" fill="#ff6b8f" />

      {/* Hoodie Strings */}
      <line x1="95" y1="118" x2="95" y2="140" stroke="white" strokeWidth="2" />
      <line x1="105" y1="118" x2="105" y2="140" stroke="white" strokeWidth="2" />
      
      {/* ================= CARGO ================= */}
      <rect x={100-bodyWidth/2+8} y="170" width={bodyWidth/2-10} height="55" rx="8" fill="#404040" />
      <rect x="102" y="170" width={bodyWidth/2-10} height="55" rx="8" fill="#404040" />

      {/* Cargo Pockets */}
      <rect x={100-bodyWidth/2+12} y="188" width="10" height="12" rx="2" fill="#5A5A5A" />
      <rect x={100+bodyWidth/2-22} y="188" width="10" height="12" rx="2" fill="#5A5A5A" />
      
      {/* --- HEAD & FACE --- */}
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <circle cx="72" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <circle cx="128" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <path d="M 92 92 Q 100 100 108 92" stroke="#ff4d79" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />

      {/* --- HAIR (FRONT BANGS) --- */}
      {hairStyle !== 'Buzz' && (
        <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />
      )}
      {hairStyle === 'Buzz' && (
        <path d="M 62 80 A 38 38 0 0 1 138 80 A 40 40 0 0 0 62 80 Z" fill="#2C1B18" opacity="0.8" />
      )}
    </svg>
  );
}

export default function PersonaPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // State matches EXACTLY what Aditi requested in the API document
  const [avatarState, setAvatarState] = useState({
    name: 'My Avatar',
    gender: 'Female', 
    skin_color: '#F3D9C6',
    hair: 'Bob',
    body_type: 'Slim'
  });

  const skinTones = ['#F5D0C5', '#F3D9C6', '#C29270', '#8A5A44', '#4A2E2B'];
  const bodyTypes = ['Slim', 'Athletic', 'Curvy', 'Plus'];
  const hairStyles = ['Long', 'Bob', 'Bun', 'Curly', 'Buzz'];

  // ✨ BULLETPROOF API URL
  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) {
      url = `${url.replace(/\/$/, "")}/api`;
    }
    return url;
  };

  // On mount, load the username and fetch existing avatar
  useEffect(() => {
    const userStr = localStorage.getItem('tribe_user');
    let localName = 'My Avatar';
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.username || user.name) {
          localName = user.username || user.name;
          setAvatarState(prev => ({ ...prev, name: localName }));
        }
      } catch (e) {}
    }

    const fetchExistingAvatar = async () => {
      const token = localStorage.getItem('tribe_jwt');
      if (!token) return;

      try {
        const res = await fetch(`${getApiUrl()}/avatar/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Populate the studio with their saved choices!
        const savedAvatar = data.avatar || data.data || data;
        if (res.ok && savedAvatar && savedAvatar.skin_color) {
          setAvatarState({
            name: savedAvatar.name || localName,
            gender: savedAvatar.gender || 'Female',
            skin_color: savedAvatar.skin_color || '#F3D9C6',
            hair: savedAvatar.hair || 'Bob',
            body_type: savedAvatar.body_type || 'Slim'
          });
        }
      } catch (error) {
        console.warn("No existing avatar found, starting fresh.");
      }
    };

    fetchExistingAvatar();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('tribe_jwt');

      console.log("🚀 DEBUG - Saving Avatar Payload:", JSON.stringify(avatarState));

      const response = await fetch(`${getApiUrl()}/avatar/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(avatarState) // Matches docs perfectly
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🛑 Backend rejected the avatar:", errorText);
        // We push anyway so you don't get stuck if the backend isn't ready
        router.push('/dashboard');
        return;
      }

      const data = await response.json();
      console.log("🚀 DEBUG - Avatar API Response:", data);

      if (data.success || response.ok) {
        router.push('/dashboard');
      } else {
        alert(data.message || "Failed to save avatar");
      }
    } catch (error) {
      console.warn("Avatar API unreachable, returning to dashboard.");
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 py-10 md:px-12 md:py-16 font-sans text-[#111111]">
      <div className="max-w-[1200px] mx-auto">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-medium mb-8 hover:text-[#ff3f6c] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block text-[#ff3f6c]">
          Avatar Studio
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12" style={{ fontFamily: 'Georgia, serif' }}>
          Design your avatar
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: 2D AVATAR PREVIEW */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#FBCFE8]/30 aspect-square relative overflow-hidden flex items-center justify-center">
            <FemaleAvatar2D 
              skinTone={avatarState.skin_color} 
              hairStyle={avatarState.hair} 
              bodyType={avatarState.body_type} 
            />
          </div>

          {/* RIGHT: CUSTOMIZATION CONTROLS */}
          <div className="flex flex-col gap-10 justify-center max-w-md">
            
            {/* BODY Toggles */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#888888] uppercase mb-4">Body</h3>
              <div className="flex flex-wrap items-center gap-3">
                {bodyTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setAvatarState({ ...avatarState, body_type: type })}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                      avatarState.body_type === type 
                        ? 'bg-[#ff3f6c] text-white border-[#ff3f6c] shadow-md' 
                        : 'bg-transparent text-[#111111] border-[#E5E5E5] hover:border-[#ff3f6c]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* HAIR Toggles */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#888888] uppercase mb-4">Hair</h3>
              <div className="flex flex-wrap items-center gap-3">
                {hairStyles.map(style => (
                  <button
                    key={style}
                    onClick={() => setAvatarState({ ...avatarState, hair: style })}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                      avatarState.hair === style 
                        ? 'bg-[#ff3f6c] text-white border-[#ff3f6c] shadow-md' 
                        : 'bg-transparent text-[#111111] border-[#E5E5E5] hover:border-[#ff3f6c]/50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* SKIN TONE Toggles */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#888888] uppercase mb-4">Skin Tone</h3>
              <div className="flex flex-wrap items-center gap-4">
                {skinTones.map(hex => (
                  <button
                    key={hex}
                    onClick={() => setAvatarState({ ...avatarState, skin_color: hex })}
                    className={`w-12 h-12 rounded-full transition-all border-4 ${
                      avatarState.skin_color === hex 
                        ? 'border-[#ff3f6c] scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="mt-6 w-full py-4 rounded-full font-bold text-white bg-[#ff3f6c] hover:bg-[#E11D48] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Save avatar <span className="text-lg leading-none font-light">→</span></>
              )}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}