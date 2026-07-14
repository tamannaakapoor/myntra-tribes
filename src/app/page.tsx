import { redirect } from 'next/navigation';

export default function HomePage() {
  // Instantly routes users to the Vibe Quiz when they open the app
  redirect('/onboarding');
}