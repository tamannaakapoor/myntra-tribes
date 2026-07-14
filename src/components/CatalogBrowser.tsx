'use client';
import { useState } from 'react';
import { Product } from '@/store/useBuilderStore';
import AnimatedProductGrid from './AnimatedProductGrid';
import { Search } from 'lucide-react';

export default function CatalogBrowser({ initialProducts }: { initialProducts: Product[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Real-time filtering based on Name or Brand
  const filteredProducts = initialProducts.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Interactive Search Bar */}
      <div className="w-full h-14 border border-black/10 dark:border-white/10 rounded-xl flex items-center px-4 bg-[var(--surface)]/50 backdrop-blur-md focus-within:border-[var(--accent)] transition-colors shadow-lg shadow-black/5">
        <Search size={20} className="text-[var(--text-main)] opacity-50 mr-3" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, brands, or vibes..." 
          className="w-full bg-transparent outline-none text-[var(--text-main)] placeholder-[var(--text-main)]/40"
        />
      </div>

      {/* Pass the dynamically filtered list to your grid */}
      <AnimatedProductGrid products={filteredProducts} />
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 opacity-50 font-medium">
          No items match "{searchTerm}"
        </div>
      )}
    </div>
  );
}