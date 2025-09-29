"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Shirt,
  TrendingUp,
  Settings
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminBottomNav() {
  const pathname = usePathname();

  const items: NavItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Products", href: "/admin/products", icon: Shirt },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-black text-white border-t border-gray-800 shadow-[0_-6px_0_0_#000]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Admin bottom navigation"
    >
      <ul className="flex items-stretch justify-between">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
                  isActive ? "text-brand-green" : "text-white hover:text-brand-green"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


