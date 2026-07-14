import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <-- 1. Import persist

export type TribeType = 'default' | 'golden-hour' | 'neon-static' | 'vault-heir';

export interface ThemeConfig {
  font: string;
  mode: string;
  text: string;
  accent: string;
  primary: string;
  surface: string;
  cardStyle: string;
  secondary: string;
  background: string;
  buttonStyle: string;
  bannerAnimation: string;
}

interface TribeState {
  currentTribe: TribeType;
  themeConfig: ThemeConfig;
  avatarId: string | null;
  setTribe: (tribe: TribeType, config?: ThemeConfig) => void;
  setAvatarId: (id: string) => void;
}

const defaultTheme: ThemeConfig = {
  font: "Inter",
  mode: "light",
  text: "#111111",
  accent: "#ff3f6c",
  primary: "#ffffff",
  surface: "#f9f9f9",
  cardStyle: "clean",
  secondary: "#000000",
  background: "#ffffff",
  buttonStyle: "rounded",
  bannerAnimation: "none"
};

// 2. Wrap the store in the persist middleware!
export const useTribeStore = create<TribeState>()(
  persist(
    (set) => ({
      currentTribe: 'default',
      themeConfig: defaultTheme,
      avatarId: null,
      setTribe: (tribe, config) => set((state) => ({ 
        currentTribe: tribe, 
        themeConfig: config || state.themeConfig 
      })),
      setAvatarId: (id) => set({ avatarId: id }),
    }),
    {
      name: 'tribe-storage', // This is the key it saves under in localStorage
    }
  )
);