// src/app/admin/[entity]/create/page.jsx
import Head from 'next/head';
import AdminCreateForm from '@/components/AdminCreateForm';

export default function CreateEntityPage({ params }) {
  const { entity } = params;
  const allowed = ['user', 'game', 'championship', 'team', 'matches', 'matches_teams'];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Entidade inválida</h1>
        <p className="text-white">A entidade "{entity}" não é suportada para criação.</p>
      </div>
    );
  }
  // Formata título: ex.: "matches_teams" -> "Matches Teams"
  const title = entity.charAt(0).toUpperCase() + entity.slice(1).replace('_', ' ');

  return (
    <>
      <Head>
        <title>Criar {title} - Admin</title>
      </Head>
      {/* A estrutura de sidebar + conteúdo está sendo fornecida pelo AdminLayout */}
      <h1 className="text-azul mb-4">Criar {title}</h1>
      <AdminCreateForm entity={entity} />
    </>
  );
}
