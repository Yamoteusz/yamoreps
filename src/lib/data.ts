/**
 * Static data: agents and stats. Products live in `data/products.json`
 * and are served via `lib/products.ts`.
 */

export interface Agent {
  name: string;
  logo: string;
  color: string;
  href: string;
  featured?: boolean;
  description?: string;
}

export const AGENTS: Agent[] = [
  {
    name: 'Mulebuy',
    logo: '🐴',
    color: 'from-violet-500 to-fuchsia-500',
    href: 'https://mulebuy.com/?ref=200054759',
    featured: true,
    description: 'Najnowszy i najszybciej rosnący agent. Rekomendowany przez społeczność.',
  },
  {
    name: 'Kakobuy',
    logo: '🛒',
    color: 'from-orange-500 to-red-500',
    href: 'https://kakobuy.com',
    featured: true,
    description: 'Sprawdzony agent z konkurencyjnymi cenami wysyłki.',
  },
  {
    name: 'Sugargoo',
    logo: '🍭',
    color: 'from-pink-500 to-rose-500',
    href: 'https://sugargoo.com',
    featured: true,
    description: 'Doświadczony agent z najlepszą obsługą klienta.',
  },
  {
    name: 'CSSBuy',
    logo: '🛍️',
    color: 'from-indigo-500 to-purple-500',
    href: 'https://cssbuy.com',
    featured: true,
    description: 'Klasyczny agent z bogatym doświadczeniem.',
  },
  {
    name: 'Hoobuy',
    logo: '🦉',
    color: 'from-amber-500 to-yellow-500',
    href: 'https://hoobuy.com',
    description: 'Szybko rozwijający się agent z dobrym QC.',
  },
  {
    name: 'CNFans',
    logo: '🐉',
    color: 'from-red-500 to-orange-500',
    href: 'https://cnfans.com',
    description: 'Popularny wśród społeczności reps.',
  },
  {
    name: 'Allchinabuy',
    logo: '🏯',
    color: 'from-emerald-500 to-teal-500',
    href: 'https://allchinabuy.com',
    description: 'Następca Superbuy z szerokim wsparciem platform.',
  },
  {
    name: 'Joyabuy',
    logo: '✨',
    color: 'from-cyan-500 to-blue-500',
    href: 'https://joyabuy.com',
    description: 'Następca Pandabuy, znany z prostego UI.',
  },
  {
    name: 'Oopbuy',
    logo: '📦',
    color: 'from-blue-500 to-cyan-500',
    href: 'https://oopbuy.com',
    description: 'Stabilny agent z dobrymi opcjami warehouse.',
  },
  {
    name: 'USFans',
    logo: '⭐',
    color: 'from-purple-500 to-pink-500',
    href: 'https://usfans.com',
    description: 'Agent z dużymi promocjami dla nowych użytkowników.',
  },
  {
    name: 'ACBuy',
    logo: '🅰️',
    color: 'from-green-500 to-emerald-500',
    href: 'https://acbuy.com',
    description: 'Nowy agent zdobywający popularność w 2026.',
  },
  {
    name: 'LitBuy',
    logo: '💡',
    color: 'from-yellow-500 to-orange-500',
    href: 'https://litbuy.com',
    description: 'Lekki interfejs i szybkie zamówienia.',
  },
];

export const FEATURED_AGENTS = AGENTS.filter((a) => a.featured);

export const STATS = [
  { label: 'Reviewed Items', value: '1100+' },
  { label: 'Discord Users', value: '120k+' },
  { label: 'Verified Sellers', value: '500+' },
  { label: 'Daily Visitors', value: '50k+' },
];
