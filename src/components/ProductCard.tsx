'use client';
import { Product, useBuilderStore } from '@/store/useBuilderStore';
import { Plus } from 'lucide-react'; // Ensure you have lucide-react installed

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useBuilderStore((state) => state.addItem);
  const savedItems = useBuilderStore((state) => state.savedItems);
  
  // Check if this specific item is already on the board
  const isAdded = savedItems.some((item) => item.id === product.id);

  return (
    <div className="group relative flex flex-col bg-[var(--surface)] border border-white/10 rounded-xl overflow-hidden hover:border-[var(--accent)] transition-colors">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full bg-black/5 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Hover Add Button */}
        <button 
          onClick={() => addItem(product)}
          disabled={isAdded}
          className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg backdrop-blur-md transition-all ${
            isAdded 
              ? 'bg-black/50 text-white/50 cursor-not-allowed' 
              : 'bg-[var(--accent)] text-white hover:scale-110 active:scale-95'
          }`}
        >
          <Plus size={20} className={isAdded ? "rotate-45 transition-transform" : ""} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col space-y-1">
        <span className="text-xs font-bold tracking-wider uppercase opacity-60">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className="font-bold">₹{product.price}</span>
          {product.discount && (
            <span className="text-xs text-[var(--accent)] font-semibold">{product.discount}</span>
          )}
        </div>
      </div>
    </div>
  );
}