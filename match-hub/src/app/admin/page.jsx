// src/app/admin/page.jsx
import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // ao acessar /admin, redireciona para /admin/user
  redirect('/admin/user');
}
