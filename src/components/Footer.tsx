import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t-6">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm">© {new Date().getFullYear()} ENSA OFFLINE</p>
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


