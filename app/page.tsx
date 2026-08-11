"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

function ProductGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);

    api
      .get<Product[]>(`/products?${params.toString()}`)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">
          {search ? `Results for "${search}"` : "Everyday goods, honestly priced"}
        </h1>
        <p className="text-muted mt-1">
          {search ? `${products.length} product(s) found` : "Browse the full catalog below."}
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryId("")}
          className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap transition-colors ${
            categoryId === "" ? "bg-primary text-white border-primary" : "border-border hover:border-primary"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap transition-colors ${
              categoryId === c.id ? "bg-primary text-white border-primary" : "border-border hover:border-primary"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading products…</p>}
      {error && (
        <p className="text-error text-sm">
          Couldn&apos;t reach the backend: {error}. Make sure the API server is running.
        </p>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No products found. Try a different search or category.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-muted">Loading…</div>}>
      <ProductGrid />
    </Suspense>
  );
}
