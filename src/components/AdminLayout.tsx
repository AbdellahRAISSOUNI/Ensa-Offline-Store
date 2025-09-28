"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Package, 
  Shirt, 
  TrendingUp, 
  Settings, 
  LogOut, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3, iconText: "DASH" },
    { name: "Orders", href: "/admin/orders", icon: Package, iconText: "ORD" },
    { name: "Products", href: "/admin/products", icon: Shirt, iconText: "PROD" },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp, iconText: "ANLY" },
    { name: "Settings", href: "/admin/settings", icon: Settings, iconText: "SET" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
       {/* Sidebar */}
       <div className={`bg-black text-white transition-all duration-300 ${
         sidebarCollapsed ? 'w-20' : 'w-64'
       } flex flex-col fixed h-screen z-10 shadow-2xl`}>
         {/* Header */}
         <div className="p-4 border-b border-gray-700">
           <div className={`flex items-center ${sidebarCollapsed ? 'flex-col space-y-3' : 'justify-between'}`}>
             {!sidebarCollapsed && (
               <div>
                 <h1 className="text-lg font-display font-bold uppercase tracking-tight">
                   ENSA OFFLINE
                 </h1>
                 <p className="text-xs text-gray-400">Admin Dashboard</p>
               </div>
             )}
             {sidebarCollapsed && (
               <div className="w-8 h-8 bg-brand-green border-2 border-white flex items-center justify-center font-bold text-black text-sm">
                 E
               </div>
             )}
             <button
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               className="p-2 hover:bg-gray-800 transition-colors rounded"
             >
               {sidebarCollapsed ? (
                 <ChevronRight className="w-5 h-5 text-white" />
               ) : (
                 <ChevronLeft className="w-5 h-5 text-white" />
               )}
             </button>
           </div>
         </div>

         {/* Navigation */}
         <nav className="flex-1 p-4">
           <ul className={`space-y-3 ${sidebarCollapsed ? 'space-y-4' : 'space-y-2'}`}>
             {navigation.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <li key={item.name}>
                   <Link
                     href={item.href}
                     className={`flex items-center rounded-lg transition-all duration-200 group ${
                       isActive
                         ? 'bg-brand-green text-black font-bold shadow-lg'
                         : 'text-white hover:bg-gray-800 hover:shadow-md'
                     } ${sidebarCollapsed ? 'justify-center px-4 py-4' : 'px-3 py-3'}`}
                   >
                     <item.icon className={`${sidebarCollapsed ? 'w-7 h-7' : 'w-6 h-6'} ${sidebarCollapsed ? '' : 'mr-3'}`} />
                     {!sidebarCollapsed && (
                       <span className="font-bold uppercase tracking-wider text-sm">
                         {item.name}
                       </span>
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
           {sidebarCollapsed && (
             <div className="mb-3 flex justify-center">
               <div className="w-8 h-8 bg-gray-700 border-2 border-gray-600 flex items-center justify-center font-bold text-white text-xs rounded-full">
                 {user?.username?.charAt(0).toUpperCase() || 'A'}
               </div>
             </div>
           )}
           <button
             onClick={handleLogout}
             className={`flex items-center w-full text-red-400 hover:bg-gray-800 transition-all duration-200 rounded-lg ${
               sidebarCollapsed ? 'justify-center px-4 py-4' : 'px-3 py-2'
             }`}
           >
             <LogOut className={`${sidebarCollapsed ? 'w-7 h-7' : 'w-5 h-5'} ${sidebarCollapsed ? '' : 'mr-3'}`} />
             {!sidebarCollapsed && (
               <span className="text-sm font-bold uppercase tracking-wider">
                 Logout
               </span>
             )}
           </button>
         </div>
      </div>

       {/* Main Content */}
       <div className={`flex-1 flex flex-col transition-all duration-300 ${
         sidebarCollapsed ? 'ml-20' : 'ml-64'
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
                  <User className="w-6 h-6" />
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
