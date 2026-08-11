"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Product, Category } from "@/lib/types";

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  const loadData = () => {
    Promise.all([api.get<Product[]>("/products?limit=100"), api.get<Category[]>("/categories")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
        if (c.data.length && !form.categoryId) {
          setForm((f) => ({ ...f, categoryId: c.data[0].id }));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
      return;
    }
    if (user?.role === "ADMIN") loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await api.post<Product>("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl || undefined,
        categoryId: form.categoryId,
      });
      setForm((f) => ({ ...f, name: "", description: "", price: "", stock: "", imageUrl: "" }));
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create product");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product");
    }
  };

  if (authLoading || loading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-muted">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold mb-6">Manage products</h1>

      <form
        onSubmit={handleCreate}
        className="bg-surface border border-border rounded-lg p-5 mb-8 grid sm:grid-cols-2 gap-3"
      >
        <input
          placeholder="Product name"
          required
          value={form.name}
          onChange={update("name")}
          className="border border-border rounded-md px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={update("description")}
          className="border border-border rounded-md px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          required
          value={form.price}
          onChange={update("price")}
          className="border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Stock"
          type="number"
          required
          value={form.stock}
          onChange={update("stock")}
          className="border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={update("imageUrl")}
          className="border border-border rounded-md px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          className="border border-border rounded-md px-3 py-2 text-sm sm:col-span-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {error && <p className="text-error text-sm sm:col-span-2">{error}</p>}

        <button
          type="submit"
          disabled={creating}
          className="bg-primary text-white rounded-md py-2 font-medium sm:col-span-2 hover:bg-primary-light transition-colors disabled:opacity-60"
        >
          {creating ? "Adding…" : "Add product"}
        </button>
      </form>

      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        {products.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted font-mono">
                ${p.price.toFixed(2)} · {p.stock} in stock · {p.status}
              </p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-error text-sm shrink-0 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
