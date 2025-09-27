"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";
import SettingsTab from "@/components/admin/SettingsTab";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <SettingsTab />
      </AdminLayout>
    </ProtectedRoute>
  );
}
