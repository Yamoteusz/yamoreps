import { redirect } from 'next/navigation';
import { isAuthed } from '@/lib/auth';
import { getAllProducts } from '@/lib/products';
import AdminDashboard from './AdminDashboard';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  const products = await getAllProducts();
  return <AdminDashboard initialProducts={products} />;
}
