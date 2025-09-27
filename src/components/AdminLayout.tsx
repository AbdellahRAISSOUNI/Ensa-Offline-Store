"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "■", iconText: "DASH" },
    { name: "Orders", href: "/admin/orders", icon: "□", iconText: "ORD" },
    { name: "Products", href: "/admin/products", icon: "◆", iconText: "PROD" },
    { name: "Analytics", href: "/admin/analytics", icon: "▲", iconText: "ANLY" },
    { name: "Settings", href: "/admin/settings", icon: "●", iconText: "SET" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-black text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col fixed h-screen z-10`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-display font-bold uppercase tracking-tight">
                  ENSA OFFLINE
                </h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-800 transition-colors"
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-brand-green text-black font-bold'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl font-bold">{item.icon}</span>
                    {!sidebarCollapsed ? (
                      <span className="ml-3 font-bold uppercase tracking-wider text-sm">
                        {item.name}
                      </span>
                    ) : (
                      <span className="sr-only">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          {!sidebarCollapsed && (
            <div className="mb-3">
              <p className="text-sm font-bold text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-red-400 hover:bg-gray-800 transition-colors rounded-lg ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <span className="text-lg font-bold">×</span>
            {!sidebarCollapsed && (
              <span className="ml-3 text-sm font-bold uppercase tracking-wider">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Top Bar */}
        <header className="bg-white border-b-6 border-black shadow-brutal">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                  {navigation.find(item => item.href === pathname)?.name || 'Admin'}
                </h2>
                <p className="text-sm text-brand-accent font-bold">
                  Manage your brutalist merch empire
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-black">{user?.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-brand-green border-3 border-black flex items-center justify-center font-bold text-black">
                  👤
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
