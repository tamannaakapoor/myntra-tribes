// src/app/onboarding/page.tsx
import SwipeDeck from '@/components/SwipeDeck';

export default function OnboardingPage() {
  return (
    <main className="flex flex-col items-center min-h-screen pt-20 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Discover Your Identity
        </h1>
        <p className="opacity-70 max-w-sm mx-auto">
          Swipe right if the aesthetic matches your soul. Swipe left to pass.
        </p>
      </div>
      
      <SwipeDeck />
    </main>
  );
}