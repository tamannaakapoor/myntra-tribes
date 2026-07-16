// src/components/SwipeDeck.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTribeStore, TribeType } from '@/store/useTribeStore';

// We will use 3 mock images representing Aditi's 3 database tribes
const MOOD_CARDS = [
  {
    id: 1,
    tribe: 'vault-heir',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600',
    alt: 'Old money elegance',
  },
  {
    id: 2,
    tribe: 'neon-static',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600',
    alt: 'Cyberpunk neon street',
  },
  {
    id: 3,
    tribe: 'golden-hour',
    image: 'https://images.unsplash.com/photo-1614252339474-df31eb7ca298?q=80&w=600',
    alt: 'Cinematic warm lighting',
  }
];

export default function SwipeDeck() {
  const [cards, setCards] = useState(MOOD_CARDS);
  const [lastLikedTribe, setLastLikedTribe] = useState<TribeType>('golden-hour'); // fallback
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const setTribe = useTribeStore((state) => state.setTribe);

  // Framer motion drag physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Mocking the Server Action call to Aditi's Backend (Day 2 checklist item)
  const mockServerActionAssignTribe = async (winningTribe: TribeType) => {
    setIsAnalyzing(true);
    // Fake a 1.5 second network request to the backend
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    
    // Once the "server" responds, trigger the Zustand theme swap!
    setTribe(winningTribe);
    setIsAnalyzing(false);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    const topCard = cards[0];
    
    // Swiped Right (Liked)
    if (info.offset.x > swipeThreshold) {
      setLastLikedTribe(topCard.tribe as TribeType);
      removeTopCard(topCard.tribe as TribeType);
    } 
    // Swiped Left (Passed)
    else if (info.offset.x < -swipeThreshold) {
      removeTopCard(lastLikedTribe); // Pass current liked through
    }
  };

  const removeTopCard = (currentWinner: TribeType) => {
    const remainingCards = cards.slice(1);
    setCards(remainingCards);
    
    // If no cards left, call the mock server action!
    if (remainingCards.length === 0) {
      mockServerActionAssignTribe(currentWinner);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold tracking-widest uppercase">Analyzing your vibe...</h2>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Tribe Assigned.</h2>
          <p className="text-lg opacity-80 mt-2">Your UI has been reskinned based on your choices.</p>
        </div>
        
        {/* NEW: Button to transition to Day 3 */}
        <Link 
          href="/builder"
          className="px-8 py-4 bg-[var(--accent)] text-white rounded-full font-bold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--accent)]/20"
        >
          Enter the Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-80 h-[450px] mx-auto mt-12">
      {cards.map((card, index) => {
        const isTopCard = index === 0;

        return (
          <motion.div
            key={card.id}
            style={isTopCard ? { x, rotate, opacity } : {}}
            drag={isTopCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={isTopCard ? handleDragEnd : undefined}
            className="absolute inset-0 w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing origin-bottom"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: isTopCard ? 1 : 0.95, y: isTopCard ? 0 : 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src={card.image} 
              alt={card.alt} 
              className="w-full h-full object-cover pointer-events-none opacity-90"
            />
            {/* Gradient overlay so text/ui pops */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-0 right-0 px-6 text-center text-white pointer-events-none">
               <span className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase border border-white/20">
                 {card.tribe.replace('-', ' ')}
               </span>
            </div>
          </motion.div>
        );
      }).reverse()}
    </div>
  );
}