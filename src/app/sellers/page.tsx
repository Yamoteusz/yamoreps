import PageHeader from '@/components/layout/PageHeader';
import { Star, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const SELLERS = [
  { name: 'Mr. Hou', specialty: 'Buty', rating: 4.9, orders: 12500, verified: true },
  { name: 'Coco', specialty: 'Designer', rating: 4.8, orders: 9800, verified: true },
  { name: 'Toby', specialty: 'Streetwear', rating: 4.9, orders: 15200, verified: true },
  { name: 'Karen', specialty: 'Zegarki', rating: 4.7, orders: 7300, verified: true },
  { name: 'Eric', specialty: 'Akcesoria', rating: 4.8, orders: 8600, verified: true },
  { name: 'Lisa', specialty: 'Lego', rating: 4.6, orders: 4200, verified: false },
  { name: 'Jordan', specialty: 'Sneakery', rating: 5.0, orders: 18400, verified: true },
  { name: 'Mia', specialty: 'Torebki', rating: 4.7, orders: 6700, verified: true },
];

export default function SellersPage() {
  return (
    <>
      <PageHeader
        eyebrow="SPRZEDAWCY"
        title={
          <>
            Zweryfikowani <span className="gradient-text">sprzedawcy</span>
          </>
        }
        description="Lista sprzedawców polecanych przez społeczność. Bezpieczne zakupy, najlepsza jakość."
      />

      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SELLERS.map((seller) => (
              <Link
                key={seller.name}
                href="#"
                className="group relative p-6 rounded-2xl bg-card border border-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-bold text-lg text-white">
                      {seller.name[0]}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                        {seller.name}
                        {seller.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        )}
                      </h3>
                      <p className="text-xs text-muted">{seller.specialty}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary-300 transition-colors" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {seller.rating}
                  </span>
                  <span className="text-muted">
                    {seller.orders.toLocaleString()} zamówień
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
