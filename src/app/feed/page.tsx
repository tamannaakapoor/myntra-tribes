'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTribeStore } from '@/store/useTribeStore';
import { useCartStore } from '@/store/useCartStore';
import { Heart, ThumbsUp, Bookmark, Loader2, Plus, Flame, Zap, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- VIBE / TRIBE HERO IMAGES ---
const TRIBE_VIBE_IMAGE: Record<string, string> = {
  'Neon Static': 'https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=735&auto=format&fit=crop',
  'Vault Heir': 'https://images.unsplash.com/photo-1626259189871-6b2e1daac55e?q=80&w=1074&auto=format&fit=crop',
  'Golden Hour': 'https://images.unsplash.com/photo-1594898995230-1fe3e3893965?q=80&w=687&auto=format&fit=crop',
};
const DEFAULT_VIBE_IMAGE = TRIBE_VIBE_IMAGE['Golden Hour'];

const FALLBACK_PRODUCTS = [
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400&auto=format&fit=crop',
];

const FEED_MOCK = [
  {
    id: 'mock-1', title: "Summer Breeze", handle: "@ananya_style", pieces: 2,
    desc: "Flutter sleeves and maxi lengths for the perfect summer day.",
    tribe: "Golden Hour", likes: 84, loves: 241, saves: 45,
    productImage: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2026/MAY/15/c4UY2Jlc_db36b99333b942c29e8fe70205d2a308.jpg",
    featuredProduct: { brand: "DressBerry", discount: "(61% OFF)" },
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'mock-2', title: "Midnight Cyber", handle: "@kavya_neon", pieces: 5,
    desc: "Holographic textures and dark streets. Main character activated.",
    tribe: "Neon Static", likes: 112, loves: 305, saves: 89,
    productImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
    featuredProduct: { brand: "Roadster", discount: "(40% OFF)" },
    createdAt: '2026-05-08T10:00:00Z',
  },
  {
    id: 'mock-3', title: "Vintage Archive", handle: "@priya_y2k", pieces: 3,
    desc: "Rifling through the 90s archive. Denim on denim.",
    tribe: "Vault Heir", likes: 67, loves: 189, saves: 32,
    productImage: "https://images.unsplash.com/photo-1632996547902-064471618ef0?q=80&w=400&auto=format&fit=crop",
    featuredProduct: { brand: "Levis", discount: "(15% OFF)" },
    createdAt: '2026-05-05T10:00:00Z',
  }
];

const TRIBES = ["All Tribes", "✨ Golden Hour", "🔥 Neon Static", "🦋 Vault Heir"];

const hashString = (value: string) =>
  String(value).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const getVibeImage = (tribeName: string) => TRIBE_VIBE_IMAGE[tribeName] || DEFAULT_VIBE_IMAGE;

export default function FeedPage() {
  const router = useRouter();
  const globalTribe = useTribeStore((state: any) => state.tribe || state.slug || 'golden-hour');
  const cartCount = useCartStore((state) => state.getTotalItems());

  const [activeTribe, setActiveTribe] = useState("All Tribes");
  const [sortMode, setSortMode] = useState<'trending' | 'new'>('trending');
  const [combinedFeed, setCombinedFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;
    return url;
  };

  const resolveProduct = (lookbook: any, productsById: Record<string, any>) => {
    if (Array.isArray(lookbook.products) && lookbook.products.length > 0) {
      for (const entry of lookbook.products) {
        if (typeof entry === 'object' && entry !== null && entry.image_url) return entry;
        if (typeof entry === 'string' && productsById[entry]?.image_url) return productsById[entry];
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('tribe_jwt');
      let liveUsername = 'creator';

      try {
        const userStr = localStorage.getItem('tribe_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          liveUsername = userObj.username || userObj.name || 'creator';
        }

        if (token) {
          const lookbooksRes = await fetch(`${getApiUrl()}/lookbooks`, { headers: { "Authorization": `Bearer ${token}` } });
          if (lookbooksRes.ok) {
            const lookbooksData = await lookbooksRes.json();
            const liveBooks = lookbooksData.lookbooks || lookbooksData.data || lookbooksData;

            if (Array.isArray(liveBooks)) {
              const looseIds = new Set<string>();
              liveBooks.forEach((lb: any) => {
                (lb.products || []).forEach((p: any) => {
                  if (typeof p === 'string') looseIds.add(p);
                });
              });

              let productsById: Record<string, any> = {};
              if (looseIds.size > 0) {
                try {
                  const idsParam = Array.from(looseIds).join(',');
                  const productsRes = await fetch(`${getApiUrl()}/products?ids=${encodeURIComponent(idsParam)}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    const list = productsData.products || productsData.data || productsData;
                    if (Array.isArray(list)) {
                      productsById = Object.fromEntries(list.map((p: any) => [String(p.myntra_id || p.id), p]));
                    }
                  }
                } catch {
                  // Non-fatal
                }
              }

              const formattedLivePosts = liveBooks.map((lb: any) => {
                const resolvedProduct = resolveProduct(lb, productsById);
                const idHash = hashString(lb.id || 'fallback');

                // 👇 SMART TRIBE RESOLVER (Fixes the Golden Hour bug)
                let mappedTribe = "Golden Hour";
                
                // 1. If backend has it explicitly saved
                if (lb.tribe) {
                  const t = String(lb.tribe).toLowerCase();
                  if (t.includes('neon')) mappedTribe = "Neon Static";
                  else if (t.includes('vault')) mappedTribe = "Vault Heir";
                } 
                // 2. Fallback: Parse the AI generated Title/Description to guess the tribe
                else {
                  const searchStr = `${lb.title || ''} ${lb.description || ''}`.toLowerCase();
                  if (searchStr.includes('neon') || searchStr.includes('cyber') || searchStr.includes('static')) {
                    mappedTribe = "Neon Static";
                  } else if (searchStr.includes('vault') || searchStr.includes('heir') || searchStr.includes('y2k') || searchStr.includes('archive')) {
                    mappedTribe = "Vault Heir";
                  } else {
                    // 3. Absolute fallback to whatever is in the local store right now
                    if (globalTribe === 'neon-static') mappedTribe = "Neon Static";
                    if (globalTribe === 'vault-heir') mappedTribe = "Vault Heir";
                  }
                }

                return {
                  id: lb.id || Math.random().toString(),
                  title: lb.title || "Untitled Look",
                  handle: `@${lb.creator?.username || lb.creator?.name || liveUsername}`,
                  pieces: Array.isArray(lb.products) ? lb.products.length : 0,
                  desc: lb.description || "",
                  tribe: mappedTribe,
                  likes: lb.likes_count ?? Math.floor(Math.random() * 50),
                  loves: lb.loves_count ?? Math.floor(Math.random() * 50),
                  saves: lb.saves_count ?? Math.floor(Math.random() * 20),
                  productImage: resolvedProduct?.image_url || FALLBACK_PRODUCTS[idHash % FALLBACK_PRODUCTS.length],
                  featuredProduct: resolvedProduct,
                  createdAt: lb.created_at || lb.createdAt || new Date().toISOString(),
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

  // Filtering correctly handles the emoji tags because we match the core string
  const filteredFeed = activeTribe === "All Tribes"
    ? combinedFeed
    : combinedFeed.filter(look => activeTribe.includes(look.tribe));

  const sortedFeed = [...filteredFeed].sort((a, b) => {
    if (sortMode === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    const scoreA = (a.likes || 0) + (a.loves || 0) + (a.saves || 0);
    const scoreB = (b.likes || 0) + (b.loves || 0) + (b.saves || 0);
    return scoreB - scoreA;
  });

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
            <button
              onClick={() => setSortMode('trending')}
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${sortMode === 'trending' ? 'bg-[#ff3f6c] text-white' : 'text-[#666666] hover:text-black'}`}
            >
              <Flame className="w-4 h-4" /> Trending
            </button>
            <button
              onClick={() => setSortMode('new')}
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${sortMode === 'new' ? 'bg-[#ff3f6c] text-white' : 'text-[#666666] hover:text-black'}`}
            >
              <Zap className="w-4 h-4" /> New
            </button>
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
              {sortedFeed.map((look) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={look.id}
                  onClick={() => router.push(`/lookbook/${look.id}`)}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#FBCFE8]/30 group cursor-pointer hover:-translate-y-1"
                >

                  <div className="h-[320px] w-full p-2 flex gap-2 relative bg-white">

                    {/* Left: tribe vibe image */}
                    <div
                      className="w-1/2 h-full rounded-2xl bg-cover bg-center relative overflow-hidden group-hover:brightness-95 transition-all"
                      style={{ backgroundImage: `url('${getVibeImage(look.tribe)}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold text-white tracking-widest uppercase border border-white/20 shadow-sm">
                        {look.tribe}
                      </div>
                    </div>

                    {/* Right: real product image */}
                    <div
                      className="w-1/2 h-full rounded-2xl bg-cover bg-center relative overflow-hidden bg-black/5"
                      style={{ backgroundImage: `url('${look.productImage}')` }}
                    >
                      {look.featuredProduct?.brand && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-bold text-[#111111] uppercase tracking-wider shadow-sm">
                          {look.featuredProduct.brand}
                        </div>
                      )}
                      {look.featuredProduct?.discount && String(look.featuredProduct.discount).includes('%') && (
                        <div className="absolute bottom-3 right-3 bg-[#ff3f6c] px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm">
                          {look.featuredProduct.discount}
                        </div>
                      )}
                    </div>
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