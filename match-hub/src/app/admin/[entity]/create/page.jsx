// src/app/admin/[entity]/create/page.jsx
import Head from 'next/head';
import AdminCreateForm from '@/components/AdminCreateForm';
import React from 'react';

export default function CreateEntityPage({ params }) {
  const { entity } = React.use(params);
  const allowed = ['user', 'game', 'championship', 'team', 'matches', 'matches_teams'];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Entidade inválida</h1>
        <p className="text-white">A entidade "{entity}" não é suportada para criação.</p>
      </div>
    );
  }
  const title = entity.charAt(0).toUpperCase() + entity.slice(1).replace('_', ' ');
  return (
    <>
      <Head>
        <title>Criar {title} - Admin</title>
      </Head>
      <div className="container py-4">
        <h1 className="text-azul mb-4">Criar {title}</h1>
        <AdminCreateForm entity={entity} />
      </div>
    </>
  );
}
