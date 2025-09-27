"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import ProductsTab from "@/components/admin/ProductsTab";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ProductsTab />
      </AdminLayout>
    </ProtectedRoute>
  );
}
