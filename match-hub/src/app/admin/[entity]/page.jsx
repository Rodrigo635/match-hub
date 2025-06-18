// src/app/admin/[entity]/page.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminEntityPage({ params }) {
  const { entity } = params;
  const allowed = ['user','game','championship','team','matches','matches_teams'];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Seção inválida</h1>
        <p className="text-white">"{entity}" não existe.</p>
      </div>
    );
  }
  // mock de dados; em produção, buscar via API
  let items = [];
  let columns = [];
  switch (entity) {
    case 'user':
      items = [
        { id: 1, name: 'Pedro', email: 'pedro@example.com', born: '1990-01-15', date_creation: '2025-01-10' },
        { id: 2, name: 'Bob', email: 'bob@example.com', born: '1985-05-20', date_creation: '2025-02-05' },
      ];
      columns = ['ID','Nome','E-mail','Data de Nascimento','Data de Criação'];
      break;
    case 'game':
      items = [
        { id: 1, name: 'Game A', tournament: 'Torneio X', image: '/static/img/game-placeholder.png', video: 'N/A', gif: 'N/A', description: 'Descrição jogo A', tags: 'Action, FPS', release: '2024-06-01', genre: 'FPS', developer: 'Dev Studio', publisher: 'Pub Co', age_rating: '16+', date_creation: '2025-03-12' },
        { id: 2, name: 'Game B', tournament: 'Torneio Y', image: '/static/img/game-placeholder.png', video: 'N/A', gif: 'N/A', description: 'Descrição jogo B', tags: 'MOBA', release: '2023-11-20', genre: 'MOBA', developer: 'Another Dev', publisher: 'Another Pub', age_rating: '12+', date_creation: '2025-04-08' },
      ];
      columns = ['ID','Nome','Torneios','Imagem','Descrição','Tags','Lançamento','Genero','Desenvolvedora','Distribuidora','PEGI','Data de Criação'];
      break;
    case 'championship':
      items = [
        { id: 1, name: 'Championship 1', image_championship: '/static/img/champ-placeholder.png', date_creation: '2025-03-01' },
        { id: 2, name: 'Championship 2', image_championship: '/static/img/champ-placeholder.png', date_creation: '2025-04-15' },
      ];
      columns = ['ID','Nome','Imagem','Data de Criação'];
      break;
    case 'team':
      items = [
        { id: 1, name: 'Team Alpha', logo: '/static/img/team-placeholder.png', date_creation: '2025-02-20' },
        { id: 2, name: 'Team Beta', logo: '/static/img/team-placeholder.png', date_creation: '2025-03-10' },
      ];
      columns = ['ID','Nome','Logo','Data de Criação'];
      break;
    case 'matches':
      items = [
        { id: 1, data: '2025-06-20', horario: '18:00', link: 'http://example.com/match/1', id_championship: 1, date_creation: '2025-05-30' },
        { id: 2, data: '2025-06-22', horario: '20:00', link: 'http://example.com/match/2', id_championship: 2, date_creation: '2025-06-01' },
      ];
      columns = ['ID','Data','Horário','Link','ID do Campeonato','Data de Criação'];
      break;
    case 'matches_teams':
      items = [
        { id: 1, id_matches: 1, id_teams: 1 },
        { id: 2, id_matches: 1, id_teams: 2 },
      ];
      columns = ['ID','ID da Partida','ID do Time'];
      break;
  }

  const title = entity.charAt(0).toUpperCase() + entity.slice(1).replace('_',' ');

  return (
    <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-azul mb-3">{title}</h1>
            <div className="d-flex justify-content-end mb-3">
                <Link href={`/admin/${entity}/create`} className="btn btn-primary">
                Novo {title} <i className="fa-solid fa-plus"></i>
                </Link>
            </div>
        </div>
      <div className="table-responsive">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              {columns.map(col => <th key={col}>{col}</th>)}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                {entity==='user' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.born}</td>
                    <td>{item.date_creation}</td>
                  </>
                )}
                {entity==='game' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.tournament}</td>
                    <td>
                      <div style={{ width:'40px', height:'40px', position:'relative' }}>
                        <Image src={item.image} alt={item.name} fill style={{objectFit:'cover'}} className="rounded"/>
                      </div>
                    </td>
                    <td style={{ maxWidth:'150px' }} className="texto-justificado">{item.description}</td>
                    <td>{item.tags}</td>
                    <td>{item.release}</td>
                    <td>{item.genre}</td>
                    <td>{item.developer}</td>
                    <td>{item.publisher}</td>
                    <td>{item.age_rating}</td>
                    <td>{item.date_creation}</td>
                  </>
                )}
                {entity==='championship' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <div style={{ width:'40px', height:'40px', position:'relative' }}>
                        <Image src={item.image_championship} alt={item.name} fill style={{objectFit:'cover'}} className="rounded"/>
                      </div>
                    </td>
                    <td>{item.date_creation}</td>
                  </>
                )}
                {entity==='team' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <div style={{ width:'40px', height:'40px', position:'relative' }}>
                        <Image src={item.logo} alt={item.name} fill style={{objectFit:'cover'}} className="rounded"/>
                      </div>
                    </td>
                    <td>{item.date_creation}</td>
                  </>
                )}
                {entity==='matches' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.data}</td>
                    <td>{item.horario}</td>
                    <td>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-azul">Ver</a>
                    </td>
                    <td>{item.id_championship}</td>
                    <td>{item.date_creation}</td>
                  </>
                )}
                {entity==='matches_teams' && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.id_matches}</td>
                    <td>{item.id_teams}</td>
                  </>
                )}
                <td>
                  <Link href={`/admin/${entity}/${item.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                    Editar <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <button className="btn btn-sm btn-outline-danger">
                    Deletar <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
