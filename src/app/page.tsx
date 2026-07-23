import { redirect } from 'next/navigation';

export default function HomePage() {
  // Instantly redirects anyone visiting the root URL ('/') to the '/auth' page
  redirect('/auth');
}