"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState(user?.address || "");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setError("");
    setPlacing(true);
    try {
      await api.post<Order>("/orders", {
        address,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      clearCart();
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-6">Add something from the catalog to get started.</p>
        <Link href="/" className="bg-primary text-white px-5 py-2 rounded-md font-medium inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold mb-6">Your cart</h1>

      <div className="bg-surface border border-border rounded-lg divide-y divide-border mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-bg rounded-md flex items-center justify-center shrink-0 overflow-hidden">
              {item.product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-xl text-muted">{item.product.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.product.name}</p>
              <p className="font-mono text-sm text-muted">${item.product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="px-2 py-1 hover:bg-bg"
              >
                −
              </button>
              <span className="px-2 font-mono text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="px-2 py-1 hover:bg-bg"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-muted hover:text-error text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex justify-between font-mono text-sm mb-1">
          <span className="text-muted">Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="receipt-dash mt-3 pt-3 flex justify-between font-display text-xl font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Delivery address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Where should we deliver this?"
            className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-error text-sm mt-3">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={placing}
          className="w-full mt-4 bg-accent text-white rounded-md py-2.5 font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {placing ? "Placing order…" : user ? "Place order" : "Log in to check out"}
        </button>
      </div>
    </div>
  );
}
