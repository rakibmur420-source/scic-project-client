"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product, Review } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = () => {
    setLoading(true);
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setReviewError("");
    setSubmittingReview(true);
    try {
      await api.post<Review>("/reviews", { productId: id, rating, comment });
      setComment("");
      setRating(5);
      loadProduct();
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-muted">Loading…</div>;
  if (error || !product)
    return <div className="mx-auto max-w-4xl px-4 py-16 text-error">Product not found.</div>;

  const outOfStock = product.status !== "AVAILABLE" || product.stock === 0;
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-surface border border-border rounded-lg flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-7xl text-muted">{product.name.charAt(0)}</span>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-muted font-medium mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-semibold mb-2">{product.name}</h1>

          {avgRating && (
            <p className="text-sm text-muted mb-3">
              ★ {avgRating} · {product.reviews?.length} review(s)
            </p>
          )}

          <span className="price-tag text-lg mb-4 inline-flex">${product.price.toFixed(2)}</span>

          <p className="text-ink/80 leading-relaxed mt-4 mb-6">
            {product.description || "No description provided."}
          </p>

          {outOfStock ? (
            <p className="text-error font-medium">Currently out of stock.</p>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-bg"
                >
                  −
                </button>
                <span className="px-3 font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 hover:bg-bg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white px-5 py-2 rounded-md font-medium hover:bg-primary-light transition-colors"
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
              <span className="text-xs text-muted">{product.stock} in stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14 receipt-dash pt-8">
        <h2 className="font-display text-2xl font-semibold mb-4">Reviews</h2>

        <form onSubmit={handleReviewSubmit} className="bg-surface border border-border rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Your rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-border rounded-md px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={user ? "Share your thoughts…" : "Log in to leave a review"}
            disabled={!user}
            className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary disabled:bg-bg disabled:text-muted"
            rows={2}
          />
          {reviewError && <p className="text-error text-sm">{reviewError}</p>}
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-ink text-white px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {user ? (submittingReview ? "Posting…" : "Post review") : "Log in to review"}
          </button>
        </form>

        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{r.user?.name || "Anonymous"}</span>
                  <span className="text-accent">{"★".repeat(r.rating)}</span>
                </div>
                {r.comment && <p className="text-sm text-ink/80 mt-1">{r.comment}</p>}
              </div>
            ))
          ) : (
            <p className="text-muted text-sm">No reviews yet. Be the first.</p>
          )}
        </div>
      </div>
    </div>
  );
}
