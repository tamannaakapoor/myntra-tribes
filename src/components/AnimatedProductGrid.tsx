'use client';
import { motion, Variants } from 'framer-motion'; // <-- 1. Add Variants here
import ProductCard from './ProductCard';
import { Product } from '@/store/useBuilderStore';

// 2. Explicitly tell TypeScript these are Framer Motion Variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

// ... keep the rest of your component code exactly the same ...

export default function AnimatedProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-3 text-center py-10 opacity-50">
        Waiting for database connection...
      </div>
    );
  }

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="grid grid-cols-2 md:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}