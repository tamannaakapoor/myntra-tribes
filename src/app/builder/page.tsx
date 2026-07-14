import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import LookbookCanvas from '@/components/LookbookCanvas';
import CatalogBrowser from '@/components/CatalogBrowser';
import { Product } from '@/store/useBuilderStore';

// This disables Server-Side Rendering (SSR) for the Publish component
const PublishSection = dynamic(() => import('@/components/PublishSection'), {
  ssr: false,
});

// Next.js Server Component
export default async function BuilderPage() {
  let products: Product[] = [];
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data, error } = await supabase.from('products').select('*').limit(100);
    if (error) console.error("Failed to fetch products:", error);
    if (data) products = data;
  }

  return (
    <main className="flex min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto gap-8 pb-20 relative">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <section className="w-full md:w-2/3 flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Tribe Catalog</h1>
          <p className="opacity-70 mt-1 text-lg">Select pieces to build your aesthetic.</p>
        </div>
        
        <CatalogBrowser initialProducts={products} />
      </section>

      <section className="hidden md:flex w-1/3 flex-col pl-8 space-y-6 sticky top-20 h-[calc(100vh-5rem)] border-l border-white/5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Board</h2>
          <p className="opacity-70 text-sm">Review your selected pieces</p>
        </div>

        <LookbookCanvas />
        <PublishSection />
      </section>
    </main>
  );
}