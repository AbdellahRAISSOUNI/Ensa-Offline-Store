import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t-6">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm">© 2026 ENSA OFFLINE</p>
          <span className="text-sm text-brand-accent">•</span>
          <p className="text-sm">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/abdellah-raissouni-1419432a8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:text-black transition-colors duration-200 font-bold underline underline-offset-2 hover:underline-offset-4"
            >
              Abdellah Raissouni
            </a>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">grace under pressure</p>
          <Link 
            href="/admin/login"
            className="text-xs text-brand-accent hover:text-brand-green transition-colors duration-200 font-bold uppercase tracking-wider"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}


