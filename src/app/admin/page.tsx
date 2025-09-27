import { redirect } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
