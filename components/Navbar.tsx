"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search ? `/?search=${encodeURIComponent(search)}` : "/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-primary shrink-0">
          Market
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-border bg-bg px-4 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <nav className="flex items-center gap-4 text-sm ml-auto">
          <Link href="/cart" className="relative font-medium hover:text-primary transition-colors">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-white text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/orders" className="hover:text-primary transition-colors">
                My Orders
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin/products" className="hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-muted hover:text-error transition-colors"
              >
                Logout
              </button>
              <span className="hidden sm:inline text-muted">Hi, {user.name.split(" ")[0]}</span>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-light transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
