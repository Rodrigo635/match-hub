// src/components/GamesList.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllGames } from "@/services/gameService";
import Image from "next/image";

export default function GamesList({ initialItems, additionalItems }) {
  const router = useRouter();

  const [allData, setAllData] = useState([]); // todos os jogos buscados
  const [filtered, setFiltered] = useState([]); // dados após filtro
  const [page, setPage] = useState(0);

  const INITIAL_ITEMS = initialItems;
  const ADDITIONAL_ITEMS = additionalItems;

  const [selectedGame, setSelectedGame] = useState("Jogos");
  const [selectedTournament, setSelectedTournament] = useState("Campeonatos");

  const visibleCount = INITIAL_ITEMS + page * ADDITIONAL_ITEMS;
  const pageItems = filtered.slice(0, visibleCount);
  const hasNext = visibleCount < filtered.length;
  const hasPrev = page > 0;

  // Busca todos os jogos apenas uma vez
  const handleGetAllGames = async () => {
    try {
      const response = await getAllGames();
      const content = response?.content ?? response ?? [];
      setAllData(content);
      // aplica filtro inicial (todos)
      setFiltered(content);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    }
  };

  useEffect(() => {
    handleGetAllGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza filtered quando os selects mudam ou quando os dados mudam
  useEffect(() => {
    const f = allData.filter((item) => {
      const gameMatch =
        selectedGame === "Jogos" ||
        item.name.toLowerCase() === selectedGame.toLowerCase();
      const tourMatch =
        selectedTournament === "Campeonatos" ||
        item.tournament.toLowerCase() === selectedTournament.toLowerCase();
      return gameMatch && tourMatch;
    });
    setFiltered(f);
    setPage(0); // resetar paginação ao mudar filtros
  }, [selectedGame, selectedTournament, allData]);

  // opções dos selects com base em toda a base
  const gameOptions = [
    "Jogos",
    ...Array.from(new Set(allData.map((i) => i.name))),
  ];
  const tournamentOptions = [
    "Campeonatos",
    ...Array.from(new Set(allData.map((i) => i.tournament))),
  ];

  // handlers
  const handleGameChange = (e) => setSelectedGame(e.target.value);
  const handleTournamentChange = (e) => setSelectedTournament(e.target.value);
  const handleNext = () => {
    if (hasNext) setPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (hasPrev) setPage((p) => p - 1);
  };
  const handleCardClick = (item) => {
    localStorage.setItem("selectedGame", JSON.stringify(item.id));
    router.push(`/game`);
  };

  return (
    <section>
      {/* Filtros */}
      <div className="container mt-5 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 filtros-titulo">
            <h1 className="title-campeonato text-white fw-bold">
              Lista de Jogos
            </h1>
          </div>
          <div className="col-12 col-md-6 ">
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
              style={{ cursor: "pointer" }}
            >
              <div className="card bg-transparent h-100">
                <div>
                  <Image
                    alt={item.game || "Imagem do jogo"}
                    className=" rounded-3"
                    width={300}
                    height={300}
                    src={item.image}
                  />
                </div>

                <div className="info-jogo bg-dark">
                  <h5 className="pt-4 ps-3 text-white fw-bold">{item.name}</h5>
                  <h6 className="pt-2 pb-4 ps-3 text-white ">
                    {item.tournament}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="container text-center my-5">
          {hasPrev && additionalItems !== 0 && (
            <button
              type="button"
              className="text-center ver-menos cursor-pointer bg-transparent border-0"
              onClick={handlePrev}
            >
              <span className="text-azul">Ver menos</span>
            </button>
          )}
          {hasNext && additionalItems !== 0 && (
            <button
              type="button"
              className="text-center ver-mais cursor-pointer bg-transparent border-0"
              onClick={handleNext}
            >
              <span className="text-azul">Ver mais</span>
            </button>
          )}
        </div>
      </section>
    </section>
  );
}
