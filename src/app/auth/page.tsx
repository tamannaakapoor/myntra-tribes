'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Flame, Droplets } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
      const CLEAN_API_URL = RAW_API_URL.replace(/\/$/, ""); 
      
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const finalUrl = `${CLEAN_API_URL}${endpoint}`;
      
      const body = isLogin ? { email, password } : { username: name, email, password };

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error("The backend server returned a webpage instead of data.");
      }

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || data.error || "Authentication failed");
      }

      // 👇 THE FIX: Look inside data.session for the access_token!
      const token = data.token || (data.session && data.session.access_token);

      if (token) {
        // SUCCESS!
        localStorage.setItem("tribe_jwt", token);
        localStorage.setItem("tribe_user", JSON.stringify(data.user || (data.session && data.session.user) || { username: name, email }));
        router.push("/onboarding");
      } else if (!isLogin && (data.success || response.ok || data.message)) {
        alert("Registration successful! Please log in to enter your Tribe.");
        setIsLogin(true); 
      } else {
        throw new Error(`No token found in response.`);
      }
      
    } catch (error: any) {
      console.error("Auth Error:", error);
      alert(`Login/Signup Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // STRICTLY NO SCROLLING: h-screen and overflow-hidden
    <main className="flex h-screen w-full overflow-hidden text-[#111111] selection:bg-[#ff3f6c] selection:text-white font-sans">
      
      {/* LEFT SIDE: Full Bleed Editorial Visual */}
      <div className="hidden lg:flex w-1/2 relative h-full">
        {/* Dreamy, pinkish-sky editorial image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop')" }}
        />
        
        {/* Overlays: Warm pinkish tint + gradient for text readability */}
        <div className="absolute inset-0 bg-[#ff3f6c] mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Branding - Clearly Visible */}
        <div className="absolute top-10 left-10 flex items-center gap-4 z-20">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-serif font-bold text-2xl border border-white/30 shadow-lg">
            M
          </div>
          <span className="text-white tracking-[0.25em] font-semibold text-sm drop-shadow-md">MYNTRA TRIBES</span>
        </div>

        {/* Hero Copy & Badges */}
        <div className="absolute bottom-12 left-10 pr-12 z-20">
          <h1 className="text-6xl xl:text-[80px] font-bold text-white mb-4 leading-[1.05] drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
            Find Your<br/>Tribe.
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-md font-light leading-relaxed drop-shadow-md">
            Take the vibe quiz. Get reskinned. Build your look. Rise on the leaderboard.
          </p>

          {/* Corrected 3 Tribes Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-medium shadow-sm hover:bg-white/30 transition-colors">
              <Sparkles className="w-4 h-4 text-[#F5E6CC]" /> Golden Hour
            </div>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-medium shadow-sm hover:bg-white/30 transition-colors">
              <Flame className="w-4 h-4 text-[#39FF14]" /> Neon Static
            </div>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-medium shadow-sm hover:bg-white/30 transition-colors">
              <Droplets className="w-4 h-4 text-[#D2B48C]" /> Vault Heir
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Clean, Pinkish Auth Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 xl:px-24 relative bg-gradient-to-br from-[#FFF5F8] to-white">
        
        <div className="w-full max-w-[400px] mx-auto relative z-10">
          
          <div className="mb-8 text-center lg:text-left">
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#ff3f6c]/80 uppercase mb-3">
              Editorial • Gen Z • Fashion
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-2 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Join the movement.
            </h2>
            <p className="text-[#666666] text-sm md:text-base">
              One username. Zero drama. Your tribe awaits.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <label className="text-[11px] font-bold tracking-widest text-[#888888] uppercase pl-4">Username</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="your_alias"
                  className="w-full bg-white border border-[#FBCFE8] rounded-full px-6 py-3.5 outline-none focus:border-[#ff3f6c] focus:ring-4 focus:ring-[#ff3f6c]/10 transition-all text-sm text-[#111111] placeholder:text-[#CCCCCC] shadow-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-[#888888] uppercase pl-4">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white border border-[#FBCFE8] rounded-full px-6 py-3.5 outline-none focus:border-[#ff3f6c] focus:ring-4 focus:ring-[#ff3f6c]/10 transition-all text-sm text-[#111111] placeholder:text-[#CCCCCC] shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest text-[#888888] uppercase pl-4">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white border border-[#FBCFE8] rounded-full px-6 py-3.5 outline-none focus:border-[#ff3f6c] focus:ring-4 focus:ring-[#ff3f6c]/10 transition-all text-sm text-[#111111] placeholder:text-[#CCCCCC] shadow-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-8 rounded-full font-bold tracking-wide transition-all bg-gradient-to-r from-[#ff3f6c] to-[#f43f5e] text-white hover:shadow-lg hover:shadow-[#ff3f6c]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>Enter Tribes <span className="text-lg leading-none font-light">→</span></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#666666]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="text-[#ff3f6c] font-semibold hover:underline underline-offset-4"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}