import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="price-tag !py-1 !px-2 !rounded-sm text-xs !transform-none">M</span>
            <span className="font-display text-xl font-semibold text-primary">Market</span>
          </div>
          <p className="text-sm text-muted max-w-xs">
            A small storefront built on the SCIC/EJP-13 backend — Express, TypeScript, Prisma,
            and PostgreSQL under the hood.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Shop</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-primary transition-colors">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-primary transition-colors">
                My orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Account</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/login" className="hover:text-primary transition-colors">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary transition-colors">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="receipt-dash">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted font-mono">
          © {new Date().getFullYear()} Market — SCIC/EJP-13 backend project.
        </p>
      </div>
    </footer>
  );
}
