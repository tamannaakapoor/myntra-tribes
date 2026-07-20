'use client';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Share2, ShoppingBag, Plus, UserPlus, Check } from 'lucide-react';
import { useTribeStore } from '@/store/useTribeStore';
import { motion } from 'framer-motion';

export default function LookbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const themeConfig = useTribeStore((state) => state.themeConfig);
  
  const [lookbook, setLookbook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interactive States
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(124);
  
  
  // Comment States
  const [comments, setComments] = useState([
    { id: 1, user: "kavya_neon", text: "Wait this fit is actually insane 🔥", time: "2h ago" },
    { id: 2, user: "sneha_vibes", text: "Adding those sneakers to cart IMMEDIATELY.", time: "5h ago" }
  ]);
  const [newComment, setNewComment] = useState("");

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://myntra-tribes.onrender.com/api";
    if (!url.endsWith("/api")) url = `${url.replace(/\/$/, "")}/api`;
    return url;
  };

  useEffect(() => {
    const fetchLookbookDetails = async () => {
      try {
        const token = localStorage.getItem('tribe_jwt');
        const res = await fetch(`${getApiUrl()}/lookbooks/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setLookbook(data.lookbook || data.data || data);
        } else {
          throw new Error("Failed to fetch lookbook");
        }
      } catch (error) {
        console.warn("Could not fetch lookbook from DB, using fallback.", error);
        setLookbook({
          id: id,
          title: "Electric Midnight",
          description: "High contrast, high energy. Built for the underground. Turn every street into your runway.",
          tags: ["#NeonStatic", "#StreetStyle", "#Y2K"],
          creator: { username: "cyber_queen" },
          products: [
            { id: 'p1', name: 'Baggy Denim', price: 1999, image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400' },
            { id: 'p2', name: 'Chunky Sneakers', price: 2499, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
            { id: 'p3', name: 'Graphic Tee', price: 999, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchLookbookDetails();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 👇 FIXED: Bulletproof Username extraction
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    let myUsername = "Shopper"; // Safe fallback
    try {
      const userStr = localStorage.getItem('tribe_user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        // Safely check for username, then name, otherwise use fallback
        myUsername = parsed.username || parsed.name || "Shopper";
      }
    } catch (err) {
      console.error("Error parsing user for comment", err);
    }
    
    setComments([{ id: Date.now(), user: myUsername, text: newComment, time: "Just now" }, ...comments]);
    setNewComment("");
  };

 // Use the global cart store!
const addToCart = useCartStore((state) => state.addToCart);
const cartCount = useCartStore((state) => state.getTotalItems());

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-[#ff3f6c] border-[#FBCFE8] rounded-full animate-spin" /></div>;
  }

  if (!lookbook) return <div className="p-10 text-center">Lookbook not found.</div>;

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-32">
      
      {/* Navbar with Cart */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold hover:text-[#ff3f6c] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </button>
          
          <button onClick={() => router.push('/checkout')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-[#ff3f6c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </motion.div>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-28">
        
        {/* Creator Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff3f6c] to-[#f43f5e] p-[2px]">
              <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center font-bold text-lg">
                {(lookbook.creator?.username || lookbook.creator?.name || "C")[0].toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">@{lookbook.creator?.username || lookbook.creator?.name || "creator"}</h2>
              <p className="text-xs text-[#888888] font-medium">Myntra Tribes Creator</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              isFollowing ? 'bg-black/5 text-[#111111]' : 'bg-[#111111] text-white hover:bg-black/80'
            }`}
          >
            {isFollowing ? <><Check className="w-4 h-4"/> Following</> : <><UserPlus className="w-4 h-4"/> Follow</>}
          </button>
        </div>

        {/* Lookbook Title & Desc */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>{lookbook.title}</h1>
          <p className="text-[#666666] text-lg max-w-2xl leading-relaxed mb-4">{lookbook.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {(lookbook.tags || []).map((tag: string, i: number) => (
              <span key={i} className="text-xs font-bold text-[#ff3f6c] bg-[#ff3f6c]/10 px-3 py-1.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Product Grid */}
          <div className="lg:col-span-8">
            <h3 className="text-[10px] font-bold tracking-[0.25em] text-[#888888] uppercase mb-6">Shop the Fit</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {lookbook.products?.map((product: any, idx: number) => (
                <div key={idx} className="group bg-white p-3 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all border border-black/5">
                  <div className="relative aspect-[4/5] rounded-[1rem] overflow-hidden mb-4 bg-black/5">
                    <img src={product.image_url || product} alt={product.name || 'Product'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h4 className="font-bold text-sm truncate pr-2">{product.name || 'Myntra Item'}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-[#888888] font-medium">₹{product.price || '999'}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-8 h-8 rounded-full bg-[#FFF5F8] text-[#ff3f6c] flex items-center justify-center hover:bg-[#ff3f6c] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Interactions & Comments */}
          <div className="lg:col-span-4 flex flex-col h-full">
            
            {/* Action Bar */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#FBCFE8]/50">
              <button onClick={handleLike} className={`flex items-center gap-2 text-lg font-bold transition-colors ${isLiked ? 'text-[#ff3f6c]' : 'text-[#888888] hover:text-[#111111]'}`}>
                <Heart className={`w-7 h-7 ${isLiked ? 'fill-[#ff3f6c]' : ''}`} /> {likesCount}
              </button>
              <button className="flex items-center gap-2 text-lg font-bold text-[#888888] hover:text-[#111111] transition-colors">
                <MessageCircle className="w-7 h-7" /> {comments.length}
              </button>
              <button className="flex items-center gap-2 text-lg font-bold text-[#888888] hover:text-[#111111] transition-colors ml-auto">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Live Comments Area */}
            <h3 className="text-[10px] font-bold tracking-[0.25em] text-[#888888] uppercase mb-6">Live Chat</h3>
            
            <div className="flex-grow flex flex-col bg-white rounded-[2rem] border border-[#FBCFE8]/50 shadow-sm p-6 max-h-[500px]">
              
              <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col gap-5 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/5 shrink-0 flex items-center justify-center text-xs font-bold">
                      {/* 👇 FIXED: Safely render the first letter, fallback to "U" for User */}
                      {(comment.user && comment.user.length > 0) ? comment.user[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-bold text-sm">@{comment.user || "Shopper"}</span>
                        <span className="text-[10px] text-[#888888]">{comment.time}</span>
                      </div>
                      <p className="text-sm text-[#444444] leading-snug">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="relative mt-auto">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Hype up this fit..." 
                  className="w-full bg-[#FFF5F8] border border-[#FBCFE8] rounded-full pl-5 pr-12 py-3 text-sm outline-none focus:border-[#ff3f6c] transition-colors"
                />
                <button type="submit" disabled={!newComment.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#ff3f6c] text-white rounded-full flex items-center justify-center disabled:opacity-50">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}