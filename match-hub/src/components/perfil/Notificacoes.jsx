"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Notificacoes({ user }) {
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Formata os dados dos favoritos para o formato de notificações
    const formatNotifications = () => {
      const notifications = [];

      // Adiciona jogos favoritos
      if (user.favoriteGames && user.favoriteGames.length > 0) {
        user.favoriteGames.forEach((game) => {
          notifications.push({
            id: `g-${game.id}`,
            type: "game",
            title: game.name,
            subtitle: game.tournament,
          });
        });
      }

      // Adiciona campeonatos favoritos
      if (user.favoriteChampionships && user.favoriteChampionships.length > 0) {
        user.favoriteChampionships.forEach((championship) => {
          notifications.push({
            id: `c-${championship.id}`,
            type: "championship",
            title: championship.name,
            subtitle: "Campeonato",
          });
        });
      }

      // Adiciona times favoritos
      if (user.favoriteTeams && user.favoriteTeams.length > 0) {
        user.favoriteTeams.forEach((team) => {
          notifications.push({
            id: `t-${team.id}`,
            type: "team",
            title: team.name,
            subtitle: "Equipe",
          });
        });
      }

      setNotifs(notifications);
      setLoading(false);
    };

    formatNotifications();
  }, [user]);

  function handleRemove(id) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  function handleClearAll() {
    if (!confirm("Desligar todas as notificações?")) return;
    setNotifs([]);
  }

  return (
    <div>
      <link rel="stylesheet" href="/css/notifications.css" />
      <div className="row d-flex justify-content-between align-items-center mb-4">
        <div className="col-12 col-md-6">
          <h2 className="text-azul mb-2">Notificações</h2>
          <p className="text-white mb-0">
            Aqui você gerencia as notificações do que deseja acompanhar.
          </p>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-start justify-content-md-end mt-3 mt-md-0">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={notifs.length === 0 || loading}
          >
            <i className="fas fa-xmark me-2"></i>Desligar todas
          </button>
        </div>
      </div>

      {loading && (
        <div className="row g-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <div className="notif-skeleton p-3 rounded-3" />
            </div>
          ))}
        </div>
      )}

      {!loading && notifs.length === 0 && (
        <div
          className="empty-state p-4 rounded-3 text-center"
          style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
        >
          <div className="mb-3">
            <i className="fas fa-bell-slash fs-1"></i>
          </div>
          <h4 className="mb-1">Nenhuma notificação ligada</h4>
          <p className="text-white mb-0">
            Ative notificações nas páginas de jogos, campeonatos ou times para
            vê-las aqui.
          </p>
        </div>
      )}

      {!loading && notifs.length > 0 && (
        <div className="row g-3">
          {notifs.map((n) => (
            <div key={n.id} className="col-12">
              <div
                className="notification-card shadow d-flex align-items-center p-3 rounded-3"
                style={{
                  backgroundColor: "var(--cor-bgEscuro)",
                  border: "none",
                }}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 className="mb-1 notif-title">{n.title}</h5>
                      {n.subtitle && (
                        <div className="text-white small">{n.subtitle}</div>
                      )}
                    </div>
                    <div className="ms-3 align-self-center">
                      <button
                        type="button"
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
  );
}
