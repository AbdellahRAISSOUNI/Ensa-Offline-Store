"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import OrdersTab from "@/components/admin/OrdersTab";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OrdersTab />
      </AdminLayout>
    </ProtectedRoute>
  );
}
