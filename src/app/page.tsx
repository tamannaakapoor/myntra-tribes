import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-pink-500 selection:text-white relative">
      
      {/* Aesthetic Cinematic Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#ff3f6c]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff3f6c] to-fuchsia-400">
          MYNTRA TRIBES
        </div>
        
        {/* We will build this /auth route in the next step! */}
        <Link 
          href="/auth" 
          className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition backdrop-blur-md font-medium text-sm"
        >
          Login / Sign Up
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#ff3f6c]/10 border border-[#ff3f6c]/30 text-[#ff3f6c] text-xs font-bold tracking-widest uppercase">
          Welcome to the new aesthetic
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3f6c] to-fuchsia-400">Vibe.</span><br/>
          Rule The Feed.
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Take the aesthetic quiz, generate your digital twin, curate stunning lookbooks, and climb the global creators leaderboard. 
        </p>
        
        <Link 
          href="/auth" 
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff3f6c] to-fuchsia-600 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,63,108,0.4)]"
        >
          Enter the Studio
        </Link>
      </section>

      {/* Feature Grid (Bento Box Style) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <FeatureCard 
            title="The Vibe Quiz" 
            desc="Swipe moodboards to discover your tribe. The entire app re-themes instantly to match your aesthetic." 
            icon="🔮" 
          />
          
          <FeatureCard 
            title="Digital Avatar" 
            desc="Design your custom digital twin based on your body type, hair, and skin tone to model your fits." 
            icon="✨" 
          />
          
          <FeatureCard 
            title="Lookbook Studio" 
            desc="Curate Myntra's catalog on an interactive canvas. Add tags, set the mood, and publish your vision." 
            icon="🎨" 
          />
          
          <FeatureCard 
            title="Creators Board" 
            desc="Vote on community looks. Gain followers, rack up engagement points, and dominate the leaderboard." 
            icon="🏆" 
          />
          
        </div>
      </section>
    </main>
  );
}

// Reusable UI Component for the feature cards
function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#ff3f6c]/50 hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm cursor-default">
      <div className="text-4xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform origin-bottom-left w-max">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#ff3f6c] transition-colors">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
    </div>
  );
}