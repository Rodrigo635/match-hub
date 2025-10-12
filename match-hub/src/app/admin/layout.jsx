// src/app/admin/layout.jsx
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="page-admin container py-4">
      <div className="profile-page d-flex flex-column flex-md-row">
        <aside className="profile-sidebar d-none d-md-block col-md-3 col-lg-2">
          <AdminSidebar />
        </aside>
        <div className="profile-content col-12 col-md-9 col-lg-10 pt-3 pt-md-0 ps-0 ps-md-4">
          {children}
        </div>
      </div>
    </div>
  );
}
