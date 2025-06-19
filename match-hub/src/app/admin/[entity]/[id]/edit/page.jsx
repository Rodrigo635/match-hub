// src/app/admin/[entity]/[id]/edit/page.jsx
'use client';
import React from 'react';
import Head from 'next/head';
import AdminCreateForm from '@/components/AdminCreateForm';

export default function EditEntityPage({ params }) {
  const { entity, id } = React.use(params);
  const allowed = ['user', 'game', 'championship', 'team', 'matches'];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Entidade inválida</h1>
        <p className="text-white">A entidade "{entity}" não é suportada para edição.</p>
      </div>
    );
  }
  const title = entity.charAt(0).toUpperCase() + entity.slice(1).replace('_', ' ');
  return (
    <>
      <Head>
        <title>Editar {title} - Admin</title>
      </Head>
      <div className="container py-4">
        <h1 className="text-azul mb-4">Editar {title}</h1>
        <AdminCreateForm entity={entity} id={id} />
      </div>
    </>
  );
}
