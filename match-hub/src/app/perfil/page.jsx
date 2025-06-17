'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
    // Seções
    const sections = [
        { key: 'perfil', label: 'Perfil', iconClass: 'fa-solid fa-user' },
        { key: 'seguranca', label: 'Segurança', iconClass: 'fa-solid fa-lock' },
        { key: 'configuracoes', label: 'Configurações', iconClass: 'fa-solid fa-cog' },
        { key: 'ajuda', label: 'Ajuda', iconClass: 'fa-solid fa-circle-question' },
    ];
    const [activeSection, setActiveSection] = useState('perfil');

    // Mockup dos dados
    const userMock = {
        name: 'João Silva',
        email: 'joaosilva@gmail.com',
        age: 25,
        memberSince: '17 de junho de 2025',
        avatarUrl: '/static/img/index/card1.jpg',
        devices: [
            { id: 1, name: 'Notebook - Chrome', lastActive: '2025-06-10' },
            { id: 2, name: 'Xiaomi 14 - Chrome', lastActive: '2025-06-08' },
        ],
    };

    // Função pra renderizar conteúdo conforme a seção
    function renderSection() {
        switch (activeSection) {
            case 'perfil':
                return (
                    <div>
                        <h2 className="text-azul mb-3">Meu Perfil</h2>
                        <div className="card mb-4" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div style={{ width: '80px', height: '80px', position: 'relative', marginRight: '1rem' }}>
                                        <Image
                                            src={userMock.avatarUrl}
                                            alt="Avatar"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-circle"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white"><strong>Nome:</strong> {userMock.name}</p>
                                        <p className="text-white"><strong>E-mail:</strong> {userMock.email}</p>
                                    </div>
                                </div>
                                <h5 className="card-title text-white mb-3">Detalhes</h5>
                                <p className='text-white'><strong>Idade:</strong> {userMock.age}</p>
                                <p className='text-white'><strong>Membro desde:</strong> {userMock.memberSince}</p>
                                <button className="btn btn-outline-primary">Gerenciar conta</button>
                            </div>
                        </div>
                    </div>
                );
            case 'seguranca':
                return (
                    <div>
                        <h2 className="text-azul mb-3">Segurança</h2>
                        <div className="card mb-3" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body text-white">
                                <p><strong>Senha:</strong> ••••••••</p>
                                <button className="btn btn-outline-primary">Trocar senha</button>
                            </div>
                        </div>
                        <div className="card" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body text-white">
                                <h5>Autenticação de dois fatores</h5>
                                <p>Status: Desabilitado</p>
                                <button className="btn btn-outline-primary">Habilitar 2FA</button>
                            </div>
                        </div>
                        <h2 className="text-azul mt-4">Dispositivos</h2>
                        <div className="list-group" style={{ backgroundColor: 'var(--cor-bgEscuro)' }}>
                            {userMock.devices.map(device => (
                                <div key={device.id} className="list-group-item" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none', borderBottom: '1px solid var(--cor-cinzaEscuro)' }}>
                                    <div className="d-flex justify-content-between">
                                        <div className='text-white'>
                                            <strong>{device.name}</strong>
                                            <div className="text-cinzaTexto" style={{ fontSize: '0.9rem' }}>Último login: {device.lastActive}</div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-danger">Sair no dispositivo</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'configuracoes':
                return (
                    <div>
                        <h2 className="text-azul mb-3">Configurações</h2>
                        <div className="card mb-3" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body text-white">
                                <div className="d-flex justify-content-between">
                                    <p>Habilitar V-Libras</p>
                                    <button className="btn btn-outline-primary">Ativar</button>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body text-white">
                                <div className="d-flex justify-content-between">
                                    <p>Modo claro <i className="fa-solid fa-sun"></i></p>
                                    <button className="btn btn-outline-primary">Ativar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'ajuda':
                return (
                    <div>
                        <h2 className="text-azul mb-3">Ajuda</h2>
                        <div className="card mb-3" style={{ backgroundColor: 'var(--cor-bgEscuro)', border: 'none' }}>
                            <div className="card-body text-white">
                                <p>Para receber suporte entre em contato com a nossa equipe ou verifique nossa documentação disponível na página Sobre</p>
                                <button className="btn btn-outline-primary me-2">Entrar em contato</button>
                                <button className="btn btn-outline-secondary">Página Sobre</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="container">

            <div className="profile-page d-flex flex-column flex-md-row">
                <link rel="stylesheet" href="/css/perfil.css" />
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


                <div className="flex-grow-1">
                    {/* Nav tabs mobile */}
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
