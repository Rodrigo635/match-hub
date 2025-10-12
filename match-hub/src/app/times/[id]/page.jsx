"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getTeamById } from '../../../services/teamService';
import { getMatchesByTeam } from '../../../services/matchService';

export default function TeamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    Promise.all([
      getTeamById(id),
      getMatchesByTeam(id, 0, 10) // pagina 0, até 10 partidas
    ])
      .then(([teamRes, matchesRes]) => {
        if (!mounted) return;
        setTeam(teamRes);
        setMatches(matchesRes.content || []); // a API retorna content, totalPages, etc
      })
      .catch(err => {
        console.error('Erro ao buscar time ou partidas:', err);
        router.push('/');
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id, router]);

  const handleBack = () => router.back();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
        <div className="text-white text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando time...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container py-5 text-center text-white">
        <h3>Time não encontrado</h3>
        <button type="button" className="btn btn-primary mt-3" onClick={() => router.push('/')}>Voltar</button>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="/css/championship.css" />

      <section className="championship-header bg-dark time-bg py-5">
        <div className="container">
          <div className="col-12 d-flex justify-content-start gap-2 mb-4 mt-5">
            <button type="button" onClick={handleBack} className="btn btn-voltar text-white">
              <h5 className="mb-0 ms-2"><i className="fa-solid fa-arrow-left me-2"/> Voltar</h5>
            </button>
            <button type="button" className="btn btn-outline-branco w-auto text-white">
              <h5 className="mb-0 ms-2"><i className="fa-solid fa-bell me-2"/> Ativar Notificações</h5>
            </button>
          </div>

          <div className="row align-items-center">

            <div className="col-md-9">
              <h1 className="display-4 fw-bold text-white mb-3">{team.name}</h1>

              {team.description && (
                <p className="lead text-light mb-4">{team.description}</p>
              )}

              <div className="row text-white">
                <div className="mb-2">
                  <i className="fas fa-calendar me-2 text-primary"></i>
                  <span className="fw-bold">Partidas cadastradas:</span> {matches.length}
                </div>
                <div>
                  <i className="fas fa-user-friends me-2 text-primary"></i>
                  <span className="fw-bold">País / Tag:</span> {team.country || team.tag || '—'}
                </div>
              </div>
            </div>

            <div className="col-md-3 text-center mb-4 mb-md-0 order-first order-md-last">
              {team.logo && (
                <div style={{ width: 150, height: 150, position: 'relative', margin: '0 auto' }}>
                  <Image src={team.logo} alt={team.name} fill style={{ objectFit: 'contain' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="py-5" style={{ backgroundColor: '#1a1a1a', minHeight: '60vh' }}>
        <div className="container">
          <h2 className="text-white mb-4">Partidas do time</h2>

          {matches.length > 0 ? (
            <div className="row g-4">
              {matches.map((match, idx) => {
                const tA = match.matchTeams?.[0]?.team || {};
                const tB = match.matchTeams?.[1]?.team || {};
                const data = match.date ? new Date(match.date).toLocaleDateString('pt-BR') : '';
                const hora = match.hour ? match.hour.substring(0, 5) : '';

                return (
                  <div key={match.id || idx} className="col-12 col-md-6 col-lg-4">
                    <div className="card bg-dark text-white h-100 border-0 shadow">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="text-center">
                            {tA.logo && (
                              <div style={{ width: 60, height: 60, position: 'relative', margin: '0 auto' }}>
                                <Image src={tA.logo} alt={tA.name} fill style={{ objectFit: 'contain' }} />
                              </div>
                            )}
                            <small className="d-block mt-2">{tA.name}</small>
                          </div>

                          <div className="text-primary fw-bold fs-3">VS</div>

                          <div className="text-center">
                            {tB.logo && (
                              <div style={{ width: 60, height: 60, position: 'relative', margin: '0 auto' }}>
                                <Image src={tB.logo} alt={tB.name} fill style={{ objectFit: 'contain' }} />
                              </div>
                            )}
                            <small className="d-block mt-2">{tB.name}</small>
                          </div>
                        </div>

                        <hr className="bg-secondary" />

                        <div className="text-center">
                          <p className="mb-1">
                            <i className="fas fa-calendar me-2 text-primary"></i>
                            {data}
                          </p>
                          <p className="mb-3">
                            <i className="fas fa-clock me-2 text-primary"></i>
                            {hora}
                          </p>

                          {match.link && (
                            <a href={match.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm w-100">
                              <i className="fas fa-external-link-alt me-2"></i>
                              Ver Detalhes
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-white">Nenhuma partida encontrada para este time.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
