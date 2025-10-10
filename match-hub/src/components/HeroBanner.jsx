'use client';
import React, { useState, useEffect } from 'react';

export default function HeroBanner({ videoSrc = '/assets/bg-video.mp4' }) {
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    // Fechar modal com Esc
    function onKey(e) {
      if (e.key === 'Escape') setShowNotify(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="esports-hero" role="banner">
        <link rel="stylesheet" href="/css/hero.css" />
      <video autoPlay muted loop playsInline preload="auto" aria-hidden="true" className="esports-video">
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="esports-overlay" />
      <div className="shape s1" aria-hidden="true" />
      <div className="shape s2" aria-hidden="true" />

      <div className="container esports-content">
        <div className="row align-items-center">
          <div className="col-12 col-lg-12 py-5">
            <h1 className="fw-bold display-1 display-md text-center text-md-start mb-1 mb-md-1 nowrap">Nunca perca uma live!</h1>
            <h1 className="fw-bold display-4 display-md2 text-center text-md-start mt-0 nowrap">Assista ao vivo e na hora certa</h1>
            <p className="plataforma-definitiva text-center text-md-start lead mt-3 col-12 col-md-8">A plataforma definitiva para fãs de e-sports. Notificações em tempo real, calendário completo e links para as lives dos seus jogos favoritos. Tudo num só lugar.</p>

            <div className="d-flex botoes align-items-center justify-content-center justify-content-md-start mt-4">
              <div className="row gap-3 d-flex justify-content-center justify-content-md-start px-2">
                <div className="col-11 col-md px-0">
                  <a href="/sobre" className="btn btn-outline-azul btn-lg"><i className="fas fa-info-circle me-2"></i>Saiba mais</a>

                </div>
                <div className="col-11 col-md px-0">
                  <a href="/calendario" className="btn btn-outline-azul btn-lg"><i className="fas fa-calendar-alt me-2"></i> Calendário</a>
                </div>
                <div className="col-12 col-md-1 px-1 d-none d-md-block">
                  <div className="bell ms-1" title="Ativar notificações" role="button" tabIndex={0} onClick={() => setShowNotify(true)}>
                    <i className="fas fa-bell fa-lg"></i>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-12 col-md-8 mt-4 match-ticker" aria-live="polite">
              <div className="ticker-list" id="tickerList">
                <span className="ticker-item">[18:00] Paris Saint-Germain vs Manchester City — EA SPORTS FC 25 Championship 2025 • Stream</span>
                <span className="ticker-item">[19:30] KT vs T1 — LCK • Stream</span>
                <span className="ticker-item">[20:00] Team Spirit vs Furia — Major 2025 • Stream</span>
                <span className="ticker-item">[18:00] SEN vs MIBR — VCT Americas • Stream</span>
                <span className="ticker-item">[17:00] Ninja vs Bugha — Fortnite World Cup 2025 • Stream</span>
              </div>
            </div>

          </div>

          {/* <div className="col-lg-4 d-flex text-end">
            <div className="col mb-lg-0">
              <div className="ratio ratio-16x9 h-100 video-apresentacao rounded-4">
                <iframe
                  className="rounded-4"
                  src="https://www.youtube.com/embed/FukU9cb_0vw?si=Q91XJmbce7DIdfep"
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {showNotify && (
        <div className="notify-modal" role="dialog" aria-modal="true">
          <div className="notify-backdrop" onClick={() => setShowNotify(false)} />
          <div className="notify-panel py-4">
            <div className="modal-header">
              <h5 className="modal-title"><i className="fas fa-bell me-2"></i>Ativar notificações</h5>
              <button className="btn-close" onClick={() => setShowNotify(false)} aria-label="Fechar" />
            </div>
            <div className="modal-body py-3">
              <p>Na página de qualquer: jogo, campeonato ou time você pode clicar para receber notificações e personalizar para se ajustar aos seus interesses.</p>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => setShowNotify(false)}>Entendi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
