'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ⚠️  BACKEND INTEGRATION GOES HERE
      /* 
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`YOUR_BACKEND_URL${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password })
      });
      const data = await response.json();
      
      if (!data.success) throw new Error(data.message);
      
      // Save the real JWT token!
      localStorage.setItem('tribe_jwt', data.token);
      */

      // 👇 FOR NOW: We simulate a successful network request so you can test the UI
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // We mock saving a JWT token to local storage
      localStorage.setItem('tribe_jwt', 'mock_token_12345');
      
      // Success! Send them to the Vibe Quiz to get their aesthetic
      router.push('/onboarding');
      
    } catch (error: any) {
      alert(error.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff3f6c] selection:text-white">
      
      {/* LEFT SIDE: Aesthetic Fashion Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900">
        {/* We use a high-fashion Unsplash placeholder blended with Myntra Pink */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-60 transition-transform duration-[20s] hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop')" }}
        />
        {/* Pink/Fuchsia Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff3f6c]/40 to-fuchsia-900/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]/90" />
        
        {/* Branding on the image */}
        <div className="absolute bottom-12 left-12">
          <Link href="/" className="text-3xl font-black tracking-tighter text-white hover:text-[#ff3f6c] transition-colors drop-shadow-lg">
            MYNTRA TRIBES
          </Link>
          <p className="text-white/70 mt-2 text-lg font-medium drop-shadow-md">Your aesthetic. Your rules.</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        
        {/* Background glow for the form side */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#ff3f6c]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Join the Tribe"}
            </h1>
            <p className="text-white/50">
              {isLogin ? "Enter your details to access your studio." : "Create an account to start building lookbooks."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* NAME INPUT (Only shown on Sign Up) */}
            {!isLogin && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-bold tracking-wider uppercase opacity-60">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="e.g. Alex Carter"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ff3f6c] focus:bg-white/10 transition-all text-sm"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider uppercase opacity-60">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ff3f6c] focus:bg-white/10 transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider uppercase opacity-60">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ff3f6c] focus:bg-white/10 transition-all text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-[#ff3f6c]/20 bg-[#ff3f6c] text-white hover:bg-[#ff3f6c]/90 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center text-sm text-white/50">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="text-[#ff3f6c] font-bold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}