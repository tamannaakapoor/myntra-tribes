'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTribeStore } from '@/store/useTribeStore';
import { useCartStore } from '@/store/useCartStore';
import { Heart, ThumbsUp, Bookmark, ArrowLeft, Search, Loader2, Plus, Flame, Zap, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 👇 DYNAMIC MINI AVATAR COMPONENT ---
function MiniAvatar2D({ skinTone, hairStyle, bodyType = 'Slim' }: { skinTone: string, hairStyle: string, bodyType?: string }) {
  const bodyWidth = bodyType === 'Slim' ? 70 : bodyType === 'Athletic' ? 85 : bodyType === 'Curvy' ? 105 : 125;
  return (
    <svg viewBox="0 0 200 300" className="w-16 h-24 drop-shadow-xl absolute bottom-4 right-4 z-10 pointer-events-none">
      <defs>
        <linearGradient id="miniDress" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff4d79" />
          <stop offset="100%" stopColor="#ff99b3" />
        </linearGradient>
      </defs>
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />}
      
      <rect x="85" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <rect x="105" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <ellipse cx="90" cy="285" rx="12" ry="7" fill="#ff99b3" />
      <ellipse cx="110" cy="285" rx="12" ry="7" fill="#ff99b3" />
      <rect x="92" y="110" width="16" height="20" fill={skinTone} />
      
      <path d={`M ${100 - bodyWidth/2} 125 L ${100 + bodyWidth/2} 125 L ${100 + bodyWidth/2 - 5} 220 L ${100 - bodyWidth/2 + 5} 220 Z`} fill="url(#miniDress)" />
      
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <circle cx="72" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <circle cx="128" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <path d="M 92 92 Q 100 100 108 92" stroke="#ff4d79" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
      
      {hairStyle !== 'Buzz' && <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />}
      {hairStyle === 'Buzz' && <path d="M 62 80 A 38 38 0 0 1 138 80 A 40 40 0 0 0 62 80 Z" fill="#2C1B18" opacity="0.8" />}
    </svg>
  );
}

// --- 👇 MASSIVELY EXPANDED VIBE IMAGES ---
const TRIBE_IMAGES = {
  'Neon Static': [
    'https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=735&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608690158878-1a96b29b455b?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=400&auto=format&fit=crop'
  ],
  'Vault Heir': [
    'https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?q=80&w=1074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1632996547902-064471618ef0?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-82a88b22e1b1?q=80&w=400&auto=format&fit=crop'
  ],
  'Golden Hour': [
    'https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=687&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507501336603-6e31db2be093?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4b95d4ebf048?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop'
  ]
};

// Fallback clothing items in case the backend doesn't send the product image
const FALLBACK_PRODUCTS = [
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400&auto=format&fit=crop',
];

const getTribeImage = (tribeName: string, lookbookId: string) => {
  const idString = lookbookId ? String(lookbookId) : "fallback";
  const hash = idString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (tribeName.includes('Neon')) return TRIBE_IMAGES['Neon Static'][hash % TRIBE_IMAGES['Neon Static'].length];
  if (tribeName.includes('Vault')) return TRIBE_IMAGES['Vault Heir'][hash % TRIBE_IMAGES['Vault Heir'].length];
  return TRIBE_IMAGES['Golden Hour'][hash % TRIBE_IMAGES['Golden Hour'].length];
};

// --- MOCK DATA (Updated to reflect actual DB schema) ---
const FEED_MOCK = [
  {
    id: 'mock-1', title: "Summer Breeze", handle: "@ananya_style", pieces: 2,
    desc: "Flutter sleeves and maxi lengths for the perfect summer day.",
    tribe: "Golden Hour", likes: 84, loves: 241, saves: 45, skin: "#C29270", hair: "Long", bodyType: "Slim",
    productImage: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/15/c4UY2Jlc_db36b99333b942c29e8fe70205d2a308.jpg",
    featuredProduct: { brand: "DressBerry", discount: "(61% OFF)" }
  },
  {
    id: 'mock-2', title: "Midnight Cyber", handle: "@kavya_neon", pieces: 5,
    desc: "Holographic textures and dark streets. Main character activated.",
    tribe: "Neon Static", likes: 112, loves: 305, saves: 89, skin: "#8A5A44", hair: "Bob", bodyType: "Slim",
    productImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
    featuredProduct: { brand: "Roadster", discount: "(40% OFF)" }
  },
  {
    id: 'mock-3', title: "Vintage Archive", handle: "@priya_y2k", pieces: 3,
    desc: "Rifling through the 90s archive. Denim on denim.",
    tribe: "Vault Heir", likes: 67, loves: 189, saves: 32, skin: "#F3D9C6", hair: "Long", bodyType: "Athletic",
    productImage: "https://images.unsplash.com/photo-1632996547902-064471618ef0?q=80&w=400&auto=format&fit=crop",
    featuredProduct: { brand: "Levis", discount: "(15% OFF)" }
  }
];

const TRIBES = ["All Tribes", "✨ Golden Hour", "🔥 Neon Static", "🦋 Vault Heir"];

export default function FeedPage() {
  const router = useRouter();
  const themeConfig = useTribeStore((state) => state.themeConfig);
  const globalTribe = useTribeStore((state: any) => state.tribe || state.slug || 'golden-hour');
  
  const cartCount = useCartStore((state) => state.getTotalItems());
  const [activeTribe, setActiveTribe] = useState("All Tribes");
  const [combinedFeed, setCombinedFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('tribe_jwt');
      let liveAvatar = { skin_color: '#F3D9C6', hair: 'Long', body_type: 'Slim' };
      let liveUsername = 'creator';

      try {
        const userStr = localStorage.getItem('tribe_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          liveUsername = userObj.username || userObj.name || 'creator';
        }

        if (token) {
          const avatarRes = await fetch(`${getApiUrl()}/avatar/me`, { headers: { "Authorization": `Bearer ${token}` }});
          if (avatarRes.ok) {
            const data = await avatarRes.json();
            const avatarData = data.avatar || data.data || data;
            if (avatarData?.skin_color) liveAvatar = avatarData;
          }
        }

        if (token) {
          const lookbooksRes = await fetch(`${getApiUrl()}/lookbooks`, { headers: { "Authorization": `Bearer ${token}` }});
          if (lookbooksRes.ok) {
            const lookbooksData = await lookbooksRes.json();
            const liveBooks = lookbooksData.lookbooks || lookbooksData.data || lookbooksData;
            
            if (Array.isArray(liveBooks)) {
              const formattedLivePosts = liveBooks.map((lb: any) => {
                
                const idHash = (lb.id || "fallback").split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                
                // 👇 Extract the actual rich Myntra product object from the DB
                let featuredProductObj = null;
                let firstProductImg = FALLBACK_PRODUCTS[idHash % FALLBACK_PRODUCTS.length];
                
                if (Array.isArray(lb.products) && lb.products.length > 0) {
                  // Find the first valid product object that has an image_url
                  const validProducts = lb.products.filter((p: any) => typeof p === 'object' && p !== null && p.image_url);
                  if (validProducts.length > 0) {
                    featuredProductObj = validProducts[0];
                    firstProductImg = featuredProductObj.image_url;
                  }
                }

                let mappedTribe = "Golden Hour";
                if (globalTribe === 'neon-static') mappedTribe = "Neon Static";
                if (globalTribe === 'vault-heir') mappedTribe = "Vault Heir";

                return {
                  id: lb.id || Math.random().toString(),
                  title: lb.title || "Untitled Look",
                  handle: `@${liveUsername}`,
                  pieces: Array.isArray(lb.products) ? lb.products.length : 0,
                  desc: lb.description || "",
                  tribe: mappedTribe,
                  likes: Math.floor(Math.random() * 50),
                  loves: Math.floor(Math.random() * 50),
                  saves: Math.floor(Math.random() * 20),
                  skin: liveAvatar.skin_color,
                  hair: liveAvatar.hair,
                  bodyType: liveAvatar.body_type,
                  productImage: firstProductImg,
                  featuredProduct: featuredProductObj // Attach the full DB object here
                };
              });

              setCombinedFeed([...formattedLivePosts.reverse(), ...FEED_MOCK]);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.warn("Could not fetch live feed. Loading mock data.");
      }
      
      setCombinedFeed(FEED_MOCK);
      setIsLoading(false);
    };

    fetchData();
  }, [globalTribe]);

  const filteredFeed = activeTribe === "All Tribes" 
    ? combinedFeed 
    : combinedFeed.filter(look => activeTribe.includes(look.tribe));

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-20">
      
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-[#ff3f6c]/20">M</div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="text-[#666666] hover:text-black">Home</button>
            <button className="px-4 py-2 bg-black/5 rounded-full font-bold">Feed</button>
            <button onClick={() => router.push('/leaderboard')} className="text-[#666666] hover:text-black">Leaderboard</button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48] shadow-md shadow-[#ff3f6c]/20">
              <Plus className="w-4 h-4" /> Create
            </button>
            <button onClick={() => router.push('/checkout')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors ml-4">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#ff3f6c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#ff3f6c] uppercase mb-2">Creator Feed</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>The Tribes runway</h1>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-[#FBCFE8]/50 shadow-sm">
            <button className="px-4 py-2 rounded-full bg-[#ff3f6c] text-white text-sm font-bold flex items-center gap-2"><Flame className="w-4 h-4"/> Trending</button>
            <button className="px-4 py-2 rounded-full text-[#666666] hover:text-black text-sm font-bold flex items-center gap-2"><Zap className="w-4 h-4"/> New</button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
          {TRIBES.map(t => (
            <button 
              key={t} onClick={() => setActiveTribe(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border shadow-sm ${
                activeTribe === t ? 'bg-[#ff3f6c] text-white border-[#ff3f6c]' : 'bg-white text-[#111111] border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-8 h-8 animate-spin text-[#ff3f6c]" />
             <p className="text-sm font-medium opacity-60">Loading the latest drops...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredFeed.map((look) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={look.id} 
                  onClick={() => router.push(`/lookbook/${look.id}`)}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#FBCFE8]/30 group cursor-pointer hover:-translate-y-1"
                >
                  
                  <div className="h-[320px] w-full p-2 flex gap-2 relative bg-white">
                    
                    {/* Left Side: Tribe Vibe Aesthetic */}
                    <div 
                      className="w-1/2 h-full rounded-2xl bg-cover bg-center relative overflow-hidden group-hover:brightness-95 transition-all" 
                      style={{ backgroundImage: `url('${getTribeImage(look.tribe, look.id)}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold text-white tracking-widest uppercase border border-white/20 shadow-sm">
                        {look.tribe}
                      </div>
                    </div>

                    {/* 👇 FIXED: Right Side Product Image with Myntra Brand Badges */}
                    <div 
                      className="w-1/2 h-full rounded-2xl bg-cover bg-center relative overflow-hidden bg-black/5" 
                      style={{ backgroundImage: `url('${look.productImage}')` }}
                    >
                      {/* Show the Brand name tag if it exists in the DB */}
                      {look.featuredProduct?.brand && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-bold text-[#111111] uppercase tracking-wider shadow-sm">
                          {look.featuredProduct.brand}
                        </div>
                      )}

                      {/* Show the Discount badge if it exists in the DB */}
                      {look.featuredProduct?.discount && look.featuredProduct.discount.includes('%') && (
                        <div className="absolute bottom-3 right-3 bg-[#ff3f6c] px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm">
                          {look.featuredProduct.discount}
                        </div>
                      )}
                    </div>
                    
                    <MiniAvatar2D skinTone={look.skin} hairStyle={look.hair} bodyType={look.bodyType} />
                  </div>

                  <div className="p-6 relative bg-white">
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{look.title}</h3>
                    <p className="text-xs text-[#888888] mb-3">{look.handle} • {look.pieces} pieces</p>
                    <p className="text-[#666666] text-sm mb-5 leading-relaxed line-clamp-2">{look.desc}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-[#888888] text-sm font-medium">
                        <span className="flex items-center gap-1 group-hover:text-[#ff3f6c] transition-colors"><ThumbsUp className="w-4 h-4" /> {look.likes}</span>
                        <span className="flex items-center gap-1 group-hover:text-[#ff3f6c] transition-colors"><Heart className="w-4 h-4" /> {look.loves}</span>
                        <span className="flex items-center gap-1 group-hover:text-[#ff3f6c] transition-colors"><Bookmark className="w-4 h-4" /> {look.saves}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </main>
  );
}