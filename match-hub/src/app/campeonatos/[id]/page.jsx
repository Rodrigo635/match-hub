// src/app/campeonato/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getChampionshipById } from "../../../services/championshipService";
import { toggleFavoriteGame, removeFavorite } from "@/services/userService";
import { useUser } from "../../../context/UserContext";

export default function ChampionshipDetailsPage() {
  const router = useRouter();
  const { user, token } = useUser();
  const [championshipData, setChampionshipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("times");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const favoritesChecked = useRef(false);

  const handleGetChampionshipInfo = async (id) => {
    try {
      setLoading(true);
      const response = await getChampionshipById(id);
      console.log("Championship data recebido:", response);
      setChampionshipData(response);
    } catch (error) {
      console.error("Erro ao carregar campeonato:", error);
      router.push("/campeonatos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("selectedChampionship");
    if (!stored) {
      router.push("/campeonatos");
      return;
    }

    try {
      const id = JSON.parse(stored);
      if (!id) {
        router.push("/campeonatos");
        return;
      }

      handleGetChampionshipInfo(id);
    } catch (error) {
      console.error("Erro ao processar dados do localStorage:", error);
      router.push("/campeonatos");
    }
  }, [router]);

  useEffect(() => {
    if (user && token && championshipData?.id && !favoritesChecked.current) {
      handleCheckFavorite(championshipData.id);
    }
  }, [user, token, championshipData?.id]);

  // Verificar se o jogo é favorito
  const handleCheckFavorite = async (championshipId) => {
    try {
      if (!user || !token || favoritesChecked.current) return;

      // Verifica se o jogo está nos favoritos do usuário
      const isFav =
        user.favoriteChampionships?.some(
          (championship) => championship.id === championshipId,
        ) || false;
      setIsFavorite(isFav);
      favoritesChecked.current = true;
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      setIsFavorite(false);
    }
  };

  // Toggle de notificações (favoritar/remover)
  const handleToggleNotification = async () => {
    try {
      if (!user || !token || !championshipData) {
        alert("Você precisa estar logado para ativar notificações.");
        return;
      }

      setLoadingFavorite(true);

      if (
        user.favoriteChampionships?.some(
          (championship) => championshipData.id === championship,
        )
      ) {
        // Já favoritado → remover
        await removeFavorite(championshipData.id, token, "championship");
        setIsFavorite(false);
        user.favoriteChampionships = user.favoriteChampionships.filter(
          (game) => game.id !== championshipData.id,
        );
        console.log("Favorito removido com sucesso");
      } else {
        // Não é favorito → adicionar
        await toggleFavoriteGame(championshipData.id, token, "championship");
        user.favoriteChampionships.push(championshipData);
        setIsFavorite(true);
        console.log("Favorito adicionado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao alternar notificações:", error);
      alert("Erro ao alternar notificações. Tente novamente.");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Extrai times únicos das partidas
  const getUniqueTeams = () => {
    if (!championshipData?.matches) return [];

    const teamsMap = new Map();

    championshipData.matches.forEach((match) => {
      match.matchTeams?.forEach((mt) => {
        if (mt.team && !teamsMap.has(mt.team.id)) {
          teamsMap.set(mt.team.id, {
            id: mt.team.id,
            name: mt.team.name,
            logo: mt.team.logo,
            wins: 0,
            losses: 0,
            draws: 0,
            points: 0,
            gamesPlayed: 0,
          });
        }
      });
    });

    // Calcula estatísticas básicas (pode ser expandido com dados reais do backend)
    championshipData.matches.forEach((match) => {
      if (match.matchTeams?.length === 2) {
        const team1 = teamsMap.get(match.matchTeams[0].team.id);
        const team2 = teamsMap.get(match.matchTeams[1].team.id);

        if (team1) team1.gamesPlayed++;
        if (team2) team2.gamesPlayed++;

        // Aqui você pode adicionar lógica para calcular vitórias/derrotas
        // baseado nos resultados das partidas se disponíveis
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) => b.points - a.points);
  };

  // Formata data para exibição
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Formata horário
  const formatTime = (timeString) => {
    return timeString?.substring(0, 5) || "00:00";
  };

  // Verifica se a partida é futura
  const isFutureMatch = (date, time) => {
    const [dia, mes, ano] = formatDate(date).split("/");
    const matchDateTime = new Date(`${ano}-${mes}-${dia}T${time}`);
    return new Date() < matchDateTime;
  };

  // Filtra partidas por status
  const getMatchesByStatus = (status) => {
    if (!championshipData?.matches) return [];

    const now = new Date();

    return championshipData.matches
      .filter((match) => {
        const matchDate = new Date(match.date + "T" + match.hour);

        if (status === "upcoming") {
          return matchDate > now;
        } else if (status === "past") {
          return matchDate <= now;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + "T" + a.hour);
        const dateB = new Date(b.date + "T" + b.hour);
        return status === "upcoming" ? dateA - dateB : dateB - dateA;
      });
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-white text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando detalhes do campeonato...</p>
        </div>
      </div>
    );
  }

  if (!championshipData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-white text-center">
          <p>Erro ao carregar dados do campeonato.</p>
          <button
            type="button"
            onClick={() => router.push("/campeonatos")}
            className="btn btn-primary"
          >
            Voltar aos campeonatos
          </button>
        </div>
      </div>
    );
  }

  const teams = getUniqueTeams();
  const upcomingMatches = getMatchesByStatus("upcoming");
  const pastMatches = getMatchesByStatus("past");

  return (
    <>
      <link rel="stylesheet" href="/css/championship.css" />

      {/* Header do Campeonato */}
      <section className="championship-header py-5">
        {/* imagem de fundo (next/image com fill) */}
        {championshipData.imageChampionship && (
          <div className="championship-bg">
            <Image
              src={championshipData.imageChampionship}
              alt={championshipData.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center right" }}
              priority
            />
            <div className="championship-bg-overlay" />
          </div>
        )}

        <div className="container">
          <div className="col-12 d-flex justify-content-start gap-2 mb-4 mt-5">
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-voltar text-white"
            >
              <h5 className="mb-0 ms-2">
                <i className="fa-solid fa-arrow-left me-2" /> Voltar
              </h5>
            </button>
            <button
              type="button"
              className={`btn ${isFavorite ? "btn-voltar" : "btn-outline-branco"} w-auto text-white`}
              onClick={handleToggleNotification}
              disabled={loadingFavorite}
            >
              <h5 className="mb-0 ms-2">
                <i
                  className={`fa-${isFavorite ? "solid" : "regular"} fa-bell me-2`}
                />
                {loadingFavorite
                  ? "Processando..."
                  : isFavorite
                    ? "Notificações Ativas"
                    : "Ativar Notificações"}
              </h5>
            </button>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-9">
              <h1 className="display-4 fw-bold text-white mb-3">
                {championshipData.name}
              </h1>

              {championshipData.description && (
                <p className="lead text-light mb-4">
                  {championshipData.description}
                </p>
              )}

              <div className="row text-white">
                <div className="mb-2">
                  <i className="fas fa-users me-2 text-primary"></i>
                  <span className="fw-bold">Times:</span> {teams.length}
                </div>
                <div className="">
                  <i className="fas fa-trophy me-2 text-primary"></i>
                  <span className="fw-bold">Partidas:</span>{" "}
                  {championshipData.totalMatches || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navegação por Tabs */}
      <section className="section-campeonatos bg-black sticky-top p-2">
        <div className="container">
          <ul className="nav nav-tabs border-0 shadow-0">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === "times" ? "active bg-dark text-primary" : "text-white"} border-0 rounded-top`}
                onClick={() => setActiveTab("times")}
              >
                <i className="fas fa-users me-2"></i>Times
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === "proximas" ? "active bg-dark text-primary" : "text-white"} border-0 rounded-top`}
                onClick={() => setActiveTab("proximas")}
              >
                <i className="fas fa-calendar me-2"></i>Próximas Partidas
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === "passadas" ? "active bg-dark text-primary" : "text-white"} border-0 rounded-top`}
                onClick={() => setActiveTab("passadas")}
              >
                <i className="fas fa-history me-2"></i>Partidas Passadas
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* Conteúdo das Tabs */}
      <main className="page-campeonato py-5">
        <div className="container">
          {/* Tab de Times */}
          {activeTab === "times" && (
            <div className="row g-4">
              <h2 className="text-white mb-4">Times Participantes</h2>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        try {
                          localStorage.setItem(
                            "selectedTeam",
                            JSON.stringify(team.id),
                          );
                        } catch (e) {}
                        router.push(`/times/${team.id}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          router.push(`/times/${team.id}`);
                        }
                      }}
                      className="card bg-dark text-white h-100 border-0 shadow cursor-pointer"
                    >
                      <div className="card-body-campeonato text-center p-4">
                        {team.logo && (
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              position: "relative",
                              margin: "0 auto 1rem",
                            }}
                          >
                            <Image
                              src={team.logo}
                              alt={team.name}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        )}
                        <h5 className="card-title fw-bold">{team.name}</h5>
                        <div className="mt-3">
                          <small className="text-white d-block">
                            <i className="fas fa-play me-1"></i>
                            Partidas: {team.gamesPlayed}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-white">
                    Nenhum time cadastrado neste campeonato.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab de Próximas Partidas */}
          {activeTab === "proximas" && (
            <div>
              <h2 className="text-white mb-4">Próximas Partidas</h2>
              <div className="row g-4">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <div className="card bg-dark text-white h-100 border-0 shadow">
                        <div className="card-body-campeonato p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-center">
                              {match.matchTeams[0]?.team?.logo && (
                                <div
                                  style={{
                                    width: 60,
                                    height: 60,
                                    position: "relative",
                                    margin: "0 auto",
                                  }}
                                >
                                  <Image
                                    src={match.matchTeams[0].team.logo}
                                    alt={match.matchTeams[0].team.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                              )}
                              <small className="d-block mt-2">
                                {match.matchTeams[0]?.team?.name}
                              </small>
                            </div>

                            <div className="vs text-primary fw-bold fs-3">
                              VS
                            </div>

                            <div className="text-center">
                              {match.matchTeams[1]?.team?.logo && (
                                <div
                                  style={{
                                    width: 60,
                                    height: 60,
                                    position: "relative",
                                    margin: "0 auto",
                                  }}
                                >
                                  <Image
                                    src={match.matchTeams[1].team.logo}
                                    alt={match.matchTeams[1].team.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                              )}
                              <small className="d-block mt-2">
                                {match.matchTeams[1]?.team?.name}
                              </small>
                            </div>
                          </div>

                          <hr className="bg-secondary" />

                          <div className="text-center">
                            <p className="mb-1">
                              <i className="fas fa-calendar me-2 text-primary"></i>
                              {formatDate(match.date)}
                            </p>
                            <p className="mb-3">
                              <i className="fas fa-clock me-2 text-primary"></i>
                              {formatTime(match.hour)}
                            </p>

                            {match.link && (
                              <a
                                href={match.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm w-100"
                              >
                                <i className="fas fa-external-link-alt me-2"></i>
                                Ver Detalhes
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-white">
                      Nenhuma partida futura agendada.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab de Partidas Passadas */}
          {activeTab === "passadas" && (
            <div>
              <h2 className="text-white mb-4">Partidas Passadas</h2>
              <div className="row g-4">
                {pastMatches.length > 0 ? (
                  pastMatches.map((match, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <div className="card bg-dark text-white h-100 border-0 shadow">
                        <div className="card-body-campeonato p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-center">
                              {match.matchTeams[0]?.team?.logo && (
                                <div
                                  style={{
                                    width: 60,
                                    height: 60,
                                    position: "relative",
                                    margin: "0 auto",
                                  }}
                                >
                                  <Image
                                    src={match.matchTeams[0].team.logo}
                                    alt={match.matchTeams[0].team.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                              )}
                              <small className="d-block mt-2">
                                {match.matchTeams[0]?.team?.name}
                              </small>
                            </div>

                            <div className="text-white fw-bold fs-3">VS</div>

                            <div className="text-center">
                              {match.matchTeams[1]?.team?.logo && (
                                <div
                                  style={{
                                    width: 60,
                                    height: 60,
                                    position: "relative",
                                    margin: "0 auto",
                                  }}
                                >
                                  <Image
                                    src={match.matchTeams[1].team.logo}
                                    alt={match.matchTeams[1].team.name}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                              )}
                              <small className="d-block mt-2">
                                {match.matchTeams[1]?.team?.name}
                              </small>
                            </div>
                          </div>

                          <hr className="bg-secondary" />

                          <div className="text-center">
                            <p className="mb-1 text-white">
                              <i className="fas fa-calendar me-2"></i>
                              {formatDate(match.date)}
                            </p>
                            <p className="mb-3 text-white">
                              <i className="fas fa-clock me-2"></i>
                              {formatTime(match.hour)}
                            </p>

                            {match.link && (
                              <a
                                href={match.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-secondary btn-sm w-100"
                              >
                                <i className=" fas fa-play me-2"></i>
                                Assistir Gravação
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-white">
                      Nenhuma partida passada encontrada.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
