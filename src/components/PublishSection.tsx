'use client';
import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useTribeStore } from '@/store/useTribeStore'; // <-- 1. Import the Tribe Store
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PublishSection() {
  const savedItems = useBuilderStore((state) => state.savedItems);
  const clearBoard = useBuilderStore((state) => state.clearBoard);
  const avatarId = useTribeStore((state) => state.avatarId); // <-- 2. Pull the real user ID
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (savedItems.length === 0) return alert("Add some items first!");
    if (!title) return alert("Give your lookbook a title!");
    
    // 3. Block publishing if they haven't been assigned an avatar ID yet!
    if (!avatarId) {
      return alert("You need to take the Vibe Quiz first to create your avatar!");
    }
    
    setIsPublishing(true);

    try {
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim().replace(/^#/, ''))
        .filter(tag => tag.length > 0);
      
      // 4. Send the REAL avatarId to the database!
      const { data: lookbookData, error: lookbookError } = await supabase
        .from('lookbooks')
        .insert([{ 
            title: title, 
            description: description,
            tags: formattedTags,
            avatar_id: avatarId 
        }])
        .select()
        .single(); 

      if (lookbookError) throw lookbookError;

      const newLookbookId = lookbookData.id;

      const itemsToInsert = savedItems.map((item) => ({
        lookbook_id: newLookbookId,
        product_id: item.id
      }));

      const { error: itemsError } = await supabase
        .from('lookbook_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 5. Success! Clear board and route to the Feed page
      alert(`Successfully published "${title}" with ${savedItems.length} items!`);
      clearBoard(); 
      setTitle('');
      setDescription('');
      setTags('');
      
      // Tell Next.js to fetch new data and immediately navigate to the feed
      router.refresh(); 
      router.push('/feed');

    } catch (error: any) {
      console.error("Full Publish Error:", error);
      alert(`Failed to publish: ${error.message || 'Check the console for details.'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pt-4 border-t border-white/10 mt-auto">
      
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-bold tracking-wider uppercase opacity-60">Lookbook Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Midnight Run..." 
          className="w-full bg-[var(--surface)]/50 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)] transition-colors text-sm placeholder-[var(--text-main)]/30"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-xs font-bold tracking-wider uppercase opacity-60">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's the vibe?" 
          rows={2}
          className="w-full bg-[var(--surface)]/50 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)] transition-colors text-sm placeholder-[var(--text-main)]/30 resize-none"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-xs font-bold tracking-wider uppercase opacity-60">Aesthetic Tags</label>
        <input 
          type="text" 
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="y2k, streetwear, dark" 
          className="w-full bg-[var(--surface)]/50 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)] transition-colors text-sm placeholder-[var(--text-main)]/30"
        />
      </div>

      <button 
        onClick={handlePublish}
        disabled={isPublishing || savedItems.length === 0}
        className={`w-full py-4 mt-2 rounded-xl font-bold tracking-wide transition-all shadow-xl shadow-[var(--accent)]/20 flex items-center justify-center
          ${savedItems.length === 0 
            ? 'bg-black/20 dark:bg-white/10 cursor-not-allowed opacity-50 text-[var(--text-main)]' 
            : 'bg-[var(--accent)] text-[var(--bg-primary)] hover:scale-[1.02] active:scale-95'
          }
        `}
      >
        {isPublishing ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-[var(--bg-primary)] rounded-full animate-spin"></div>
        ) : (
          `Publish Lookbook`
        )}
      </button>
    </div>
  );
}