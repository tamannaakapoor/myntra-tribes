import { create } from 'zustand';

// Perfectly aligned with Supabase "products" table!
export interface Product {
  id: string;
  myntra_id: number | string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  primary_tribe_id: string;
  brand: string;
  full_name: string;
  rating?: number | string;
  discount?: string;
  gender?: string;
  product_url?: string;
}

interface BuilderState {
  savedItems: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearBoard: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  savedItems: [],
  
  addItem: (item) => 
    set((state) => {
      // Prevent duplicate items on the board
      if (state.savedItems.some((i) => i.id === item.id)) return state;
      return { savedItems: [...state.savedItems, item] };
    }),

  removeItem: (id) => 
    set((state) => ({
      savedItems: state.savedItems.filter((item) => item.id !== id),
    })),

  clearBoard: () => set({ savedItems: [] }),
}));