'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const MOCK = [
  { id: 'g-valorant', type: 'game', title: 'Valorant', subtitle: 'Champions' },
  { id: 'c-vct-americas', type: 'championship', title: 'VCT Americas', subtitle: 'Liga Oficial' },
  { id: 't-mibr', type: 'team', title: 'MIBR', subtitle: 'Equipe' },
];

export default function Notificacoes({ user }) {
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    // simula fetch de backend
    const t = setTimeout(() => {
      setNotifs(MOCK);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  function handleRemove(id) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  function handleClearAll() {
    if (!confirm('Desligar todas as notificações?')) return;
    setNotifs([]);
  }

  return (
    <section className="notif-page py-5">
      <link rel="stylesheet" href="/css/notifications.css" />
      <div className="container pb-5">
        <div className="row d-flex justify-content-between align-items-center mb-4">
          <div className="col-12 col-md-6">
            <h1 className="fw-bold">Notificações ativadas</h1>
            <p className="text-white mb-0">Aqui você gerencia as notificações do que deseja acompanhar.</p>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-start justify-content-md-end mt-3 mt-md-0">
            <button className="btn btn-danger" onClick={handleClearAll} disabled={notifs.length === 0 || loading}>
              <i className="fas fa-xmark me-2"></i>Desligar todas
            </button>
          </div>
        </div>

        {loading && (
          <div className="row g-3">
            {[1,2,3].map(i => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="notif-skeleton p-3 rounded-3" />
              </div>
            ))}
          </div>
        )}

        {!loading && notifs.length === 0 && (
          <div className="empty-state p-4 rounded-3 text-center border border-muted">
            <div className="mb-3"><i className="fas fa-bell-slash fs-1"></i></div>
            <h4 className="mb-1">Nenhuma notificação ligada</h4>
            <p className="text-white mb-0">Ative notificações nas páginas de jogos, campeonatos ou times para vê-las aqui.</p>
          </div>
        )}

        {!loading && notifs.length > 0 && (
          <div className="row g-3">
            {notifs.map(n => (
              <div key={n.id} className="col-12">
                <div className="notification-card border border-muted shadow d-flex align-items-center p-3 rounded-3">

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <h5 className="mb-1 notif-title">{n.title}</h5>
                        {n.subtitle && <div className="text-white small">{n.subtitle}</div>}
                      </div>

                      <div className="ms-3 align-self-center">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleRemove(n.id)}
                          aria-label={`Desligar notificações de ${n.title}`}
                        >
                          <i className="fas fa-xmark me-2"></i>Desligar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

