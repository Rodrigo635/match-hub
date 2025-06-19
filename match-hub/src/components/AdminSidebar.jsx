// src/components/AdminSidebar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const sections = [
    { key: 'user', label: 'Usuários', iconClass: 'fa-solid fa-user' },
    { key: 'game', label: 'Jogos', iconClass: 'fa-solid fa-gamepad' },
    { key: 'championship', label: 'Campeonatos', iconClass: 'fa-solid fa-trophy' },
    { key: 'team', label: 'Times', iconClass: 'fa-solid fa-users' },
    { key: 'matches', label: 'Partidas', iconClass: 'fa-solid fa-calendar-days' },
  ];
  const pathname = usePathname() || '';

  return (
    <nav className="nav flex-column">
        <link rel="stylesheet" href="/css/perfil.css" />
      {sections.map(sec => {
        const href = `/admin/${sec.key}`;
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={sec.key} href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
            <i className={`${sec.iconClass} me-2`} aria-hidden="true"></i>
            {sec.label}
          </Link>
        );
      })}
    </nav>
  );
}
