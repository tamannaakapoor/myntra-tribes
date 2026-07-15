'use client';

import { useTribeStore } from '@/store/useTribeStore';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTribe = useTribeStore((state) => state.currentTribe);

  useEffect(() => {
    // 1. Grab the HTML body tag directly
    const body = document.body;
    
    // 2. Wipe any old theme classes so they don't accidentally stack up
    body.classList.remove('theme-golden-hour', 'theme-neon-static', 'theme-vault-heir');

    // 3. Inject the winning tribe's CSS class globally!
    if (currentTribe !== 'default') {
      body.classList.add(`theme-${currentTribe}`);
    }
  }, [currentTribe]);

  // We no longer need a wrapper div. We just pass the app through!
  return <>{children}</>;
}