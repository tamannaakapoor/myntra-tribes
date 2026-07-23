'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useTribeStore } from '@/store/useTribeStore';
import { Plus, Trophy, ShoppingBag, LogOut, Loader2, Sparkles } from 'lucide-react';

// --- NAVBAR MINI AVATAR (same figure used on the dashboard navbar) ---
function NavAvatar({ skinTone, hairStyle }: { skinTone: string; hairStyle: string }) {
  return (
    <svg viewBox="40 20 120 120" className="w-full h-full pt-2 drop-shadow-sm">
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      {hairStyle === 'Curly' && <path d="M50 80 Q40 100 55 120 Q45 140 60 160 Q80 170 100 170 Q120 170 140 160 Q155 140 145 120 Q160 100 150 80 Z" fill="#2C1B18" />}
      <rect x="92" y="110" width="16" height="20" fill={skinTone} />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill="#ff4d79" />
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <circle cx="85" cy="80" r="3.5" fill="#111111" />
      <circle cx="115" cy="80" r="3.5" fill="#111111" />
      <circle cx="72" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <circle cx="128" cy="88" r="5" fill="#ff4d79" opacity="0.4" />
      <path d="M 92 92 Q 100 100 108 92" stroke="#ff4d79" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
      {hairStyle !== 'Buzz' && <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />}
      {hairStyle === 'Buzz' && <path d="M 62 80 A 38 38 0 0 1 138 80 A 40 40 0 0 0 62 80 Z" fill="#2C1B18" opacity="0.8" />}
    </svg>
  );
}

// --- FULL-BODY AVATAR (podium + list rows) ---
function LeaderboardAvatar({ skinTone, hairStyle, color1, color2 }: { skinTone: string; hairStyle: string; color1: string; color2: string }) {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-sm shrink-0">
      <defs>
        <linearGradient id={`grad-${color1.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color1} /><stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      {hairStyle === 'Long' && <rect x="55" y="70" width="90" height="110" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bob' && <rect x="55" y="70" width="90" height="50" rx="20" fill="#2C1B18" />}
      {hairStyle === 'Bun' && <circle cx="100" cy="30" r="22" fill="#2C1B18" />}
      <rect x="85" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <rect x="105" y="210" width="10" height="70" rx="5" fill={skinTone} />
      <ellipse cx="90" cy="285" rx="12" ry="7" fill={color2} />
      <ellipse cx="110" cy="285" rx="12" ry="7" fill={color2} />
      <path d="M 65 125 L 135 125 L 130 220 L 70 220 Z" fill={`url(#grad-${color1.slice(1)})`} />
      <circle cx="100" cy="80" r="38" fill={skinTone} />
      <path d="M 62 75 Q 100 40 138 75 A 38 38 0 0 0 62 75 Z" fill="#2C1B18" />
    </svg>
  );
}

// --- TRIBE DISPLAY META, keyed by a normalized slug so it accepts either
//     the store's slug ("neon-static") or the backend's display name ("Neon Static") ---
const TRIBE_STYLE: Record<string, { c1: string; c2: string }> = {
  'golden-hour': { c1: '#A3B18A', c2: '#FFF8EE' },
  'neon-static': { c1: '#8A2BE2', c2: '#39FF14' },
  'vault-heir': { c1: '#355070', c2: '#D2B48C' },
};
const TRIBE_LABELS: Record<string, string> = {
  'golden-hour': 'Golden Hour',
  'neon-static': 'Neon Static',
  'vault-heir': 'Vault Heir',
};
const DEFAULT_STYLE = { c1: '#ff3f6c', c2: '#ff99b3' };

const normalizeTribeKey = (t?: string | null) => (t || '').toLowerCase().trim().replace(/\s+/g, '-');
const getTribeStyle = (t?: string | null) => TRIBE_STYLE[normalizeTribeKey(t)] || DEFAULT_STYLE;
const getTribeLabel = (t?: string | null) => TRIBE_LABELS[normalizeTribeKey(t)] || 'Unassigned';

// --- BADGE LADDER (same thresholds shown on the profile page) ---
const BADGES = [
  { name: 'Trend Sprout', emoji: '🌱', threshold: 0 },
  { name: 'Style Rookie', emoji: '✨', threshold: 50 },
  { name: 'Trendsetter', emoji: '💫', threshold: 150 },
  { name: 'Style Icon', emoji: '👑', threshold: 400 },
  { name: 'Fashion Oracle', emoji: '🔮', threshold: 1000 },
];
function getCurrentBadge(points: number) {
  return [...BADGES].reverse().find((b) => points >= b.threshold) || BADGES[0];
}

interface BackendLeader {
  username?: string | null;
  points?: number | null;
  tribe?: string | null;
  avatar?: { skin_color?: string; hair?: string } | null;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  handle: string;
  tribeLabel: string;
  pts: number;
  badgeName: string;
  badgeEmoji: string;
  skin: string;
  hair: string;
  c1: string;
  c2: string;
  isCurrentUser: boolean;
  rank?: number;
}

// Seed creators shown only if the live /api/leaderboard call can't be reached
// (e.g. the Render backend is cold-starting). Shaped exactly like the API response
// so both go through the same mapper below.
const FALLBACK_CREATORS = [
  { username: 'kavya_neon', points: 1240, tribe: 'Neon Static', avatar: { skin_color: '#8A5A44', hair: 'Bob' } },
  { username: 'ananya_style', points: 1180, tribe: 'Golden Hour', avatar: { skin_color: '#C29270', hair: 'Long' } },
  { username: 'priya_y2k', points: 950, tribe: 'Vault Heir', avatar: { skin_color: '#F3D9C6', hair: 'Bun' } },
  { username: 'ishita_fits', points: 680, tribe: 'Neon Static', avatar: { skin_color: '#4A2E2B', hair: 'Long' } },
  { username: 'sneha_vibes', points: 310, tribe: 'Golden Hour', avatar: { skin_color: '#8A5A44', hair: 'Long' } },
];

function mapBackendLeader(l: BackendLeader, idx: number): LeaderboardEntry {
  const style = getTribeStyle(l.tribe);
  const pts = Number(l.points) || 0;
  const badge = getCurrentBadge(pts);
  const uname: string = l.username || `creator${idx + 1}`;
  return {
    id: `leader-${uname}-${idx}`,
    name: l.username || 'Tribe Member',
    handle: `@${uname.toLowerCase().replace(/\s+/g, '')}`,
    tribeLabel: getTribeLabel(l.tribe),
    pts,
    badgeName: badge.name,
    badgeEmoji: badge.emoji,
    skin: l.avatar?.skin_color || '#E0B594',
    hair: l.avatar?.hair || 'Long',
    c1: style.c1,
    c2: style.c2,
    isCurrentUser: false,
  };
}

const PODIUM_BASE_COLOR = ['#ff4d79', '#ff99b3', '#ffb3c6']; // rank 1 / 2 / 3

export default function LeaderboardPage() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarConfig, setAvatarConfig] = useState({ skin_color: '#E0B594', hair: 'Long' });
  const [points, setPoints] = useState(500);
  const [myLookbookCount, setMyLookbookCount] = useState<number | null>(null);
  const [otherCreators, setOtherCreators] = useState<LeaderboardEntry[] | null>(null); // null = still loading

  const cartCount = useCartStore((state) => state.getTotalItems());
  const currentTribe = useTribeStore((state) => state.currentTribe);

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'https://myntra-tribes.onrender.com/api';
    if (!url.endsWith('/api')) url = `${url.replace(/\/$/, '')}/api`;
    return url;
  };

  useEffect(() => {
    setIsMounted(true);

    // 1. Username — same lookup shape the dashboard navbar uses
    let myUname = '';
    const userStr = localStorage.getItem('tribe_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        myUname = parsed.username || parsed.name || parsed.user?.username || parsed.user?.name || parsed.data?.username || parsed.data?.name || '';
        if (myUname) setUsername(myUname);
      } catch {}
    }

    // 2. Tribe Points — same localStorage key the navbar/checkout/academy/profile read and write
    const savedPoints = localStorage.getItem('tribe_points');
    if (savedPoints) {
      setPoints(Number(savedPoints));
    } else {
      localStorage.setItem('tribe_points', '500');
    }

    const token = localStorage.getItem('tribe_jwt');

    // 3. Avatar
    if (token) {
      fetch(`${getApiUrl()}/avatar/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          const avatarData = data.avatar || data.data || data;
          if (avatarData && avatarData.skin_color) setAvatarConfig(avatarData);
        })
        .catch(() => {});

      // 4. My real published lookbook count
      fetch(`${getApiUrl()}/lookbooks/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setMyLookbookCount(typeof data?.count === 'number' ? data.count : 0))
        .catch(() => setMyLookbookCount(0));
    } else {
      setMyLookbookCount(0);
    }

    // 5. Community leaderboard — real backend, graceful offline fallback
    fetch(`${getApiUrl()}/leaderboard`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then((data) => {
        const leaders = Array.isArray(data.leaders) ? data.leaders : [];
        const withoutMe = leaders.filter((l: BackendLeader) => (l.username || '').toLowerCase().trim() !== myUname.toLowerCase().trim());
        setOtherCreators(withoutMe.map(mapBackendLeader));
      })
      .catch(() => {
        setOtherCreators(FALLBACK_CREATORS.map(mapBackendLeader));
      });
  }, []);

  if (!isMounted) return null;

  const myStyle = getTribeStyle(currentTribe);
  const myBadge = getCurrentBadge(points);
  const myEntry: LeaderboardEntry = {
    id: 'you',
    name: username || 'You',
    handle: username ? `@${username.toLowerCase().replace(/\s+/g, '')}` : '@you',
    tribeLabel: getTribeLabel(currentTribe),
    pts: points,
    badgeName: myBadge.name,
    badgeEmoji: myBadge.emoji,
    skin: avatarConfig.skin_color,
    hair: avatarConfig.hair,
    c1: myStyle.c1,
    c2: myStyle.c2,
    isCurrentUser: true,
  };

  const isLoadingLeaders = otherCreators === null;
  const ranked: LeaderboardEntry[] = isLoadingLeaders
    ? []
    : [...(otherCreators as LeaderboardEntry[]), myEntry].sort((a, b) => b.pts - a.pts).map((e, i) => ({ ...e, rank: i + 1 }));

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const myRank = ranked.find((e) => e.isCurrentUser)?.rank ?? 1;

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#111111] font-sans pb-20">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FBCFE8]/50 h-20 flex items-center px-6">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white font-serif font-bold text-xl">M</div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase">Myntra</span>
              <span className="font-serif font-bold text-xl tracking-tight">Tribes</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => router.push('/dashboard')} className="text-[#666666] hover:text-black">Home</button>
            <button onClick={() => router.push('/feed')} className="text-[#666666] hover:text-black">Feed</button>
            <button className="px-4 py-2 bg-black/5 rounded-full font-bold">Leaderboard</button>
            <button onClick={() => router.push('/builder')} className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#E11D48]">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#ff3f6c]/10 text-[#ff3f6c] px-4 py-2 rounded-full font-bold text-sm">
              <Trophy className="w-4 h-4" /> {points} pts
            </div>
            <button onClick={() => router.push('/persona')} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ring-2 ring-transparent hover:ring-[#ff3f6c]/30" style={{ backgroundColor: `${avatarConfig.skin_color}40` }}>
              <NavAvatar skinTone={avatarConfig.skin_color} hairStyle={avatarConfig.hair} />
            </button>
            <button onClick={() => router.push('/checkout')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#ff3f6c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </div>
              )}
            </button>
            <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="text-[#888888] hover:text-black transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1000px] mx-auto px-6 pt-32">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#ff3f6c] uppercase mb-2">Creator Leaderboard</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>Fashion&apos;s rising stars</h1>
          <p className="text-lg text-[#666666]">Votes and publishes grow the community ranks. Academy lessons and orders build your own Tribe Points.</p>
        </div>

        {isLoadingLeaders ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#888888]">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#ff3f6c]" />
            <p className="text-sm font-medium">Loading the leaderboard…</p>
          </div>
        ) : (
          <>
            {/* YOUR RANKING */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#111111]/10 mb-16 flex flex-col sm:flex-row items-center gap-6">
              <div className="h-24 w-14 shrink-0">
                <LeaderboardAvatar skinTone={myEntry.skin} hairStyle={myEntry.hair} color1={myEntry.c1} color2={myEntry.c2} />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase mb-1">Your Ranking</p>
                <h3 className="font-bold text-2xl font-serif">{myEntry.name}</h3>
                <p className="text-xs text-[#888888] mt-1">
                  {myEntry.tribeLabel} • {myLookbookCount === null ? 'loading lookbooks…' : `${myLookbookCount} lookbook${myLookbookCount !== 1 ? 's' : ''} published`}
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#ff3f6c]">#{myRank}</p>
                  <p className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">of {ranked.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black">{myEntry.pts}</p>
                  <p className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl">{myEntry.badgeEmoji}</p>
                  <p className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">{myEntry.badgeName}</p>
                </div>
              </div>
            </div>

            {/* PODIUM (Top 3) */}
            <div className="flex justify-center items-end gap-4 md:gap-8 mt-16 mb-16">
              {/* Rank 2 */}
              {podium[1] && (
                <div className="flex flex-col items-center w-1/3">
                  <div className={`h-32 w-24 mb-2 rounded-full ${podium[1].isCurrentUser ? 'ring-4 ring-[#111111] ring-offset-2 ring-offset-[#FFF5F8]' : ''}`}>
                    <LeaderboardAvatar skinTone={podium[1].skin} hairStyle={podium[1].hair} color1={podium[1].c1} color2={podium[1].c2} />
                  </div>
                  <h3 className="font-bold text-xl font-serif flex items-center gap-1.5">
                    {podium[1].name}
                    {podium[1].isCurrentUser && <span className="text-[9px] bg-[#111111] text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                  </h3>
                  <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{podium[1].badgeEmoji} {podium[1].badgeName}</p>
                  <div className="w-full rounded-t-3xl h-[120px] flex items-center justify-center text-white font-black text-4xl shadow-sm" style={{ backgroundColor: PODIUM_BASE_COLOR[1] }}>#2</div>
                </div>
              )}

              {/* Rank 1 */}
              {podium[0] && (
                <div className="flex flex-col items-center w-1/3 z-10">
                  <div className={`h-40 w-28 mb-2 rounded-full ${podium[0].isCurrentUser ? 'ring-4 ring-[#111111] ring-offset-2 ring-offset-[#FFF5F8]' : ''}`}>
                    <LeaderboardAvatar skinTone={podium[0].skin} hairStyle={podium[0].hair} color1={podium[0].c1} color2={podium[0].c2} />
                  </div>
                  <div className="text-2xl mb-1">👑</div>
                  <h3 className="font-bold text-2xl font-serif flex items-center gap-1.5">
                    {podium[0].name}
                    {podium[0].isCurrentUser && <span className="text-[9px] bg-[#111111] text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                  </h3>
                  <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{podium[0].badgeEmoji} {podium[0].badgeName}</p>
                  <div className="w-full rounded-t-3xl h-[160px] flex items-center justify-center text-white font-black text-5xl shadow-xl" style={{ backgroundColor: PODIUM_BASE_COLOR[0] }}>#1</div>
                </div>
              )}

              {/* Rank 3 */}
              {podium[2] && (
                <div className="flex flex-col items-center w-1/3">
                  <div className={`h-32 w-24 mb-2 rounded-full ${podium[2].isCurrentUser ? 'ring-4 ring-[#111111] ring-offset-2 ring-offset-[#FFF5F8]' : ''}`}>
                    <LeaderboardAvatar skinTone={podium[2].skin} hairStyle={podium[2].hair} color1={podium[2].c1} color2={podium[2].c2} />
                  </div>
                  <h3 className="font-bold text-xl font-serif flex items-center gap-1.5">
                    {podium[2].name}
                    {podium[2].isCurrentUser && <span className="text-[9px] bg-[#111111] text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                  </h3>
                  <p className="text-xs text-[#ff3f6c] bg-[#FFF5F8] px-2 py-1 rounded-md font-bold mb-4 mt-1">{podium[2].badgeEmoji} {podium[2].badgeName}</p>
                  <div className="w-full rounded-t-3xl h-[100px] flex items-center justify-center text-white font-black text-4xl shadow-sm" style={{ backgroundColor: PODIUM_BASE_COLOR[2] }}>#3</div>
                </div>
              )}
            </div>

            {/* LIST (rank 4 onward — top 3 already shown on the podium) */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-4 mb-20">
                {rest.map((entry) => (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm border transition-all ${
                      entry.isCurrentUser ? 'border-[#111111] ring-2 ring-[#111111]/10' : 'border-[#FBCFE8]/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-6 min-w-0">
                      <span className="text-3xl font-bold text-[#ffb3c6] w-8 text-center shrink-0">{entry.rank}</span>
                      <div className="h-20 w-12 shrink-0"><LeaderboardAvatar skinTone={entry.skin} hairStyle={entry.hair} color1={entry.c1} color2={entry.c2} /></div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xl font-serif flex items-center gap-2 truncate">
                          {entry.name}
                          {entry.isCurrentUser && <span className="text-[9px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-full shrink-0">YOU</span>}
                        </h4>
                        <p className="text-xs text-[#888888] truncate">{entry.handle} • {entry.tribeLabel}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[#ff3f6c] font-black text-2xl">{entry.pts}</span>
                      <span className="text-[10px] font-bold bg-[#FFF5F8] text-[#ff3f6c] border border-[#ff3f6c]/20 px-3 py-1 rounded-full flex items-center gap-1">
                        {entry.badgeEmoji} {entry.badgeName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BADGE LADDER */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold font-serif mb-8">Badge Ladder</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {BADGES.map((b) => {
                  const isCurrentTier = myBadge.name === b.name;
                  const unlocked = points >= b.threshold;
                  return (
                    <div
                      key={b.name}
                      className={`bg-white p-6 rounded-2xl flex flex-col items-center text-center shadow-sm border transition-all ${
                        isCurrentTier ? 'border-[#111111] ring-2 ring-[#111111]/10' : 'border-[#FBCFE8]/30'
                      } ${!unlocked ? 'opacity-50' : ''}`}
                    >
                      <span className="text-3xl mb-3">{b.emoji}</span>
                      <h4 className="font-bold text-sm mb-1">{b.name}</h4>
                      <p className="text-xs text-[#888888]">{b.threshold}+ pts</p>
                      {isCurrentTier && <span className="mt-2 text-[8px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-full tracking-wide">YOU&apos;RE HERE</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* BOTTOM CTA FOR CURRENT USER */}
            <div 
              onClick={() => router.push('/builder')}
              className="w-full rounded-[2rem] p-8 md:p-10 bg-gradient-to-br from-[#111111] to-[#222222] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative cursor-pointer shadow-xl hover:scale-[1.02] transform transition-transform duration-300"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ff3f6c]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 text-center md:text-left">
                <h3 className="font-bold text-2xl md:text-3xl mb-2 font-serif flex items-center justify-center md:justify-start gap-2">
                  Want to rank higher? <Sparkles className="w-6 h-6 text-[#ff3f6c]" />
                </h3>
                <p className="text-sm text-white/70 max-w-md">Publishing a new lookbook instantly boosts your score by 20 points. Create your next viral fit now.</p>
              </div>
              <button className="relative z-10 bg-[#ff3f6c] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-[#ff3f6c]/40 transition-shadow whitespace-nowrap flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Lookbook
              </button>
            </div>

          </>
        )}
      </div>
    </main>
  );
}