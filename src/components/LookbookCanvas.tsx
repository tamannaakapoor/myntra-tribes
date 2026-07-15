'use client';
import { useBuilderStore } from '@/store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function LookbookCanvas() {
  const savedItems = useBuilderStore((state) => state.savedItems);
  const removeItem = useBuilderStore((state) => state.removeItem);

  if (savedItems.length === 0) {
    return (
      <div className="flex-1 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center bg-[var(--surface)]/50 backdrop-blur-md transition-all">
        <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4 animate-pulse">
          <span className="text-2xl">✨</span>
        </div>
        <p className="opacity-50 text-sm font-medium tracking-wide">Select items to build your aesthetic</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--surface)]/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
      {/* We use a masonry-style layout for the moodboard vibe */}
      <motion.div className="grid grid-cols-2 gap-3" layout>
        <AnimatePresence>
          {savedItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative group rounded-xl overflow-hidden bg-black/20 aspect-square shadow-xl"
              // Slight rotation for a "messy collage" look on even/odd items
              style={{ rotate: index % 2 === 0 ? '-2deg' : '2deg' }}
            >
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover mix-blend-normal group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Glassmorphism Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}