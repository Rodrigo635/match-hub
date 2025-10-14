'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { getUsers, deleteUser, getUserByToken } from '@/services/userService';
import { getGames, deleteGame } from '@/services/gameService';
import { getChampionships, deleteChampionship } from '@/services/championshipService';
import { getTeams, deleteTeam } from '@/services/teamService';
import { getMatches, deleteMatch } from '@/services/matchService';
import { handleGetUser } from '@/app/global/global';
import { useUser } from '@/context/UserContext';

export default function AdminEntityPage() {
  const router = useRouter();
  const { User } = useUser();
  const searchParams = useSearchParams();
  const params = useParams();

  const entity = params.entity;

  // Estados para dados
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [teams, setTeams] = useState([]);
  const [match, setMatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState([]);

  // Estados para paginação
  const [pagination, setPagination] = useState({
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  });

  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pega parâmetros da URL para paginação
  const currentPage = parseInt(searchParams.get('page')) || 0;
  const pageSize = parseInt(searchParams.get('size')) || 10;

  const allowed = ['user', 'game', 'championship', 'team', 'match'];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Seção inválida</h1>
        <p className="text-white">"{entity}" não existe.</p>
      </div>
    );
  }

  useEffect(() => {
    async function fetchUser() {
      const user = await handleGetUser({ setToken, setUser });
      if (!user) {
        router.push('/cadastro');
        return;
      }

      if (user.role !== 'ADMIN') {
        router.push('/perfil');
        return;
      }

      setUser(user);
    }

    fetchUser();
  }, []);

  // Função para navegar para página específica
  const goToPage = page => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    params.set('size', pageSize.toString());
    router.push(`/admin/${entity}?${params.toString()}`);
  };

  // Função para mudar tamanho da página
  const changePageSize = newSize => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '0'); // Reset para primeira página
    params.set('size', newSize.toString());
    router.push(`/admin/${entity}?${params.toString()}`);
  };

  // Atualizado para buscar com paginação
  useEffect(() => {
    setError(null);
    setLoading(true);

    const updateData = data => {
      if (data && data.content) {
        setPagination(data.page);
        return data.content;
      }
      const fallbackData = Array.isArray(data) ? data : [];
      setPagination({
        number: 0,
        size: fallbackData.length,
        totalElements: fallbackData.length,
        totalPages: 1,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false,
      });
      return fallbackData;
    };

    const fetchData = (getFunc, setFunc) => {
      // A chamada agora passa apenas os parâmetros de paginação
      getFunc(currentPage, pageSize, user.token)
        .then(data => {
          const content = updateData(data);
          setFunc(content);
        })
        .catch(err => {
          console.error(`Erro ao carregar ${entity}:`, err);
          setError(`Erro ao carregar ${entity}`);
        })
        .finally(() => setLoading(false));
    };

    if (entity === 'user') {
      fetchData(getUsers, setUsers);
    } else if (entity === 'game') {
      fetchData(getGames, setGames);
    } else if (entity === 'championship') {
      fetchData(getChampionships, setChampionships);
    } else if (entity === 'team') {
      fetchData(getTeams, setTeams);
    } else if (entity === 'match') {
      fetchData(getMatches, setMatch);
    } else {
      setLoading(false);
    }
  }, [entity, currentPage, pageSize]);

  let items = [];
  let columns = [];

  switch (entity) {
    case 'user':
      items = users;
      columns = ['ID', 'Nome', 'E-mail', 'Role', 'Data de Nascimento', 'Data de Criação', 'Ações'];
      break;
    case 'game':
      items = games;
      columns = [
        'ID', 'Nome', 'Torneio', 'Imagem', 'Descrição', 'Tags', 'Lançamento', 'Gênero',
        'Desenvolvedora', 'Distribuidora', 'PEGI', 'Data de Criação', 'Ações',
      ];
      break;
    case 'championship':
      items = championships;
      columns = ['ID', 'Nome', 'Imagem', 'Descrição', 'Data de Criação', 'Ações'];
      break;
    case 'team':
      items = teams;
      columns = ['ID', 'Nome', 'Descrição', 'Logo', 'Data de Criação', 'Ações'];
      break;
    case 'match':
      items = match;
      columns = [
        'ID', 'Data', 'Horário', 'Link', 'ID do Campeonato', 'Data de Criação',
        'Time 1', 'Time 2', 'Ações',
      ];
      break;
  }

  const title = entity.charAt(0).toUpperCase() + entity.slice(1).replace('_', ' ');

  const handleDelete = async id => {
    if (!confirm('Confirma exclusão?')) return;
    try {
      if (entity === 'user') {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } else if (entity === 'game') {
        await deleteGame(id);
        setGames(prev => prev.filter(g => g.id !== id));
      } else if (entity === 'championship') {
        await deleteChampionship(id);
        setChampionships(prev => prev.filter(c => c.id !== id));
      } else if (entity === 'team') {
        await deleteTeam(id);
        setTeams(prev => prev.filter(t => t.id !== id));
      } else if (entity === 'match') {
        await deleteMatch(id);
        setMatch(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Falha ao deletar. Veja o console.');
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const normalizeImageSrc = src => {
    if (!src || typeof src !== 'string') return null;
    if (src.startsWith('http') || src.startsWith('/')) {
      return src;
    }
    return `/${src}`;
  };

  const getPageNumbers = () => {
    const { number: currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const renderModalContent = () => {
    if (!selectedItem) return null;
    const imgChamp = normalizeImageSrc(selectedItem.imageChampionship ?? selectedItem.image);
    const imgTeam = normalizeImageSrc(selectedItem.logo);
    switch (entity) {
      case 'user':
        return (
          <>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Nome:</strong> {selectedItem.name ?? selectedItem.username}</p>
            <p><strong>E-mail:</strong> {selectedItem.email}</p>
            <p><strong>Role:</strong> {selectedItem.role ?? '—'}</p>
            <p><strong>Data de Nascimento:</strong> {selectedItem.born ?? selectedItem.birthDate ?? ''}</p>
            <p><strong>Data de Criação:</strong> {selectedItem.createdAt ?? selectedItem.date_creation ?? ''}</p>
          </>
        );
      case 'game':
        return (
          <>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Nome:</strong> {selectedItem.name}</p>
            <p><strong>Torneio:</strong> {typeof selectedItem.tournament === 'object' ? selectedItem.tournament.name : selectedItem.tournament}</p>
            {selectedItem.image && (<div className="text-center mb-3"><Image src={selectedItem.image} alt={selectedItem.name} width={200} height={200} style={{ objectFit: 'cover' }} className="rounded" /></div>)}
            <p><strong>Descrição:</strong> {selectedItem.description ?? ''}</p>
            <p><strong>Tags:</strong> {Array.isArray(selectedItem.tags) ? selectedItem.tags.join(', ') : selectedItem.tags}</p>
            <p><strong>Lançamento:</strong> {selectedItem.release}</p>
            <p><strong>Gênero:</strong> {selectedItem.genre}</p>
            <p><strong>Desenvolvedora:</strong> {selectedItem.developer}</p>
            <p><strong>Distribuidora:</strong> {selectedItem.publisher}</p>
            <p><strong>PEGI:</strong> {selectedItem.ageRating}</p>
            <p><strong>Data de Criação:</strong> {new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
          </>
        );
      case 'championship':
        return (
          <>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Nome:</strong> {selectedItem.name}</p>
            {imgChamp && (<div className="text-center mb-3"><Image src={imgChamp} alt={selectedItem.name} width={200} height={200} style={{ objectFit: 'cover' }} className="rounded" /></div>)}
            <p><strong>Descrição:</strong> {selectedItem.description ?? ''}</p>
            <p><strong>Data de Criação:</strong> {selectedItem.date_creation ?? selectedItem.createdAt}</p>
          </>
        );
      case 'team':
        return (
          <>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Nome:</strong> {selectedItem.name}</p>
            <p><strong>Descrição:</strong> {selectedItem.description ?? ''}</p>
            {imgTeam && (<div className="text-center mb-3"><Image src={imgTeam} alt={selectedItem.name} width={200} height={200} style={{ objectFit: 'cover' }} className="rounded" /></div>)}
            <p><strong>Data de Criação:</strong> {selectedItem.date_creation ?? selectedItem.createdAt}</p>
          </>
        );
      case 'match':
        return (
          <>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Data:</strong> {selectedItem.date ?? selectedItem.date}</p>
            <p><strong>Horário:</strong> {selectedItem.hour ?? selectedItem.time}</p>
            <p><strong>Link:</strong> {selectedItem.link ? <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">Ver Link</a> : '—'}</p>
            <p><strong>ID do Campeonato:</strong> {selectedItem.championshipId ?? selectedItem.championship?.id}</p>
            <p><strong>Data de Criação:</strong> {selectedItem.createdAt}</p>
            <p><strong>Time 1:</strong> {selectedItem.matchTeams[0].team.name}</p>
            <p><strong>Time 2:</strong> {selectedItem.matchTeams[1].team.name}</p>
          </>
        );
      default:
        return null;
    }
  };

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

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label className="form-label me-2 mb-0 text-white">Registros por página:</label>
            <select
              value={pageSize}
              onChange={e => changePageSize(parseInt(e.target.value))}
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <small className="text-white">
            Mostrando {items.length} de {pagination.totalElements} registros
          </small>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-white mt-2">Carregando...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="alert alert-info">Nenhum {title.toLowerCase()} encontrado.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-dark table-striped table-sm align-middle">
              <thead>
                <tr>
                  {columns.map(col => (<th key={col}>{col}</th>))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const imgChamp = normalizeImageSrc(item.imageChampionship ?? item.image);
                  const imgTeam = normalizeImageSrc(item.logo);
                  const description = item.description ?? '';
                  return (
                    <tr key={item.id}>
                      {entity === 'user' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.name ?? item.username}</td>
                          <td>{item.email}</td>
                          <td>{item.role ?? '—'}</td>
                          <td>{item.born ?? item.birthDate ?? ''}</td>
                          <td>{item.createdAt ?? item.date_creation ?? ''}</td>
                        </>
                      )}
                      {entity === 'game' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{typeof item.tournament === 'object' ? item.tournament.name : item.tournament}</td>
                          <td>{item.image ? (<div style={{ width: '40px', height: '40px', position: 'relative' }}><Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded" /></div>) : (<span>—</span>)}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description.substring(0, 100)}{description.length > 100 && '...'}</td>
                          <td>{Array.isArray(item.tags) ? item.tags.join(', ') : item.tags}</td>
                          <td>{item.release}</td>
                          <td>{item.genre}</td>
                          <td>{item.developer}</td>
                          <td>{item.publisher}</td>
                          <td>{item.ageRating}</td>
                          <td>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                        </>
                      )}
                      {entity === 'championship' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{imgChamp ? (<div style={{ width: '40px', height: '40px', position: 'relative' }}><Image src={imgChamp} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded" /></div>) : (<span>—</span>)}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description.substring(0, 100)}{description.length > 100 && '...'}</td>
                          <td>{item.date_creation ?? item.createdAt}</td>
                        </>
                      )}
                      {entity === 'team' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description.substring(0, 100)}{description.length > 100 && '...'}</td>
                          <td>{imgTeam ? (<div style={{ width: '40px', height: '40px', position: 'relative' }}><Image src={imgTeam} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded" /></div>) : (<span>—</span>)}</td>
                          <td>{item.date_creation ?? item.createdAt}</td>
                        </>
                      )}
                      {entity === 'match' && (
                        <>
                          <td>{item.id}</td>
                          <td>{item.date ?? item.date}</td>
                          <td>{item.hour ?? item.time}</td>
                          <td>{item.link ? (<a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">Ver</a>) : (<span>—</span>)}</td>
                          <td>{item.championshipId ?? item.championship?.id}</td>
                          <td>{item.createdAt}</td>
                          <td>{item.matchTeams[0].team.name}</td>
                          <td>{item.matchTeams[1].team.name}</td>
                        </>
                      )}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleView(item)} className="btn btn-sm btn-outline-info me-1">Ver <i className="fa-solid fa-eye"></i></button>
                        <Link href={`/admin/${entity}/${item.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></Link>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <nav aria-label="Navegação de páginas">
              <div className="row align-items-center mt-4">
                <div className="col-md-6">
                  <small className="text-white">Página {pagination.number + 1} de {pagination.totalPages} ({pagination.totalElements} registros no total)</small>
                </div>
                <div className="col-md-6">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}><button className="page-link" onClick={() => goToPage(0)} disabled={!pagination.hasPrevious}>««</button></li>
                    <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}><button className="page-link" onClick={() => goToPage(pagination.number - 1)} disabled={!pagination.hasPrevious}>‹</button></li>
                    {getPageNumbers().map(pageNum => (
                      <li key={pageNum} className={`page-item ${pageNum === pagination.number ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(pageNum)}>{pageNum + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}><button className="page-link" onClick={() => goToPage(pagination.number + 1)} disabled={!pagination.hasNext}>›</button></li>
                    <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}><button className="page-link" onClick={() => goToPage(pagination.totalPages - 1)} disabled={!pagination.hasNext}>»»</button></li>
                  </ul>
                </div>
              </div>
            </nav>
          )}
        </>
      )}

      {showModal && selectedItem && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setShowModal(false)}></div>
          <div className="modal fade show" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalhes de {title}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">{renderModalContent()}</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}