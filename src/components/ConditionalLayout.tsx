"use client";
import { usePathname } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <>
      <NavBar />
      <main className="pt-16 sm:pt-20">{children}</main>
      <Footer />
    </>
  );
}
