// src/app/admin/layout.jsx
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="container py-4">
      <div className="profile-page d-flex flex-column flex-md-row">
        <aside className="profile-sidebar d-none d-md-block col-md-3 col-lg-2">
          <AdminSidebar />
        </aside>
        <div className="flex-grow-1 ps-md-4">
          {children}
        </div>
      </div>
    </div>
  );
}
