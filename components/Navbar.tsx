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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search ? `/?search=${encodeURIComponent(search)}` : "/");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="price-tag !py-1 !px-2 !rounded-sm text-xs !transform-none group-hover:-rotate-3 transition-transform">
              M
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">
              Market
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-bg px-4 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </form>

          <nav className="hidden md:flex items-center gap-4 text-sm ml-auto">
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
                <span className="text-muted">Hi, {user.name.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-muted hover:text-error transition-colors"
                >
                  Logout
                </button>
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

          {/* Mobile controls */}
          <div className="flex items-center gap-3 ml-auto md:hidden">
            <Link href="/cart" className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-1"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-3">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-border bg-bg px-4 py-1.5 text-sm outline-none focus:border-primary"
              />
            </form>
            <div className="flex flex-col gap-3 text-sm">
              {user ? (
                <>
                  <span className="text-muted">Hi, {user.name.split(" ")[0]}</span>
                  <Link href="/orders" onClick={() => setMenuOpen(false)} className="hover:text-primary">
                    My Orders
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin/products" onClick={() => setMenuOpen(false)} className="hover:text-primary">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-muted hover:text-error">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-primary">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-primary text-white px-3 py-1.5 rounded-full w-fit"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
