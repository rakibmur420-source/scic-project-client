import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-border overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
            Fresh stock, every week
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] mb-5">
            Everyday goods,
            <br />
            honestly priced.
          </h1>
          <p className="text-muted text-base md:text-lg max-w-md mb-7">
            A small, no-nonsense storefront — browse the catalog, read real reviews, and
            check out in a couple of clicks.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="#catalog"
              className="bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-light transition-colors"
            >
              Shop the catalog
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full font-medium border border-border hover:border-primary transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="relative hidden md:flex items-center justify-center">
          <svg viewBox="0 0 420 340" className="w-full max-w-md" fill="none">
            <rect x="30" y="70" width="360" height="230" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
            <rect x="30" y="70" width="360" height="52" rx="14" fill="var(--primary)" />
            <circle cx="58" cy="96" r="6" fill="var(--accent)" />
            <circle cx="80" cy="96" r="6" fill="var(--surface)" opacity="0.5" />
            <circle cx="102" cy="96" r="6" fill="var(--surface)" opacity="0.5" />

            <rect x="56" y="150" width="110" height="110" rx="8" fill="var(--bg)" stroke="var(--border)" strokeWidth="2" />
            <rect x="196" y="150" width="110" height="52" rx="8" fill="var(--bg)" stroke="var(--border)" strokeWidth="2" />
            <rect x="196" y="212" width="110" height="48" rx="8" fill="var(--bg)" stroke="var(--border)" strokeWidth="2" />

            <g transform="translate(300,40) rotate(-8)">
              <path d="M0 20 L20 0 L70 0 A10 10 0 0 1 80 10 L80 50 A10 10 0 0 1 70 60 L20 60 A10 10 0 0 1 10 50 Z" fill="var(--accent)" />
              <circle cx="18" cy="14" r="5" fill="var(--bg)" />
              <text x="44" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="16" fontWeight="700" fill="white">
                $
              </text>
            </g>

            <g transform="translate(300,40) rotate(-8)">
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
