import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.status !== "AVAILABLE" || product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-bg flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-4xl text-muted">
            {product.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        {product.category && (
          <p className="text-[11px] uppercase tracking-wide text-muted font-medium">
            {product.category.name}
          </p>
        )}
        <h3 className="font-display text-lg leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="price-tag text-sm">${product.price.toFixed(2)}</span>
          {outOfStock ? (
            <span className="text-xs text-error font-medium">Out of stock</span>
          ) : (
            <span className="text-xs text-muted">{product.stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
