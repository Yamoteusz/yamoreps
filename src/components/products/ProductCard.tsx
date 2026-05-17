import Link from 'next/link';
import Image from 'next/image';
import { Star, MessageSquare } from 'lucide-react';
import { type Product, type ProductTag } from '@/lib/products';
import { cn } from '@/lib/utils';

const TAG_STYLES: Record<ProductTag, string> = {
  BEST: 'bg-gradient-to-r from-primary to-purple-500 text-white',
  BUDGET: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
  RANDOM: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
  NEW: 'bg-gradient-to-r from-accent to-cyan-400 text-black',
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <span
          className={cn(
            'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider',
            TAG_STYLES[product.tag]
          )}
        >
          {product.tag}
        </span>

        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {product.reviews}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
