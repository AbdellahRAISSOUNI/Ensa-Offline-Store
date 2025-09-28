"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrutalistLoader } from "@/components/ui/BrutalistLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <BrutalistLoader size="lg" text="Loading..." variant="blocks" />
    </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
