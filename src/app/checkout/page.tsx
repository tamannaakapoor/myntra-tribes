'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useTribeStore } from '@/store/useTribeStore';
import { 
  ArrowLeft, Trash2, ShieldCheck, CreditCard, Sparkles, 
  Loader2, MapPin, Tag, Trophy, Smartphone, Banknote, Edit3, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const themeConfig = useTribeStore((state) => state.themeConfig);
  const currentTribe = useTribeStore((state: any) => state.currentTribe || 'default');
  
  // --- STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Points & Coupons
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    name: 'Trendsetter',
    street: '123 Fashion Street, Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560100'
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');

  // --- LIFECYCLE ---
  useEffect(() => {
    setIsMounted(true);
    
    // Load Points
    const savedPoints = localStorage.getItem('tribe_points');
    if (savedPoints) setUserPoints(Number(savedPoints));

    // Load Saved Address
    const savedAddress = localStorage.getItem('tribe_address');
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.warn("Failed to parse saved address");
      }
    }
  }, []);

  if (!isMounted) return null;

  // --- CALCULATIONS ---
  const subtotal = getTotalPrice();
  const maxPointsAllowed = Math.floor(subtotal * 0.5); // Max 50% of order value
  const pointsToUse = usePoints ? Math.min(userPoints, maxPointsAllowed) : 0;
  const couponDiscount = appliedCoupon ? Math.floor(subtotal * appliedCoupon.discount) : 0;
  
  const finalTotal = Math.max(0, subtotal - pointsToUse - couponDiscount);
  const calculatedPointsEarned = Math.floor(finalTotal * 0.075); // 7.5% cashback

  // --- HANDLERS ---
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 0.10 });
    } else {
      alert("Invalid coupon code. Try WELCOME10");
    }
  };

  const handleSaveAddress = () => {
    if (!address.name || !address.street || !address.city || !address.zip) {
      alert("Please fill in all address fields.");
      return;
    }
    localStorage.setItem('tribe_address', JSON.stringify(address));
    setIsEditingAddress(false);
  };

  const handleCheckout = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    setIsCheckingOut(true);
    setEarnedPoints(calculatedPointsEarned);
    
    const token = localStorage.getItem('tribe_jwt');
    const newTotalPoints = userPoints - pointsToUse + calculatedPointsEarned;
    
    const orderData = {
      items: cart,
      subtotal,
      discount: pointsToUse + couponDiscount,
      total: finalTotal,
      points_earned: calculatedPointsEarned,
      points_used: pointsToUse,
      payment_method: paymentMethod,
      shipping_address: address
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://myntra-tribes.onrender.com/api';
      await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(orderData)
      });
    } catch (error) {
      console.warn("Backend order creation failed, proceeding locally.");
    }

    localStorage.setItem('tribe_points', newTotalPoints.toString());
    
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      clearCart();
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center p-6 text-center font-sans">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-[#FBCFE8]/50 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-300 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShieldCheck className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Order Confirmed!</h1>
          <p className="text-[#666666] mb-6 leading-relaxed">Your aesthetic is officially secured. We're packing up your new fits right now.</p>
          
          <div className="bg-[#FFF5F8] border border-[#FBCFE8] rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-[#ff3f6c]" />
            <div className="text-left">
              <p className="text-xs text-[#888888] font-bold uppercase tracking-wider">You Earned</p>
              <p className="text-[#ff3f6c] font-black text-lg">+{earnedPoints} Tribe Points</p>
            </div>
          </div>

          <button onClick={() => router.push('/dashboard')} className="w-full bg-[#111111] text-white py-4 rounded-full font-bold hover:bg-black/80 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Back to Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  const accentColor = themeConfig?.accent || '#ff3f6c';

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-32">
      
      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-[#FBCFE8]/50 h-20 flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold hover:text-[#ff3f6c] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Keep Shopping
          </button>
          <div className="flex items-center gap-2 text-[#15803d] bg-[#4ade80]/15 px-4 py-2 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10" style={{ fontFamily: 'Georgia, serif' }}>Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-[#FBCFE8]/50 p-16 text-center shadow-sm">
            <p className="text-lg text-[#666666] mb-6">Your bag is looking a little empty.</p>
            <button onClick={() => router.push('/feed')} className="bg-[#111111] text-white px-8 py-3 rounded-full font-bold hover:bg-black/80 transition-colors">
              Explore the Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: Shipping & Cart Items */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Shipping Address Component */}
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#888888]" /> Delivery Address
                  </h3>
                  {!isEditingAddress && (
                    <button onClick={() => setIsEditingAddress(true)} className="text-[#ff3f6c] text-sm font-bold uppercase hover:underline flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isEditingAddress ? (
                    <motion.div key="edit" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3">
                      <input type="text" placeholder="Full Name" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} className="border border-[#FBCFE8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3f6c]" />
                      <input type="text" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="border border-[#FBCFE8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3f6c]" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="border border-[#FBCFE8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3f6c]" />
                        <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="border border-[#FBCFE8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3f6c]" />
                      </div>
                      <input type="text" placeholder="PIN Code" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} className="border border-[#FBCFE8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3f6c] w-1/2" />
                      <button onClick={handleSaveAddress} className="mt-2 bg-[#111111] text-white px-6 py-3 rounded-xl font-bold hover:bg-black/80 transition-colors w-fit flex items-center gap-2">
                        <Check className="w-4 h-4" /> Save Address
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#FFF5F8] p-4 rounded-xl border border-[#FBCFE8]/50">
                      <p className="font-bold capitalize">{address.name}</p>
                      <p className="text-sm text-[#666666] capitalize">{address.street}</p>
                      <p className="text-sm text-[#666666] capitalize">{address.city}, {address.state} {address.zip}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg ml-2">Items in bag ({cart.length})</h3>
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[1.5rem] p-4 flex gap-5 shadow-sm border border-black/5">
                      <div className="w-24 h-32 bg-black/5 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-grow py-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-sm md:text-base line-clamp-2 pr-4">{item.name}</h3>
                          <p className="font-bold">₹{item.price * item.quantity}</p>
                        </div>
                        <p className="text-[#888888] text-xs mb-auto">Qty: {item.quantity}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#888888] text-xs font-bold flex items-center gap-1 w-fit hover:text-[#ff3f6c] transition-colors mt-2">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Payment & Summary */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-6 sticky top-28">
                
                {/* Rewards & Coupons */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#888888]" /> Offers & Rewards
                  </h3>
                  
                  {/* Coupon Input */}
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Enter promo code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow border border-[#FBCFE8] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#ff3f6c] uppercase"
                    />
                    <button onClick={handleApplyCoupon} className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/80">
                      Apply
                    </button>
                  </div>

                  {/* Tribe Points Toggle */}
                  <div className="bg-[#FFF5F8] p-4 rounded-xl border border-[#FBCFE8]/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#ff3f6c] shadow-sm">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Use Tribe Points</p>
                        <p className="text-xs text-[#888888]">Balance: {userPoints} pts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={usePoints} onChange={() => setUsePoints(!usePoints)} disabled={userPoints === 0} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff3f6c]"></div>
                    </label>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#888888]" /> Payment Method
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#ff3f6c] bg-[#FFF5F8]' : 'border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'}`}>
                      <div className="flex items-center gap-3">
                        <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#ff3f6c]' : 'text-[#888888]'}`} />
                        <span className="font-bold text-sm">UPI (Google Pay, PhonePe)</span>
                      </div>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-[#ff3f6c] w-4 h-4" />
                    </label>

                    {/* UPI ID Input Expansion */}
                    <AnimatePresence>
                      {paymentMethod === 'upi' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-2">
                            <input 
                              type="text" 
                              placeholder="Enter UPI ID (e.g. 9876543210@ybl)" 
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full border border-[#FBCFE8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff3f6c]"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#ff3f6c] bg-[#FFF5F8]' : 'border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'}`}>
                      <div className="flex items-center gap-3">
                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#ff3f6c]' : 'text-[#888888]'}`} />
                        <span className="font-bold text-sm">Credit / Debit Card</span>
                      </div>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#ff3f6c] w-4 h-4" />
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#ff3f6c] bg-[#FFF5F8]' : 'border-[#FBCFE8]/50 hover:border-[#ff3f6c]/50'}`}>
                      <div className="flex items-center gap-3">
                        <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#ff3f6c]' : 'text-[#888888]'}`} />
                        <span className="font-bold text-sm">Cash on Delivery</span>
                      </div>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#ff3f6c] w-4 h-4" />
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                  <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Order Summary</h3>
                  
                  <div className="flex flex-col gap-3 text-[#666666] text-sm font-medium border-b border-[#FBCFE8]/50 pb-6 mb-6">
                    <div className="flex justify-between"><span>Subtotal</span> <span>₹{subtotal}</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-[#15803d]"><span>Coupon Discount</span> <span>-₹{couponDiscount}</span></div>}
                    {pointsToUse > 0 && <div className="flex justify-between text-[#ff3f6c]"><span>Tribe Points Applied</span> <span>-₹{pointsToUse}</span></div>}
                    <div className="flex justify-between"><span>Shipping</span> <span className="text-[#15803d] font-bold">FREE</span></div>
                  </div>

                  <div className="flex justify-between items-end mb-2 text-[#111111]">
                    <span className="font-bold text-lg">Total</span>
                    <div className="text-right">
                      <span className="font-black text-2xl">₹{finalTotal}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-[#15803d] font-bold mb-8 text-right bg-[#4ade80]/10 py-1 px-3 rounded-full w-fit ml-auto">
                    + You will earn {calculatedPointsEarned} pts
                  </p>

                  <button 
                    onClick={handleCheckout} 
                    disabled={isCheckingOut || (paymentMethod === 'upi' && !upiId)}
                    className="w-full text-white py-4 rounded-full font-bold text-lg tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 hover:-translate-y-0.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    {isCheckingOut ? "Processing securely..." : "Place Order"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}