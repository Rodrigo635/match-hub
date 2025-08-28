// src/components/GamesList.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GamesList() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedGame, setSelectedGame] = useState("Todos");
  const [selectedTournament, setSelectedTournament] = useState("Todos");
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  // Fetch inicial
  useEffect(() => {
    fetch("/thumbs.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setFiltered(json);
      })
      .catch((err) => console.error("Erro ao carregar thumbs.json:", err));
  }, []);

  // Atualiza filtered quando filtros mudam
  useEffect(() => {
    if (!data.length) return;
    const f = data.filter((item) => {
      const gameMatch =
        selectedGame === "Todos" ||
        item.game.toLowerCase() === selectedGame.toLowerCase();
      const tourMatch =
        selectedTournament === "Todos" ||
        item.tournament.toLowerCase() === selectedTournament.toLowerCase();
      return gameMatch && tourMatch;
    });
    setFiltered(f);
    setPage(0);
  }, [selectedGame, selectedTournament, data]);

  // Opções de selects
  const gameOptions = [
    "Todos",
    ...Array.from(new Set(data.map((i) => i.game))),
  ];
  const tournamentOptions = [
    "Todos",
    ...Array.from(new Set(data.map((i) => i.tournament))),
  ];

  // Paginação
  const INITIAL_ITEMS = 12;
  const ADDITIONAL_ITEMS = 8;
  const visibleCount = INITIAL_ITEMS + page * ADDITIONAL_ITEMS;
  const pageItems = filtered.slice(0, visibleCount);
  const hasNext = visibleCount < filtered.length;
  const hasPrev = page > 0 && visibleCount > INITIAL_ITEMS;

  // Handlers
  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
  };
  const handleTournamentChange = (e) => {
    setSelectedTournament(e.target.value);
  };
  const handleNext = () => {
    if (hasNext) setPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (hasPrev) setPage((p) => p - 1);
  };
  const handleCardClick = (item) => {
    localStorage.setItem("selectedGame", JSON.stringify(item));
    // se usar rota /game, adapte:
    router.push(`/game`);
  };

  return (
    <section>
      {/* Filtros */}
      <div className="container mt-5 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 filtros-titulo">
            <h1 className="title-campeonato text-white fw-bold">Lista de Jogos</h1>
          </div>
          <div className="col-12 col-md-6">
            <div className="row gx-2">
              <div className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer bg-dark text-white"
                  value={selectedGame}
                  onChange={handleGameChange}
                >
                  {gameOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer bg-dark text-white"
                  value={selectedTournament}
                  onChange={handleTournamentChange}
                >
                  {tournamentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <section className="container mt-2">
        <div className="row g-3">
          {pageItems.map((item, idx) => (
            <div
              key={idx}
              className="col-12 col-md-6 col-lg-3"
              onClick={() => handleCardClick(item)}
            >
              <a href="#">
                <div className="card bg-dark h-100">
                  <img
                    className="rounded-3 static-image"
                    src={item.image.replace("./static", "/static")}
                    alt={item.game}
                  />
                  <div className="gif-container">
                    <img
                      className="rounded-3 gif-image"
                      src={item.gif.replace("./static", "/static")}
                      alt={`${item.game} GIF`}
                    />
                    <div className="gradient"></div>
                  </div>
                  <h5 className="pt-3 ps-3 text-white fw-bold">{item.game}</h5>
                  <h6 className="pb-3 ps-3 text-white bg-dark">{item.tournament}</h6>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="container text-center my-5">
          {hasPrev && (
            <h5
              className="text-center ver-menos cursor-pointer"
              onClick={handlePrev}
            >
          <a href="#" className="text-azul">
              Ver menos
          </a>
            </h5>
          )}
          {hasNext && (
            <h5
              className="text-center ver-mais cursor-pointer"
              onClick={handleNext}
            >
            <a href="#" className="text-azul">
              Ver mais
            </a>
            </h5>
          )}
        </div>
      </section>
    </section>
  );
}
