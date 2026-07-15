'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTribeStore } from '@/store/useTribeStore';
import { ArrowLeft, Send, Search, Plus, X, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; 

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

export default function BuilderPage() {
  const router = useRouter();
  const { themeConfig, userGender } = useTribeStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [canvasItems, setCanvasItems] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------------------
  // 🔌 LIVE SUPABASE FETCH
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('products').select('*').limit(50);
        
        if (userGender && userGender !== 'neutral') {
            const genderFilter = userGender === 'male' ? 'Men' : 'Women';
            query = query.eq('gender', genderFilter);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userGender]);

  // -------------------------------------------------------------
  // 🎨 RESKIN ENGINE VARIABLES
  // -------------------------------------------------------------
  const isDark = themeConfig?.mode === 'dark';
  const textColor = themeConfig?.text || '#111111';
  const accentColor = themeConfig?.accent || '#ff3f6c';
  const surfaceColor = themeConfig?.surface || '#FFFFFF';
  const bgColor = themeConfig?.background || '#FFF5F8';
  
  const fontFam = themeConfig?.font || 'Georgia, serif';
  const customFont = fontFam.includes(' ') ? `'${fontFam}', serif` : `${fontFam}, sans-serif`;

  // -------------------------------------------------------------
  // 🧠 SMART CATEGORY MAPPER 
  // Map UI pills ("Tops", "Bottoms") to real DB values ("T-Shirts", "Jeans")
  // -------------------------------------------------------------
  const filteredProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    const aCat = activeCat.toLowerCase();
    
    let matchesCat = false;
    if (activeCat === 'All') {
      matchesCat = true;
    } else if (aCat === 'tops') {
      matchesCat = pCat.includes('shirt') || pCat.includes('top') || pCat.includes('kurta') || pCat.includes('tshirt');
    } else if (aCat === 'bottoms') {
      matchesCat = pCat.includes('jean') || pCat.includes('trouser') || pCat.includes('pant') || pCat.includes('short') || pCat.includes('skirt') || pCat.includes('track');
    } else if (aCat === 'outerwear') {
      matchesCat = pCat.includes('jacket') || pCat.includes('sweatshirt') || pCat.includes('sweater') || pCat.includes('coat') || pCat.includes('hoodie');
    } else if (aCat === 'shoes') {
      matchesCat = pCat.includes('shoe') || pCat.includes('sandal') || pCat.includes('sneaker') || pCat.includes('boot') || pCat.includes('flip') || pCat.includes('heel');
    } else if (aCat === 'accessories') {
      matchesCat = pCat.includes('bag') || pCat.includes('watch') || pCat.includes('belt') || pCat.includes('jewel') || pCat.includes('sunglass') || pCat.includes('wallet') || pCat.includes('backpack');
    } else {
      matchesCat = pCat.includes(aCat);
    }

    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCat && matchesSearch;
  });

  const addToCanvas = (product: Product) => {
    setCanvasItems(prev => [...prev, product]);
  };

  const removeFromCanvas = (indexToRemove: number) => {
    setCanvasItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <main 
      className="min-h-screen px-4 py-8 md:px-10 md:py-10 transition-colors duration-700 font-sans"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1500px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity w-fit"
              style={{ color: textColor }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span 
              className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 transition-colors duration-700" 
              style={{ color: accentColor }}
            >
              Lookbook Builder -
            </span>
            <h1 
              className="text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700" 
              style={{ fontFamily: customFont, color: textColor }}
            >
              Compose your look
            </h1>
          </div>

          <button 
            className="px-8 py-3.5 rounded-full font-bold text-white text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 w-full md:w-auto" 
            style={{ backgroundColor: accentColor }}
          >
            <Send className="w-4 h-4" /> Publish Lookbook
          </button>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[700px]">
          
          {/* LEFT COLUMN: PRODUCTS CATALOG */}
          <div 
            className="lg:col-span-7 flex flex-col gap-6 p-6 md:p-8 rounded-[2rem] shadow-sm transition-colors duration-700 border" 
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }}
          >
            {/* Search Bar */}
            <div className="relative shrink-0">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 opacity-40" style={{ color: textColor }} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full pl-14 pr-6 py-3.5 outline-none transition-colors bg-transparent border shadow-sm text-sm"
                style={{ 
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', 
                  color: textColor 
                }}
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
              {CATEGORIES.map(cat => {
                const isActive = activeCat === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setActiveCat(cat)}
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

            {/* Product Grid */}
            <div className="flex-grow overflow-y-auto no-scrollbar pb-4 pr-2">
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor}40`, borderTopColor: accentColor }} />
                  <p className="text-sm opacity-60" style={{ color: textColor }}>Loading catalog...</p>
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
                        
                        {/* Add to Canvas Button */}
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
          <div 
            className="lg:col-span-5 flex flex-col p-6 md:p-8 rounded-[2rem] shadow-sm transition-colors duration-700 border min-h-[500px]" 
            style={{ 
              backgroundColor: surfaceColor, 
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }}
          >
            {/* Input Form (Title, Desc, Tags) */}
            <div className="flex flex-col gap-5 mb-8 shrink-0">
              <input 
                type="text" 
                placeholder="Title your lookbook..." 
                className="w-full bg-transparent border-b pb-2 outline-none text-lg font-bold transition-colors placeholder:font-normal"
                style={{ 
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  color: textColor, 
                  fontFamily: customFont 
                }}
              />
              <input 
                type="text" 
                placeholder="Add a description..." 
                className="w-full bg-transparent border-b pb-2 outline-none text-sm transition-colors placeholder:opacity-60"
                style={{ 
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  color: textColor 
                }}
              />
              <input 
                type="text" 
                placeholder="tags, comma, separated" 
                className="w-full bg-transparent border-b pb-2 outline-none text-sm transition-colors placeholder:opacity-60"
                style={{ 
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  color: textColor 
                }}
              />
            </div>

            {/* Canvas Drop Zone */}
            <div className="flex-grow flex flex-col relative overflow-hidden bg-black/5 rounded-[1.5rem] border border-black/5">
              
              {canvasItems.length === 0 ? (
                // EMPTY STATE (Fixed Layout - Anchored near top so no scrolling needed)
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-start pt-16 text-center p-6 w-full h-full"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: `${accentColor}15` }}>
                      <ImagePlus className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <h3 className="text-xl font-bold mb-1.5 tracking-tight transition-colors duration-700" style={{ fontFamily: customFont, color: textColor }}>
                      Empty canvas
                    </h3>
                    <p className="text-xs opacity-60 max-w-[200px] transition-colors duration-700" style={{ color: textColor }}>
                      Tap products on the left to build your look.
                    </p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                // FILLED STATE
                <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar content-start">
                  <AnimatePresence>
                    {canvasItems.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={`${item.id}-${idx}`} 
                        className="relative group rounded-[1.25rem] overflow-hidden shadow-sm aspect-[4/5] border border-black/5"
                      >
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeFromCanvas(idx)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}