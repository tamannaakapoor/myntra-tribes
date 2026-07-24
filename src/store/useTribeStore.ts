import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  userGender: string | null;
  points: number; // Global Points State

  setTribe: (tribe: TribeType, config?: ThemeConfig) => void;
  setAvatarId: (id: string) => void;
  setUserGender: (gender: string) => void;
  
  // Point Handlers (Strictly enforces 0 minimum)
  setPoints: (points: number) => void;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => void;
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

export const useTribeStore = create<TribeState>()(
  persist(
    (set) => ({
      currentTribe: 'default',
      themeConfig: defaultTheme,
      avatarId: null,
      userGender: null,
      points: 500, // New users start with 500

      setTribe: (tribe, config) => set((state) => ({ 
        currentTribe: tribe, 
        themeConfig: config || state.themeConfig 
      })),
      setAvatarId: (id) => set({ avatarId: id }),
      setUserGender: (gender) => set({ userGender: gender }),

      // Safely manage points, never dropping below 0
      setPoints: (val) => set({ points: Math.max(0, val) }),
      addPoints: (amount) => set((state) => ({ points: Math.max(0, state.points + amount) })),
      deductPoints: (amount) => set((state) => ({ points: Math.max(0, state.points - amount) })),
    }),
    {
      name: 'tribe-storage',
    }
  )
);