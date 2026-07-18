'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, UploadCloud, CheckCircle2, Clock, Leaf, Tag, Info, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MOCK DATA FOR THE "BUY" STOREFRONT ---
const THRIFT_STORE_ITEMS = [
  { id: 101, name: 'Vintage Oversized Denim', brand: 'Levi\'s', pts: 450, condition: 'Gently Used', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop' },
  { id: 102, name: 'Y2K Cyber Graphic Tee', brand: 'Zara', pts: 300, condition: 'Like New', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop' },
  { id: 103, name: 'Chunky Retro Sneakers', brand: 'H&M', pts: 800, condition: 'Worn Once', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop' },
  { id: 104, name: 'Satin Slip Dress', brand: 'Urban Outfitters', pts: 550, condition: 'Good', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop' },
  { id: 105, name: 'Faded Leather Jacket', brand: 'Thrifted', pts: 1200, condition: 'Vintage', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop' },
  { id: 106, name: 'Corduroy Tote Bag', brand: 'Handmade', pts: 250, condition: 'Brand New', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop' },
];

export default function ThriftPage() {
  const router = useRouter();
  
  // 🧭 VIEW STATE: 'landing' | 'buy' | 'sell'
  const [viewMode, setViewMode] = useState<'landing' | 'buy' | 'sell'>('landing');

  // --- SELL FORM STATE ---
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<number | ''>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // --- SELL SUBMISSION & HISTORY STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;
    return url;
  };

  // 🧮 DYNAMIC POINTS CALCULATOR (Frontend Preview)
  const calculatePoints = (freq: number | '') => {
    if (freq === '' || freq <= 0) return 150; 
    return 150 + Math.floor((1 / Number(freq)) * 200);
  };
  const estimatedPoints = calculatePoints(frequency);

  // 🚀 FETCH SUPABASE HISTORY ON MOUNT
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('tribe_jwt');
      if (!token) return;

      try {
        const response = await fetch(`${getApiUrl()}/gelapha/history`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          const formattedHistory = result.data.map((item: any) => ({
            id: item.id,
            name: item.item_name,
            category: item.category,
            status: item.status,
            points: item.status === 'Approved' ? item.awarded_points : item.estimated_points,
            date: new Date(item.created_at).toLocaleDateString(),
            image: item.image_url
          }));
          
          setHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 📸 HANDLE REAL LOCAL IMAGE SELECTION
  const handleImageDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setImagePreview(localPreviewUrl);
    }
  };

  // 🚀 SUBMIT TO SUPABASE CLOUD & EXPRESS API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !category || frequency === '' || !imageFile) {
      alert("Please fill out all fields and upload an image!");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('tribe_jwt');

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gelapha_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        alert("Failed to upload image. Tell Aditi to check bucket permissions!");
        setIsSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('gelapha_images').getPublicUrl(filePath);

      let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
      if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;

      const response = await fetch(`${url}/gelapha/submit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          itemName: itemName,
          category: category,
          frequencyUsed: Number(frequency),
          imageUrl: publicUrl
        })
      });

      if (response.ok) {
        const result = await response.json();
        const dbItem = result.data;
        
        const newItem = {
          id: dbItem.id,
          name: dbItem.item_name,
          category: dbItem.category,
          status: dbItem.status,
          points: dbItem.estimated_points,
          date: 'Just now',
          image: dbItem.image_url
        };

        setHistory([newItem, ...history]);
        setItemName('');
        setCategory('');
        setFrequency('');
        setImagePreview(null);
        setImageFile(null);
      } else {
        alert("Image uploaded, but failed to save to database. Is Aditi's backend running?");
      }
    } catch (error) {
      console.error("API connection failed:", error);
      alert("Network error connecting to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchase = (itemName: string, pts: number) => {
    // MVP Mock Purchase Function
    alert(`Successfully purchased ${itemName} for ${pts} points! (Points deducted from your account)`);
  };

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-20 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
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
            <button onClick={() => router.push('/feed')} className="text-[#666666] hover:text-black">Feed</button>
            <button onClick={() => router.push('/leaderboard')} className="text-[#666666] hover:text-black">Leaderboard</button>
            <button 
              onClick={() => setViewMode('landing')}
              className="px-4 py-2 bg-[#15803d]/10 text-[#15803d] rounded-full font-bold flex items-center gap-1.5 border border-[#15803d]/20 shadow-sm"
            >
              <Leaf className="w-4 h-4" /> Gelapha
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        
        {/* ==========================================
            VIEW 1: LANDING SELECTION
        ========================================== */}
        {viewMode === 'landing' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
            
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#15803d] uppercase mb-4 flex items-center justify-center gap-2">
                <Leaf className="w-4 h-4" /> Circular Fashion
              </p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Gelapha Exchange
              </h1>
              <p className="text-[#666666] max-w-xl mx-auto text-lg">
                The sustainable heartbeat of Myntra Tribes. Spend your points on curated vintage, or sell your pieces to earn more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
              
              {/* BUY CARD */}
              <div 
                onClick={() => setViewMode('buy')}
                className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-4 border-transparent hover:border-[#15803d]/30"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1770012117468-9b1ee7aba977?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#15803d] transition-colors duration-500">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <h3 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Shop Pre-loved</h3>
                  <p className="text-white/80 text-sm mb-6 max-w-[250px]">Spend your Tribe points on verified, gently-used vintage and designer pieces.</p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                    Enter Store <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              {/* SELL CARD */}
              <div 
                onClick={() => setViewMode('sell')}
                className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-4 border-transparent hover:border-[#ff3f6c]/30"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1723810740457-5cc956c46f01?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#ff3f6c] transition-colors duration-500">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <h3 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Sell Your Items</h3>
                  <p className="text-white/80 text-sm mb-6 max-w-[250px]">Upload your old clothes. Get Myntra verification. Earn massive points for your next purchase.</p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                    Start Earning <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            VIEW 2: THE "BUY" STOREFRONT
        ========================================== */}
        {viewMode === 'buy' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            
            <button onClick={() => setViewMode('landing')} className="flex items-center gap-2 text-sm font-bold text-[#666666] hover:text-[#111111] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Gelapha
            </button>

            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>The Thrift Vault</h1>
                <p className="text-[#666666]">Spend your points on community-sourced, Myntra-verified gems.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#FBCFE8]/50 text-sm font-bold text-[#ff3f6c]">
                Your Balance: 2,450 <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {THRIFT_STORE_ITEMS.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#FBCFE8]/30 group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-[300px] w-full bg-black/5 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#111111]">
                      {item.condition}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">{item.brand}</p>
                    <h3 className="text-lg font-bold text-[#111111] mb-4 truncate">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#ff3f6c] font-black text-xl">
                        {item.pts} <Sparkles className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={() => handlePurchase(item.name, item.pts)}
                        className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#15803d] transition-colors flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* ==========================================
            VIEW 3: THE "SELL" FORM (Your exact code!)
        ========================================== */}
        {viewMode === 'sell' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            
            <button onClick={() => setViewMode('landing')} className="flex items-center gap-2 text-sm font-bold text-[#666666] hover:text-[#111111] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Gelapha
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* LEFT COLUMN: UPLOAD FORM */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 rounded-[2rem] border border-[#FBCFE8]/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff3f6c]/5 rounded-bl-[100px] -z-10" />
                  
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Submit an Item</h2>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#111111] mb-2">Item Photos</label>
                      <div 
                        className="w-full h-48 rounded-2xl border-2 border-dashed border-[#FBCFE8] bg-[#FFF5F8]/50 hover:bg-[#FFF5F8] transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                              <UploadCloud className="w-5 h-5 text-[#ff3f6c]" />
                            </div>
                            <p className="text-sm font-medium text-[#666666]">Click or drag to upload clear photos</p>
                            <p className="text-xs text-[#888888] mt-1">JPEG, PNG up to 5MB</p>
                          </>
                        )}
                        <input id="file-upload" type="file" className="hidden" onChange={handleImageDrop} accept="image/*" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2">Item Name</label>
                        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Zara Graphic Tee" className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 outline-none focus:border-[#ff3f6c] transition-colors text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 outline-none focus:border-[#ff3f6c] transition-colors text-sm appearance-none">
                          <option value="" disabled>Select category...</option>
                          <option value="Tops">Tops</option>
                          <option value="Bottoms">Bottoms</option>
                          <option value="Dresses">Dresses</option>
                          <option value="Outerwear">Outerwear</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-[#FFF5F8] rounded-2xl p-5 border border-[#FBCFE8]/50 flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-bold text-[#111111] mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#ff3f6c]" /> Frequency Used</label>
                        <input type="number" min="1" value={frequency} onChange={(e) => setFrequency(e.target.value ? Number(e.target.value) : '')} placeholder="Times worn (approx)" className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3f6c] transition-colors text-sm" />
                      </div>
                      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end gap-3">
                        <div className="text-right">
                          <p className="text-xs text-[#888888] uppercase tracking-wider font-bold mb-1">Estimated Reward</p>
                          <div className="flex items-center gap-2 text-2xl font-bold text-[#ff3f6c]">{estimatedPoints} <Sparkles className="w-5 h-5" /></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#888888] flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" /> 
                      Points are calculated as a base of 150 + a condition bonus inversely proportional to the frequency of use. Final points awarded upon Myntra verification.
                    </p>

                    <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-white tracking-wide bg-[#111111] hover:bg-[#222222] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Submit for Verification <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT COLUMN: HISTORY BOARD */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <h2 className="text-xl font-bold px-2" style={{ fontFamily: 'Georgia, serif' }}>Your Gelapha Vault</h2>
                
                {isLoading ? (
                   <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-[#ff3f6c] border-t-transparent rounded-full animate-spin" /></div>
                ) : history.length === 0 ? (
                   <p className="text-[#888888] px-2 italic">You haven't submitted any items yet.</p>
                ) : (
                  <AnimatePresence>
                    {history.map((item, idx) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white p-4 rounded-[1.5rem] border border-[#FBCFE8]/30 shadow-sm flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.status === 'Approved' && (
                            <div className="absolute inset-0 bg-[#4ade80]/20 flex items-center justify-center">
                               <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-sm text-[#111111] mb-1">{item.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-[#888888] mb-2">
                            <Tag className="w-3 h-3" /> {item.category} • {item.date}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${item.status === 'Approved' ? 'bg-[#4ade80]/10 text-[#022c16]' : 'bg-[#f59e0b]/10 text-[#78350f]'}`}>
                              {item.status}
                            </span>
                            {item.status === 'Approved' ? (
                              <span className="text-sm font-bold text-[#ff3f6c] flex items-center gap-1">+{item.points} <Sparkles className="w-3 h-3" /></span>
                            ) : (
                              <span className="text-xs font-medium text-[#888888] italic">{item.points} pts est.</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}