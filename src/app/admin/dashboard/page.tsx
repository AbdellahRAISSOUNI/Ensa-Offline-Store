"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import DashboardTab from "@/components/admin/DashboardTab";

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <DashboardTab />
      </AdminLayout>
    </ProtectedRoute>
  );
}
