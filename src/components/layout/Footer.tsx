import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      {/* Flag stripe */}
      <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "42px", width: "auto", display: "block" }} />
              <span className="font-display text-2xl tracking-wide text-foreground">
                nextstar<span className="text-primary">BD</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bangladesh&apos;s free community platform for Free Fire esports
              tournaments.
            </p>
            {/* Flag dots */}
            <div className="flex gap-1.5 mt-4">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="w-3 h-3 rounded-full bg-white border border-border" />
              <span className="w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-secondary mb-3">
              Navigate
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/#upcoming-tournaments", label: "Tournaments" },
                { href: "/hall-of-fame", label: "Hall of Fame" },
                { href: "/rules", label: "Rules" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3">
              Community
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Facebook Group
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {year} nextstarBD. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built for the Bangladesh Free Fire community
            <span className="text-base">🇧🇩</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
