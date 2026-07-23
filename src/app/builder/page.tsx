'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTribeStore } from '@/store/useTribeStore';
import { ArrowLeft, Send, Search, Plus, X, ImagePlus, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Product {
  id: string;
  myntra_id?: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  brand?: string;
  gender?: string;
}

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

// --- 👇 DYNAMIC MINI AVATAR COMPONENT ---
function MiniAvatar({ skinTone, hairStyle, bodyType }: { skinTone: string, hairStyle: string, bodyType: string }) {
  const bodyWidth = bodyType === 'Slim' ? 70 : bodyType === 'Athletic' ? 85 : bodyType === 'Curvy' ? 105 : 125;
  return (
    <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl">
      <defs>
        <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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
      <path d={`M ${100 - bodyWidth/2} 125 L ${100 + bodyWidth/2} 125 L ${100 + bodyWidth/2 - 5} 220 L ${100 - bodyWidth/2 + 5} 220 Z`} fill="url(#dressGrad)" />
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

export default function BuilderPage() {
  const router = useRouter();
  const { themeConfig, currentTribe } = useTribeStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [canvasItems, setCanvasItems] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  // AI Feature State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const [avatarConfig, setAvatarConfig] = useState<any>(null);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) {
      url = `${url.replace(/\/$/, "")}/api`;
    }
    return url;
  };

  useEffect(() => {
    const token = localStorage.getItem('tribe_jwt');

    const fetchAvatar = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${getApiUrl()}/avatar/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const savedAvatar = data.avatar || data.data || data;
          if (savedAvatar && savedAvatar.skin_color) {
            setAvatarConfig(savedAvatar);
          }
        }
      } catch (error) {
        console.warn("Could not fetch avatar for builder.", error);
      }
    };
    fetchAvatar();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const tribeSlug =
          currentTribe && currentTribe !== "default"
            ? currentTribe
            : "neon-static";

        let endpoint = `${getApiUrl()}/products?tribe=${encodeURIComponent(tribeSlug)}`;
        
        if (searchQuery) {
          endpoint += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Backend responded with an error");
        
        const data = await res.json();
        let fetchedProducts = [];
        if (data.products && Array.isArray(data.products)) fetchedProducts = data.products;
        else if (Array.isArray(data)) fetchedProducts = data;
        else if (data.data && Array.isArray(data.data)) fetchedProducts = data.data;
        
        const womenProducts = fetchedProducts.filter((p: Product) => 
          p.gender === 'Women' || p.gender === 'Girls' || !p.gender
        );

        setProducts(womenProducts);
      } catch (error) {
        console.error("Failed to fetch products. Loading fallbacks.", error);
        setProducts([
          { id: '1', name: 'Y2K Crop Top', price: 999, category: 'Tops', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
          { id: '2', name: 'Baggy Denim', price: 1999, category: 'Bottoms', image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400' },
          { id: '3', name: 'Chunky Sneakers', price: 2499, category: 'Shoes', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
          { id: '4', name: 'Vintage Leather Jacket', price: 3499, category: 'Outerwear', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentTribe]);

  // --- 👇 NEW AI GENERATOR FUNCTION ---
  const handleAIGenerate = async () => {
    if (canvasItems.length === 0) return;
    
    setIsGeneratingAI(true);
    
    try {
      const token = localStorage.getItem('tribe_jwt');
      const tribeName = currentTribe && currentTribe !== "default" ? currentTribe : "Neon Static";
      
      const payload = {
        tribe: tribeName,
        items: canvasItems.map(p => p.name)
      };

      console.log("🚀 Sending to AI Editor:", payload);

      const response = await fetch(`${getApiUrl()}/ai/editorial`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
  const errText = await response.text();
  console.error("🛑 Backend Rejected AI Request:", errText);
  throw new Error(`AI Endpoint Failed: ${response.status}`);
}

      const data = await response.json();

      if (data.success && data.editorial) {
        setTitle(data.editorial.title);
        setDescription(data.editorial.description);
        setTags(data.editorial.hashtags.join(" "));
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      // Native browser alert or toast depending on what you prefer
      alert("Couldn't generate editorial. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const handlePublish = async () => {
    if (!title.trim()) return alert("Please give your lookbook a title!");
    if (canvasItems.length === 0) return alert("Please add at least one product to the canvas!");

    setIsPublishing(true);
    
    try {
      const token = localStorage.getItem('tribe_jwt');
      const productsArray = canvasItems.map(item => item.id);
      const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const response = await fetch(`${getApiUrl()}/lookbooks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: title,
          description: description,
          tags: tagsArray,
          products: productsArray,
          tribe: currentTribe && currentTribe !== "default" ? currentTribe : "Golden Hour"
        })
      });

      const data = await response.json();

      if (data.success || response.ok) {
        router.push('/feed');
      } else {
        alert(data.message || "Failed to publish lookbook.");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Something went wrong while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const isDark = themeConfig?.mode === 'dark';
  const textColor = themeConfig?.text || '#111111';
  const accentColor = themeConfig?.accent || '#ff3f6c';
  const surfaceColor = themeConfig?.surface || '#FFFFFF';
  const bgColor = themeConfig?.background || '#FFF5F8';
  const fontFam = themeConfig?.font || 'Georgia, serif';
  const customFont = fontFam.includes(' ') ? `'${fontFam}', serif` : `${fontFam}, sans-serif`;

  const filteredProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    const aCat = activeCat.toLowerCase();
    if (activeCat === 'All') return true;
    if (aCat === 'tops') return pCat.includes('shirt') || pCat.includes('top') || pCat.includes('kurta') || pCat.includes('tshirt');
    if (aCat === 'bottoms') return pCat.includes('jean') || pCat.includes('trouser') || pCat.includes('pant') || pCat.includes('short') || pCat.includes('skirt') || pCat.includes('track');
    if (aCat === 'outerwear') return pCat.includes('jacket') || pCat.includes('sweatshirt') || pCat.includes('sweater') || pCat.includes('coat') || pCat.includes('hoodie');
    if (aCat === 'shoes') return pCat.includes('shoe') || pCat.includes('sandal') || pCat.includes('sneaker') || pCat.includes('boot') || pCat.includes('flip') || pCat.includes('heel');
    if (aCat === 'accessories') return pCat.includes('bag') || pCat.includes('watch') || pCat.includes('belt') || pCat.includes('jewel') || pCat.includes('sunglass') || pCat.includes('wallet') || pCat.includes('backpack');
    return pCat.includes(aCat);
  });

  const addToCanvas = (product: Product) => setCanvasItems(prev => [...prev, product]);
  const removeFromCanvas = (indexToRemove: number) => setCanvasItems(prev => prev.filter((_, idx) => idx !== indexToRemove));

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 md:py-10 transition-colors duration-700 font-sans" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1500px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity w-fit" style={{ color: textColor }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 transition-colors duration-700" style={{ color: accentColor }}>
              Lookbook Builder -
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700" style={{ fontFamily: customFont, color: textColor }}>
              Compose your look
            </h1>
          </div>

          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-8 py-3.5 rounded-full font-bold text-white text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 w-full md:w-auto disabled:opacity-70 disabled:hover:translate-y-0" 
            style={{ backgroundColor: accentColor }}
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isPublishing ? "Publishing..." : "Publish Lookbook"}
          </button>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[700px]">
          
          {/* LEFT COLUMN: PRODUCTS CATALOG */}
          <div className="lg:col-span-7 flex flex-col gap-6 p-6 md:p-8 rounded-[2rem] shadow-sm transition-colors duration-700 border" style={{ backgroundColor: surfaceColor, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
            <div className="relative shrink-0">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 opacity-40" style={{ color: textColor }} />
              <input 
                type="text" 
                placeholder="Search products (e.g., dress, jeans)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full pl-14 pr-6 py-3.5 outline-none transition-colors bg-transparent border shadow-sm text-sm"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', color: textColor }}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
              {CATEGORIES.map(cat => {
                const isActive = activeCat === cat;
                return (
                  <button 
                    key={cat} onClick={() => setActiveCat(cat)}
                    className="px-5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shadow-sm"
                    style={{ 
                      backgroundColor: isActive ? accentColor : 'transparent',
                      color: isActive ? (isDark ? '#000' : '#fff') : textColor,
                      borderColor: isActive ? accentColor : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            <div className="flex-grow overflow-y-auto no-scrollbar pb-4 pr-2">
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor}40`, borderTopColor: accentColor }} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-50 gap-2" style={{ color: textColor }}>
                  <Search className="w-8 h-8" />
                  <p>No products found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="flex flex-col group cursor-pointer">
                      <div className="relative aspect-[4/5] rounded-[1.25rem] overflow-hidden mb-3 bg-black/5 border border-black/5">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <button 
                          onClick={() => addToCanvas(p)}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
                        >
                          <Plus className="w-4 h-4" style={{ color: accentColor }} />
                        </button>
                      </div>
                      <h3 className="text-xs font-bold leading-tight truncate pr-2" style={{ color: textColor }}>{p.name}</h3>
                      <p className="text-xs opacity-60 mt-1" style={{ color: textColor }}>₹{p.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CANVAS BUILDER */}
          <div className="lg:col-span-5 flex flex-col p-6 md:p-8 rounded-[2rem] shadow-sm transition-colors duration-700 border min-h-[500px]" style={{ backgroundColor: surfaceColor, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
            
            <div className="flex flex-col gap-5 mb-8 shrink-0">
              {/* 👇 FIXED: AI Editor Button beside Title */}
              <div className="flex items-center justify-between gap-4 w-full">
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title your lookbook..." 
                  className="flex-grow bg-transparent border-b pb-2 outline-none text-lg font-bold transition-colors placeholder:font-normal"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: textColor, fontFamily: customFont }}
                />
                
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI || canvasItems.length === 0}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    color: textColor,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }}
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" style={{ color: accentColor }} /> ⏳ Writing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" style={{ color: accentColor }} /> AI Fashion Editor
                    </>
                  )}
                </button>
              </div>

              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..." 
                className="w-full bg-transparent border-b pb-2 outline-none text-sm transition-colors placeholder:opacity-60"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: textColor }}
              />
              <input 
                type="text" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="#tags #space #separated" 
                className="w-full bg-transparent border-b pb-2 outline-none text-sm transition-colors placeholder:opacity-60"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: textColor }}
              />
            </div>

            {/* Canvas Drop Zone */}
            <div className="flex-grow flex flex-col relative overflow-hidden bg-black/5 rounded-[1.5rem] border border-black/5">
              {canvasItems.length === 0 ? (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-start pt-16 text-center p-6 w-full h-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: `${accentColor}15` }}>
                      <ImagePlus className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <h3 className="text-xl font-bold mb-1.5 tracking-tight transition-colors duration-700" style={{ fontFamily: customFont, color: textColor }}>Empty canvas</h3>
                    <p className="text-xs opacity-60 max-w-[200px] transition-colors duration-700" style={{ color: textColor }}>Tap products on the left to build your look.</p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <>
                  <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar content-start">
                    <AnimatePresence>
                      {canvasItems.map((item, idx) => (
                        <motion.div key={`${item.id}-${idx}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group rounded-[1.25rem] overflow-hidden shadow-sm aspect-[4/5] border border-black/5">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          <button onClick={() => removeFromCanvas(idx)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm"><X className="w-3 h-3" /></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {avatarConfig && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="absolute bottom-4 right-4 w-[70px] h-[110px] z-20 pointer-events-none drop-shadow-2xl"
                    >
                      <MiniAvatar 
                        skinTone={avatarConfig.skin_color} 
                        hairStyle={avatarConfig.hair} 
                        bodyType={avatarConfig.body_type} 
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}