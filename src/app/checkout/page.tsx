'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useTribeStore } from '@/store/useTribeStore';
import { ArrowLeft, Trash2, ShieldCheck, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const themeConfig = useTribeStore((state) => state.themeConfig);
  
  // Hydration fix for Zustand + Next.js
  const [isMounted, setIsMounted] = useState(false);
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API network request
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  if (!isMounted) return null;

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center p-6 text-center font-sans">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-[#FBCFE8]/50">
          <div className="w-20 h-20 bg-[#ff3f6c]/10 text-[#ff3f6c] rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Order Confirmed!</h1>
          <p className="text-[#666666] mb-8 leading-relaxed">Your aesthetic is officially secured. We're packing up your new fits right now.</p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-[#ff3f6c] text-white py-4 rounded-full font-bold hover:bg-[#E11D48] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
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
      <nav className="w-full bg-white border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold hover:text-[#ff3f6c] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Keep Shopping
          </button>
          <div className="flex items-center gap-2 text-[#888888] text-sm font-bold">
            <ShieldCheck className="w-5 h-5 text-green-500" /> Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10" style={{ fontFamily: 'Georgia, serif' }}>Your Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-[#FBCFE8]/50 p-16 text-center shadow-sm">
            <p className="text-lg text-[#666666] mb-6">Your bag is looking a little empty.</p>
            <button onClick={() => router.push('/feed')} className="bg-[#111111] text-white px-8 py-3 rounded-full font-bold hover:bg-black/80 transition-colors">
              Explore the Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT: Cart Items */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[1.5rem] p-4 flex gap-5 shadow-sm border border-black/5">
                    <div className="w-24 h-32 bg-black/5 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                      </div>
                      <p className="text-[#888888] text-sm mb-auto">Qty: {item.quantity}</p>
                      
                      <button onClick={() => removeFromCart(item.id)} className="text-[#ff3f6c] text-sm font-bold flex items-center gap-1 w-fit hover:opacity-70 transition-opacity mt-2">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#FBCFE8]/50 sticky top-28">
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Order Summary</h3>
                
                <div className="flex flex-col gap-4 text-[#666666] font-medium border-b border-[#FBCFE8] pb-6 mb-6">
                  <div className="flex justify-between"><span>Subtotal</span> <span>₹{getTotalPrice()}</span></div>
                  <div className="flex justify-between"><span>Shipping</span> <span className="text-green-500 font-bold">FREE</span></div>
                  <div className="flex justify-between"><span>Tribe Discount</span> <span className="text-[#ff3f6c]">-₹150</span></div>
                </div>

                <div className="flex justify-between text-2xl font-bold mb-8 text-[#111111]">
                  <span>Total</span>
                  <span>₹{getTotalPrice() - 150 > 0 ? getTotalPrice() - 150 : 0}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  className="w-full text-white py-4 rounded-full font-bold text-lg tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 hover:-translate-y-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  {isCheckingOut ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}