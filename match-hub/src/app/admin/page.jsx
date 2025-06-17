'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminPage() {
    // Seções
    const sections = [
        { key: 'user', label: 'Usuários', iconClass: 'fa-solid fa-user' },
        { key: 'game', label: 'Jogos', iconClass: 'fa-solid fa-gamepad' },
        { key: 'championship', label: 'Campeonatos', iconClass: 'fa-solid fa-trophy' },
        { key: 'team', label: 'Times', iconClass: 'fa-solid fa-users' },
        { key: 'matches', label: 'Partidas', iconClass: 'fa-solid fa-calendar-days' },
        { key: 'matches_teams', label: 'Partidas de Times', iconClass: 'fa-solid fa-link' },
    ];
    const [activeSection, setActiveSection] = useState('user');

    // Mockup dos dados
    const usersMock = [
        { id: 1, name: 'Pedro', email: 'pedro@example.com', born: '1990-01-15', date_creation: '2025-01-10' },
        { id: 2, name: 'Bob', email: 'bob@example.com', born: '1985-05-20', date_creation: '2025-02-05' },
    ];
    const gamesMock = [
        { id: 1, name: 'Game A', tournament: 'Torneio X', image: '/static/img/game-placeholder.png', video: 'N/A', gif: 'N/A', description: 'Descrição jogo A', tags: 'Action, FPS', release: '2024-06-01', genre: 'FPS', developer: 'Dev Studio', publisher: 'Pub Co', age_rating: '16+', date_creation: '2025-03-12' },
        { id: 2, name: 'Game B', tournament: 'Torneio Y', image: '/static/img/game-placeholder.png', video: 'N/A', gif: 'N/A', description: 'Descrição jogo B', tags: 'MOBA', release: '2023-11-20', genre: 'MOBA', developer: 'Another Dev', publisher: 'Another Pub', age_rating: '12+', date_creation: '2025-04-08' },
    ];
    const championshipsMock = [
        { id: 1, name: 'Championship 1', image_championship: '/static/img/champ-placeholder.png', date_creation: '2025-03-01' },
        { id: 2, name: 'Championship 2', image_championship: '/static/img/champ-placeholder.png', date_creation: '2025-04-15' },
    ];
    const teamsMock = [
        { id: 1, name: 'Team Alpha', logo: '/static/img/team-placeholder.png', date_creation: '2025-02-20' },
        { id: 2, name: 'Team Beta', logo: '/static/img/team-placeholder.png', date_creation: '2025-03-10' },
    ];
    const matchesMock = [
        { id: 1, data: '2025-06-20', horario: '18:00', link: 'http://example.com/match/1', id_championship: 1, date_creation: '2025-05-30' },
        { id: 2, data: '2025-06-22', horario: '20:00', link: 'http://example.com/match/2', id_championship: 2, date_creation: '2025-06-01' },
    ];
    const matchesTeamsMock = [
        { id: 1, id_matches: 1, id_teams: 1 },
        { id: 2, id_matches: 1, id_teams: 2 },
        { id: 3, id_matches: 2, id_teams: 1 },
        { id: 4, id_matches: 2, id_teams: 2 },
    ];

    // Função pra renderizar as tabelas de cada seção
    function renderSection() {
        switch (activeSection) {
            case 'user':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Usuários</h2>
                            <button className="btn btn-primary">Novo Usuário <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Data de Nascimento</th>
                                        <th>Data de Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersMock.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.born}</td>
                                            <td>{u.date_creation}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'game':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Jogos</h2>
                            <button className="btn btn-primary">Novo Jogo <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Torneios</th>
                                        <th>Imagem</th>
                                        <th>Descrição</th>
                                        <th>Tags</th>
                                        <th>Lançamento</th>
                                        <th>Genero</th>
                                        <th>Desenvolvedora</th>
                                        <th>Distribuidora</th>
                                        <th>PEGI</th>
                                        <th>Data de Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gamesMock.map(g => (
                                        <tr key={g.id}>
                                            <td>{g.id}</td>
                                            <td>{g.name}</td>
                                            <td>{g.tournament}</td>
                                            <td>
                                                <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                                                    <Image src={g.image} alt={g.name} layout="fill" objectFit="cover" className="rounded" />
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '150px' }} className="texto-justificado">{g.description}</td>
                                            <td>{g.tags}</td>
                                            <td>{g.release}</td>
                                            <td>{g.genre}</td>
                                            <td>{g.developer}</td>
                                            <td>{g.publisher}</td>
                                            <td>{g.age_rating}</td>
                                            <td>{g.date_creation}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'championship':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Campeonatos</h2>
                            <button className="btn btn-primary">Novo Campeonato <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Imagem</th>
                                        <th>Data de Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {championshipsMock.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.name}</td>
                                            <td>
                                                <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                                                    <Image src={c.image_championship} alt={c.name} layout="fill" objectFit="cover" className="rounded" />
                                                </div>
                                            </td>
                                            <td>{c.date_creation}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'team':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Times</h2>
                            <button className="btn btn-primary">Novo Time <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Logo</th>
                                        <th>Data de Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamsMock.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.id}</td>
                                            <td>{t.name}</td>
                                            <td>
                                                <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                                                    <Image src={t.logo} alt={t.name} layout="fill" objectFit="cover" className="rounded" />
                                                </div>
                                            </td>
                                            <td>{t.date_creation}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'matches':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Partidas</h2>
                            <button className="btn btn-primary">Nova Partida <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Link</th>
                                        <th>ID do Campeonato</th>
                                        <th>Data de Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchesMock.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.id}</td>
                                            <td>{m.data}</td>
                                            <td>{m.horario}</td>
                                            <td>
                                                <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-azul">
                                                    View
                                                </a>
                                            </td>
                                            <td>{m.id_championship}</td>
                                            <td>{m.date_creation}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'matches_teams':
                return (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="text-azul">Partidas e Times</h2>
                            <button className="btn btn-primary">Nova Pardida de Time <i className="fa-solid fa-plus"></i></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ID da Partida</th>
                                        <th>ID do Time</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchesTeamsMock.map(mt => (
                                        <tr key={mt.id}>
                                            <td>{mt.id}</td>
                                            <td>{mt.id_matches}</td>
                                            <td>{mt.id_teams}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-secondary me-1">Editar <i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn btn-sm btn-outline-danger">Deletar <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/perfil.css" />
            <div className="profile-page d-flex flex-column flex-md-row">

                {/* Sidebar desktop */}
                <aside className="profile-sidebar d-none d-md-block col-md-3 col-lg-2">
                    <nav className="nav flex-column">
                        {sections.map(sec => (
                            <a
                                key={sec.key}
                                href="#"
                                className={`nav-link ${activeSection === sec.key ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); setActiveSection(sec.key); }}
                            >
                                <i className={`${sec.iconClass} me-2`} aria-hidden="true"></i>
                                {sec.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Nav tabs mobile */}
                <div className="flex-grow-1">
                    <nav className="profile-tabs-mobile d-md-none">
                        <ul className="nav nav-tabs nav-fill">
                            {sections.map(sec => (
                                <li className="nav-item" key={sec.key}>
                                    <a
                                        href="#"
                                        className={`nav-link ${activeSection === sec.key ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); setActiveSection(sec.key); }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <i className={`${sec.iconClass} me-1`} aria-hidden="true"></i>
                                        {sec.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Conteúdo principal */}
                    <main className="profile-content">
                        {renderSection()}
                    </main>
                </div>
            </div>
        </div>
    );
}
