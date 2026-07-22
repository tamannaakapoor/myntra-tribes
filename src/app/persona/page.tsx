'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTribeStore } from '@/store/useTribeStore';
import { 
  ArrowLeft, Headset, Star, ChevronRight, Package, 
  Heart, Sparkles, Gift, CreditCard, User, Tag, 
  Trophy, MapPin, LogOut, ChevronDown, Check, Copy, 
  X, Send, Crown, Info, Clock, Zap
} from 'lucide-react';

// --- TRIBE META ---
const TRIBE_META: Record<string, { label: string; accent: string; vibe: string }> = {
  'golden-hour': { label: 'Golden Hour', accent: '#A3B18A', vibe: 'Cottagecore x Soft Girl' },
  'neon-static': { label: 'Neon Static', accent: '#39FF14', vibe: 'Cyberpunk x Y2K' },
  'vault-heir': { label: 'Vault Heir', accent: '#355070', vibe: 'Old Money x Quiet Luxury' },
  'default': { label: 'Tribe Unassigned', accent: '#ff3f6c', vibe: 'Take the quiz to get matched' },
};

export default function PersonaPage() {
  const router = useRouter();

  // --- DYNAMIC DB STATE ---
  const [isMounted, setIsMounted] = useState(false);
 const [userData, setUserData] = useState<{
  name: string;
  email: string;
  points: number;
  address: { street: string; city: string; state?: string; zip?: string } | null;
}>({ 
  name: '', 
  email: '', 
  points: 0, 
  address: null 
});
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  const currentTribe = useTribeStore((state: any) => state.currentTribe || state.slug || 'default');
  const tribeMeta = TRIBE_META[currentTribe] || TRIBE_META.default;

  // --- UI STATE ---
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Overlays
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInsiderOpen, setIsInsiderOpen] = useState(false);

  // Mynbot Chat State
  const [chatMessages, setChatMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([
    { sender: 'bot', text: 'Hi! I am Mynbot 🤖. I see you are checking your profile. Need help tracking a recent order or checking your refund status?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- STRICT DB FETCHING (No Mocks) ---
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('tribe_jwt');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://myntra-tribes.onrender.com/api';

    // 1. Fetch User Profile
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/me`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.user?.username || data.user?.name || 'Trendsetter',
            email: data.user?.email || '',
            points: data.user?.points || 0,
            address: data.user?.shipping_address || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      }
    };

    // 2. Fetch Orders
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}/orders`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          setOrders([]); // Strict empty array if backend fails
        }
      } catch (error) {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Got it! Retrieving your latest order details from the database now. Give me just a second...' }]);
    }, 1000);
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans relative overflow-x-hidden pb-24">
      
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff3f6c]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      
      <div className="max-w-[800px] mx-auto px-4 pt-10 relative z-10">
        
        {/* --- TOP HEADER --- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">My Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#FBCFE8]/50 text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#ff3f6c]" /> 
              <span>₹{userData.points}</span>
            </button>
            <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#FBCFE8]/50 text-sm font-bold text-[#666666] hover:text-[#ff3f6c] transition-colors">
              <Headset className="w-4 h-4" /> Help
            </button>
          </div>
        </div>

        {/* --- AVATAR & BADGES --- */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff3f6c] to-[#ff99b3] p-1 shadow-lg shadow-[#ff3f6c]/20">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                <Star className="w-10 h-10 text-[#ff3f6c] fill-[#ff3f6c]/20" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 capitalize" style={{ fontFamily: 'Georgia, serif' }}>{userData.name}</h2>
          
          <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
            <button onClick={() => setIsInsiderOpen(true)} className="bg-white border border-[#FBCFE8] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 hover:border-[#ff3f6c] transition-colors">
              <span className="text-[#ff3f6c] tracking-wider">GLAM CLAN</span>
              <ChevronRight className="w-3 h-3 text-[#888888]" />
            </button>
            <button onClick={() => setIsInsiderOpen(true)} className="bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">M INSIDER</span>
              <span className="font-medium text-white/80">Select</span>
              <ChevronRight className="w-3 h-3 text-white/50" />
            </button>
          </div>

          {currentTribe !== 'default' && (
            <span className="text-xs font-bold px-4 py-2 rounded-full border bg-white shadow-sm" style={{ color: tribeMeta.accent, borderColor: `${tribeMeta.accent}40` }}>
              Assigned Tribe: {tribeMeta.label}
            </span>
          )}
        </div>

        {/* --- MAIN QUICK LINKS (Expandable Orders) --- */}
        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-[#FBCFE8]/50 mb-6 overflow-hidden">
          
          {/* Orders Section */}
          <button onClick={() => toggleSection('orders')} className="w-full flex items-center justify-between p-4 hover:bg-[#FFF5F8] rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <Package className="w-5 h-5 text-[#666666] group-hover:text-[#ff3f6c] transition-colors" />
              <span className="font-semibold text-sm">My Orders</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#888888] transition-transform ${expandedSection === 'orders' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'orders' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4">
                  {isLoadingOrders ? (
                    <p className="text-sm text-[#888888] text-center py-4">Loading your hauls from the database...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-6 bg-[#FFF5F8]/50 rounded-2xl border border-[#FBCFE8]/30">
                      <p className="text-sm text-[#888888] mb-3">No orders yet.</p>
                      <button onClick={() => router.push('/feed')} className="text-xs font-bold bg-[#111111] text-white px-4 py-2 rounded-full">Shop the Feed</button>
                    </div>
                  ) : (
                    orders.map((order: any) => {
                      const itemName = order.items && order.items.length > 0 ? order.items[0].name : 'Tribe Aesthetic Order';
                      const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <div key={order.id} className="border border-[#FBCFE8]/50 rounded-2xl p-4 mb-3 last:mb-0 bg-[#FFF5F8]/30 hover:border-[#ff3f6c]/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-sm line-clamp-1 pr-2">{itemName} {order.items?.length > 1 ? `+${order.items.length - 1} more` : ''}</p>
                              <p className="text-xs text-[#888888] mt-1">{date} • {order.id?.substring(0,8).toUpperCase()}</p>
                            </div>
                            <span className="text-[10px] font-bold bg-[#4ade80]/15 text-[#15803d] px-2.5 py-1 rounded-full shrink-0">Confirmed</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#FBCFE8]/40">
                            <span className="font-bold text-sm">₹{order.total}</span>
                            {order.points_earned > 0 && (
                              <span className="text-xs text-[#ff3f6c] font-bold flex items-center gap-1"><Trophy className="w-3 h-3" /> +{order.points_earned} pts</span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-px w-full bg-[#FBCFE8]/30" />

          <button onClick={() => router.push('/feed')} className="w-full flex items-center justify-between p-4 hover:bg-[#FFF5F8] rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-[#666666] group-hover:text-[#ff3f6c] transition-colors" />
              <span className="font-semibold text-sm">Wishlist</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </button>
          <div className="h-px w-full bg-[#FBCFE8]/30" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-[#FFF5F8] rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-[#666666] group-hover:text-[#ff3f6c] transition-colors" />
              <span className="font-semibold text-sm">Get 7.5% Cashback on Myntra</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </button>
        </div>

        {/* --- REWARDS & COUPONS --- */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#FBCFE8]/50 mb-6">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#ff3f6c]" /> Rewards & Coupons
          </h3>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => toggleSection('points')} className={`flex items-center justify-center gap-1.5 py-3 border rounded-2xl transition-all ${expandedSection === 'points' ? 'border-[#ff3f6c] bg-[#FFF5F8]' : 'border-[#FBCFE8]/50 hover:border-[#ff3f6c]'}`}>
              <Sparkles className={`w-4 h-4 ${expandedSection === 'points' ? 'text-[#ff3f6c]' : 'text-[#888888]'}`} />
              <span className="text-xs font-bold">MynCash</span>
            </button>
            <button onClick={() => toggleSection('coupons')} className={`flex items-center justify-center gap-1.5 py-3 border rounded-2xl transition-all ${expandedSection === 'coupons' ? 'border-[#ff3f6c] bg-[#FFF5F8]' : 'border-[#FBCFE8]/50 hover:border-[#ff3f6c]'}`}>
              <Tag className={`w-4 h-4 ${expandedSection === 'coupons' ? 'text-[#ff3f6c]' : 'text-[#888888]'}`} />
              <span className="text-xs font-bold">Coupons</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 py-3 border border-[#FBCFE8]/50 rounded-2xl hover:border-[#ff3f6c] hover:bg-[#FFF5F8] transition-all">
              <Trophy className="w-4 h-4 text-[#888888]" />
              <span className="text-xs font-bold">My Prizes</span>
            </button>
          </div>

          <AnimatePresence>
            {expandedSection === 'points' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="p-4 bg-[#FFF5F8] rounded-2xl border border-[#FBCFE8]/50 text-center">
                  <p className="text-4xl font-black text-[#ff3f6c] mb-1">{userData.points}</p>
                  <p className="text-xs text-[#888888] font-bold uppercase tracking-wider">Total Tribe Points</p>
                </div>
              </motion.div>
            )}
            {expandedSection === 'coupons' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="flex items-center justify-between gap-3 border border-dashed border-[#ff3f6c]/40 rounded-2xl p-4 bg-[#FFF5F8]/30">
                  <div>
                    <p className="font-black tracking-wide text-sm truncate">WELCOME10</p>
                    <p className="text-xs text-[#888888] truncate">10% off your next order</p>
                  </div>
                  <button onClick={() => handleCopyCoupon('WELCOME10')} className={`text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors ${copiedCode === 'WELCOME10' ? 'bg-[#4ade80]/15 text-[#15803d]' : 'bg-[#ff3f6c]/10 text-[#ff3f6c]'}`}>
                    {copiedCode === 'WELCOME10' ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- ACCOUNT CONTROLS --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#FBCFE8]/50 mb-6 overflow-hidden">
          <button onClick={() => toggleSection('account')} className="w-full flex items-center justify-between p-6 hover:bg-[#FFF5F8]/50 transition-colors">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-[#666666]" />
              <span className="font-semibold text-sm">Manage Account & Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#888888] transition-transform ${expandedSection === 'account' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'account' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 overflow-hidden">
                <div className="flex flex-col gap-5 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#888888]">Username</span>
                    <span className="font-bold capitalize text-right">{userData.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#888888]">Email</span>
                    <span className="font-bold text-right">{userData.email || 'Not provided'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-[#FFF5F8] p-4 rounded-xl border border-[#FBCFE8]/50 mt-2">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#ff3f6c]" />
                      <div>
                        <span className="text-sm font-bold block">Home Address</span>
                        {userData.address ? (
                           <span className="text-xs text-[#888888] line-clamp-1">{userData.address.street}, {userData.address.city}</span>
                        ) : (
                           <span className="text-xs text-[#888888]">No address saved</span>
                        )}
                      </div>
                    </div>
                    <span onClick={() => router.push('/checkout')} className="text-xs text-[#ff3f6c] uppercase font-bold cursor-pointer hover:underline tracking-wider">Edit</span>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-2 flex items-center justify-center gap-2 text-[#ff3f6c] font-bold text-sm border border-[#FBCFE8] rounded-full py-3.5 hover:bg-[#FFF5F8] transition-colors w-full">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- PROMO BANNER (Academy Link) --- */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/academy')}
          className="bg-gradient-to-r from-orange-200 to-amber-300 rounded-[2rem] p-6 shadow-md cursor-pointer relative overflow-hidden flex items-center"
        >
          <div className="absolute -right-10 -top-10 opacity-20 pointer-events-none">
            <Sparkles className="w-48 h-48 text-white" />
          </div>
          <div className="bg-white/90 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-sm shrink-0">
            <Gift className="w-6 h-6 text-orange-500" />
          </div>
          <div className="z-10">
            <h3 className="font-bold text-[#111111] mb-0.5">Tribe Academy is Open!</h3>
            <p className="text-sm text-[#111111]/80">Read the playbook, earn <span className="font-black">+100 pts</span></p>
          </div>
        </motion.div>

      </div>

      {/* ========================================== */}
      {/* OVERLAY 1: MYNBOT CHAT (Orders Support)    */}
      {/* ========================================== */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 md:bottom-10 md:right-10 w-[90%] max-w-[350px] bg-white rounded-3xl shadow-2xl border border-[#FBCFE8] overflow-hidden z-50 flex flex-col h-[500px]"
          >
            <div className="bg-gradient-to-r from-[#ff3f6c] to-[#ff99b3] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Headset className="w-4 h-4 text-[#ff3f6c]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Mynbot Support</h3>
                  <p className="text-[10px] text-white/80">Order & Refund Specialist</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto bg-[#FFF5F8]/50 flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'bot' ? 'bg-white border border-[#FBCFE8]/50 rounded-tl-none self-start shadow-sm' : 'bg-[#111111] text-white rounded-tr-none self-end shadow-sm'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#FBCFE8]/50 bg-white flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your orders..." 
                className="flex-grow bg-[#FFF5F8] border border-[#FBCFE8] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#ff3f6c]"
              />
              <button type="submit" className="w-10 h-10 rounded-full bg-[#ff3f6c] text-white flex items-center justify-center shrink-0 hover:bg-[#E11D48]">
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* OVERLAY 2: M INSIDER FULL SCREEN MODAL     */}
      {/* ========================================== */}
      <AnimatePresence>
        {isInsiderOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#FAFAFA] z-[100] overflow-y-auto font-sans"
          >
            {/* Dark Header Section */}
            <div className="bg-[#111111] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C19A5B]/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
              
              <button onClick={() => setIsInsiderOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-2 text-[#C19A5B] font-bold tracking-widest text-xs mb-2">
                <Crown className="w-4 h-4 fill-[#C19A5B]" /> M INSIDER
              </div>
              <h1 className="text-4xl font-black mb-1 tracking-tight">SELECT MEMBER</h1>
              <p className="text-sm text-[#888888] mb-8">Member since April, 2024</p>

              <div className="flex gap-4 mb-10">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[#C19A5B] mb-1">
                    <Gift className="w-4 h-4" /> <span className="font-bold text-lg">20 {'>'}</span>
                  </div>
                  <p className="text-xs text-[#888888]">Available Rewards</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[#C19A5B] mb-1">
                    <CreditCard className="w-4 h-4" /> <span className="font-bold text-lg">₹6.3K {'>'}</span>
                  </div>
                  <p className="text-xs text-[#888888]">Your Savings</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-4 max-w-[400px]">
                <div className="h-1 bg-white/20 rounded-full w-full absolute top-[21px]" />
                <div className="h-1 bg-[#C19A5B] rounded-full w-[10%] absolute top-[21px] z-10" />
                
                <div className="flex justify-between items-center relative z-20">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-[#C19A5B] rounded-full mb-2 ring-4 ring-[#111111]" />
                    <span className="text-[10px] font-bold text-white">SELECT</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-white/40 rounded-full mb-2.5 ring-4 ring-[#111111]" />
                    <span className="text-[10px] font-bold text-[#888888]">ELITE</span>
                    <span className="text-[9px] text-[#888888]">₹8963</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-white/40 rounded-full mb-2.5 ring-4 ring-[#111111]" />
                    <span className="text-[10px] font-bold text-[#888888]">ICON</span>
                    <span className="text-[9px] text-[#888888]">₹33963</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning / Upgrade Bar */}
            <div className="bg-[#C19A5B] text-white px-5 py-4 mx-4 -mt-6 rounded-2xl relative z-10 shadow-lg flex items-start gap-3 max-w-[600px] md:mx-auto md:-mt-6">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Shop for ₹8963 before 3rd Oct, 2026 to upgrade your benefits. <span className="underline font-bold cursor-pointer">Shop Now!</span></p>
            </div>

            <div className="px-4 py-10 max-w-[800px] mx-auto">
              
              {/* Horizontal Carousel (Trending Now) */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-[#E5E5E5] flex-grow max-w-[50px]" />
                <h3 className="text-xl font-bold font-serif text-[#111111]">Trending Now</h3>
                <div className="h-px bg-[#E5E5E5] flex-grow max-w-[50px]" />
              </div>

              <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
                {/* Spotify Card */}
                <div className="min-w-[280px] bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E5E5E5] snap-center shrink-0">
                  <div className="h-44 bg-[#111111] relative overflow-hidden flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop" alt="Spotify" className="opacity-50 w-full h-full object-cover" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="text-white font-bold text-sm flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-black text-[10px]">S</div> 
                         Spotify Premium
                      </div>
                      <div>
                        <div className="text-white/80 text-xs mb-1">Get 3 Months</div>
                        <div className="text-white font-bold text-lg leading-tight">Spotify Premium Standard For Free</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-[#111111] mb-4 text-sm">Spotify : Get 3 months of Spotify Premium Standard fo...</h4>
                    <button className="bg-[#353540] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
                      Get using <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 0
                    </button>
                  </div>
                </div>

                {/* 50% Off Card */}
                <div className="min-w-[280px] bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E5E5E5] snap-center shrink-0">
                  <div className="h-44 bg-gradient-to-tr from-purple-900 to-[#111111] relative overflow-hidden flex items-center justify-center border-b-4 border-[#C19A5B]">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C19A5B] flex flex-col items-center justify-center bg-[#111111]/50 backdrop-blur-sm shadow-xl">
                      <span className="text-[#C19A5B] font-black text-2xl leading-none">6</span>
                      <span className="text-[#C19A5B] font-bold text-[8px] tracking-widest text-center">MONTHS<br/>VALIDITY</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-[#111111] mb-4 text-sm">Flat 50% off on Elite Membership Upgrades</h4>
                    <button className="bg-[#353540] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
                      Get using <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 100
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center mb-10">
                <button className="text-[#ff3f6c] font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-1 mx-auto">
                  View All Rewards <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-[#E5E5E5] flex-grow max-w-[30px]" />
                <h3 className="text-lg font-bold text-[#111111]">Your Exclusive Select Benefits</h3>
                <div className="h-px bg-[#E5E5E5] flex-grow max-w-[30px]" />
              </div>

              {/* Claimed Rewards */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between mb-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF8EE] rounded-full flex items-center justify-center border border-[#F3D9C6]">
                    <Clock className="w-5 h-5 text-[#C19A5B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111]">Claimed Rewards</h4>
                    <p className="text-xs text-[#888888]">Your redeemed reward usage history</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888]" />
              </div>

              {/* Accordion / FAQ */}
              <h3 className="text-2xl font-bold font-serif mb-6 text-[#111111]">Know more about the<br/>Loyalty Program</h3>
              <div className="flex flex-col gap-0 border-t border-[#E5E5E5]">
                <div className="py-5 border-b border-[#E5E5E5] flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-[#111111]">What is Myntra Insider?</span>
                  <ChevronDown className="w-5 h-5 text-[#888888]" />
                </div>
                <div className="py-5 border-b border-[#E5E5E5] flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-[#111111]">What do I get for being a Myntra Insider?</span>
                  <ChevronDown className="w-5 h-5 text-[#888888]" />
                </div>
                <div className="py-5 border-b border-[#E5E5E5] flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-[#111111]">FAQs</span>
                  <ChevronRight className="w-5 h-5 text-[#888888]" />
                </div>
                <div className="py-5 border-b border-[#E5E5E5] flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-[#ff3f6c]">Terms & Conditions</span>
                  <ChevronRight className="w-5 h-5 text-[#ff3f6c]" />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-[#111111] py-8 text-center mt-auto">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-xl mb-2 tracking-widest">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 font-serif font-black italic">M</span> INSIDER
              </div>
              <p className="text-xs text-white/50">Fashion Advice | VIP Access | Extra Savings</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}