"use client";

import { useUser } from "@/context/UserContext";
import { removeAllFavorites, removeFavorite } from "@/services/userService";
import { NotificationType } from "@/types/NotificationType";
import { useCallback, useEffect, useState } from "react";

export default function Notificacoes() {
  const { user, token, refreshUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  const handleRemove = useCallback(
    async (id, type) => {
      try {
        if (!user || !token) {
          console.log(user);
          alert("Você precisa estar logado para remover notificações.");
          return;
        }

        const realId = id.split("-")[1];

        setRemovingId(id);

        await removeFavorite(realId, token, type);

        setNotifs((prev) => prev.filter((n) => n.id !== id));

        await refreshUser();

        console.log(`Favorito ${type} removido com sucesso`);
      } catch (error) {
        console.error("Erro ao remover notificação:", error);
        alert("Erro ao remover notificação. Tente novamente.");
      } finally {
        setRemovingId(null);
      }
    },
    [user, token, refreshUser],
  );

  const handleClearAll = useCallback(async () => {
    if (!confirm("Desligar todas as notificações?")) return;

    try {
      if (!user || !token) {
        alert("Você precisa estar logado para remover notificações.");
        return;
      }

      setClearingAll(true);

      await removeAllFavorites(token);

      setNotifs([]);

      await refreshUser();

      console.log("Todas as notificações removidas com sucesso");
    } catch (error) {
      console.error("Erro ao remover todas as notificações:", error);
      alert("Erro ao remover todas as notificações. Tente novamente.");
    } finally {
      setClearingAll(false);
    }
  }, [user, token, refreshUser]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const formatNotifications = () => {
      const notifications = [];

      if (user.favoriteGames && user.favoriteGames.length > 0) {
        user.favoriteGames.forEach((game) => {
          notifications.push({
            id: `g-${game.id}`,
            type: NotificationType.GAME,
            title: game.name,
            subtitle: game.tournament,
          });
        });
      }

      if (user.favoriteChampionships && user.favoriteChampionships.length > 0) {
        user.favoriteChampionships.forEach((championship) => {
          notifications.push({
            id: `c-${championship.id}`,
            type: NotificationType.CHAMPIONSHIP,
            title: championship.name,
            subtitle: "Campeonato",
          });
        });
      }

      if (user.favoriteTeams && user.favoriteTeams.length > 0) {
        user.favoriteTeams.forEach((team) => {
          notifications.push({
            id: `t-${team.id}`,
            type: NotificationType.TEAM,
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
            disabled={notifs.length === 0 || loading || clearingAll}
          >
            {clearingAll ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Removendo...
              </>
            ) : (
              <>
                <i className="fas fa-xmark me-2"></i>Desligar todas
              </>
            )}
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
                        onClick={() => handleRemove(n.id, n.type)}
                        disabled={removingId === n.id}
                        aria-label={`Desligar notificações de ${n.title}`}
                      >
                        {removingId === n.id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Removendo...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-xmark me-2"></i>Desligar
                          </>
                        )}
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
