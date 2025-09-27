"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import AnalyticsTab from "@/components/admin/AnalyticsTab";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AnalyticsTab />
      </AdminLayout>
    </ProtectedRoute>
  );
}
