'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTribeStore } from '@/store/useTribeStore';
import { 
  ArrowLeft, Headset, Star, ChevronRight, Package, 
  Heart, Sparkles, Gift, CreditCard, User, Tag, 
  Trophy, MapPin, Scissors, LogOut, ChevronDown, Check, Copy
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

  // --- DYNAMIC STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState(500); // Default points
  
  const currentTribe = useTribeStore((state: any) => state.currentTribe || state.tribe || state.slug || 'default');
  const tribeMeta = TRIBE_META[currentTribe] || TRIBE_META.default;

  // UI State
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock Orders (Contextualized to app aesthetic)
  const [orders] = useState([
    { id: 'OD-1900', item: 'Lilac 1900s Vintage Drape Saree', date: 'Jul 18, 2026', status: 'Delivered', price: 3499, points: 50 },
    { id: 'OD-1901', item: 'Classic Black Velvet Blouse', date: 'Jul 10, 2026', status: 'Delivered', price: 1299, points: 20 }
  ]);

  useEffect(() => {
    setIsMounted(true);

    // 1. Fetch dynamic user details from login session
    const userStr = localStorage.getItem('tribe_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        const extractedName = parsed.username || parsed.name || parsed.user?.username || parsed.user?.name || parsed.data?.username || 'Trendsetter';
        const extractedEmail = parsed.email || parsed.user?.email || parsed.data?.email || '';
        
        if (extractedName) setUserName(extractedName);
        if (extractedEmail) setEmail(extractedEmail);
      } catch (e) {
        console.warn("Failed to parse user data");
      }
    } else {
      setUserName('Trendsetter'); // Fallback if not logged in
    }

    // 2. Fetch consistent global points
    const savedPoints = localStorage.getItem('tribe_points');
    if (savedPoints) {
      setPoints(Number(savedPoints));
    } else {
      // If new user, give them starting points
      localStorage.setItem('tribe_points', '500');
      setPoints(500);
    }
  }, []);

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
    localStorage.removeItem('tribe_jwt');
    localStorage.removeItem('tribe_user');
    router.push('/auth');
  };

  if (!isMounted) return null; // Prevent hydration errors

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans relative overflow-x-hidden pb-24">
      
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff3f6c]/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#8A2BE2]/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

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
              <span>₹{points}</span>
            </button>
            <button className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#FBCFE8]/50 text-sm font-bold text-[#666666]">
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
          <h2 className="text-2xl font-bold mb-3 capitalize" style={{ fontFamily: 'Georgia, serif' }}>{userName}</h2>
          
          <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
            <button className="bg-white border border-[#FBCFE8] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 hover:border-[#ff3f6c] transition-colors">
              <span className="text-[#ff3f6c] tracking-wider">GLAM CLAN</span>
              <ChevronRight className="w-3 h-3 text-[#888888]" />
            </button>
            <button className="bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">M INSIDER</span>
              <span className="font-medium text-white/80">Select</span>
              <ChevronRight className="w-3 h-3 text-white/50" />
            </button>
          </div>

          {/* Dynamic Tribe Badge */}
          {currentTribe !== 'default' && (
            <span className="text-xs font-bold px-4 py-2 rounded-full border bg-white shadow-sm" style={{ color: tribeMeta.accent, borderColor: `${tribeMeta.accent}40` }}>
              Assigned Tribe: {tribeMeta.label}
            </span>
          )}
        </div>

        {/* --- PREFERENCES CARD (Links to TrueFit) --- */}
        <motion.div 
          whileHover={{ scale: 0.99 }}
          onClick={() => router.push('/truefit')}
          className="bg-white rounded-[2rem] p-5 shadow-sm border border-[#FBCFE8]/50 mb-6 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ff3f6c]/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-lg mb-1 border border-[#BAE6FD] capitalize">
                {userName.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-[#666666] capitalize">{userName}</span>
            </div>
            <div className="w-px h-12 bg-[#FBCFE8]/50" />
            <div className="flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity px-4">
              <div className="w-10 h-10 rounded-full border border-dashed border-[#888888] flex items-center justify-center mb-1">
                <span className="text-xl leading-none">+</span>
              </div>
              <span className="text-[10px] font-bold text-[#111111]">Add</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-[#FBCFE8]/30">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-[#888888]" />
              <div>
                <p className="text-sm font-bold text-[#111111] capitalize">{userName}'s Preferences</p>
                <p className="text-xs text-[#888888]">Basic Details, TrueFit Size, Hair & Colour Match</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888]" />
          </div>
        </motion.div>

        {/* --- MAIN QUICK LINKS (Expandable Orders/Wishlist) --- */}
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
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#FBCFE8]/50 rounded-2xl p-4 mb-3 last:mb-0 bg-[#FFF5F8]/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-sm">{order.item}</p>
                          <p className="text-xs text-[#888888] mt-1">{order.date} • {order.id}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-[#4ade80]/15 text-[#15803d] px-2.5 py-1 rounded-full">{order.status}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#FBCFE8]/40">
                        <span className="font-bold text-sm">₹{order.price}</span>
                        <span className="text-xs text-[#ff3f6c] font-bold flex items-center gap-1"><Trophy className="w-3 h-3" /> +{order.points} pts earned</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-px w-full bg-[#FBCFE8]/30" />

          {/* Wishlist Section */}
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
                  <p className="text-4xl font-black text-[#ff3f6c] mb-1">{points}</p>
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

          <div className="h-px w-full bg-[#FBCFE8]/30 mb-2" />
          <button className="w-full flex items-center justify-between py-3 hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-4">
              <Gift className="w-5 h-5 text-[#666666]" />
              <span className="font-semibold text-sm">Gift Cards</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </button>
        </div>

        {/* --- ACCOUNT CONTROLS --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#FBCFE8]/50 mb-6 overflow-hidden">
          
          {/* Account & Address */}
          <div>
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
                  <div className="pl-9 flex flex-col gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888888]">Username</span>
                      <span className="font-bold capitalize">{userName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888888]">Email</span>
                      <span className="font-bold">{email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#FFF5F8] p-3 rounded-xl border border-[#FBCFE8]/50 mt-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ff3f6c]" />
                        <span className="text-xs font-bold">Home Address</span>
                      </div>
                      <span className="text-[10px] text-[#ff3f6c] uppercase font-bold cursor-pointer hover:underline">Edit</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="mt-4 flex items-center justify-center gap-2 text-[#ff3f6c] font-bold text-sm border border-[#ff3f6c]/30 rounded-full py-3 hover:bg-[#ff3f6c]/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    </main>
  );
}