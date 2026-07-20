import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product) => set((state) => {
        // Fallback ID if the backend didn't provide one
        const productId = product.id || product.name; 
        const existingItem = state.cart.find((item) => item.id === productId);
        
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        
        return {
          cart: [...state.cart, { 
            id: productId, 
            name: product.name, 
            price: product.price || 999, 
            image_url: product.image_url || product,
            quantity: 1 
          }],
        };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId)
      })),

      clearCart: () => set({ cart: [] }),

      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'tribe-cart-storage', // Saves to local storage automatically!
    }
  )
);