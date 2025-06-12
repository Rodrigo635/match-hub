// src/components/GamesList.jsx
'use client';

import { useState, useEffect } from 'react';

export default function GamesList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedGame, setSelectedGame] = useState('Todos');
  const [selectedTournament, setSelectedTournament] = useState('Todos');
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  // Fetch inicial
  useEffect(() => {
    fetch('/thumbs.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setFiltered(json);
      })
      .catch(err => console.error('Erro ao carregar thumbs.json:', err));
  }, []);

  // Atualiza filtered quando filtros mudam
  useEffect(() => {
    if (!data.length) return;
    const f = data.filter(item => {
      const gameMatch =
        selectedGame === 'Todos' ||
        item.game.toLowerCase() === selectedGame.toLowerCase();
      const tourMatch =
        selectedTournament === 'Todos' ||
        item.tournament.toLowerCase() === selectedTournament.toLowerCase();
      return gameMatch && tourMatch;
    });
    setFiltered(f);
    setPage(0);
  }, [selectedGame, selectedTournament, data]);

  // Opções de selects
  const gameOptions = ['Todos', ...Array.from(new Set(data.map(i => i.game)))];
  const tournamentOptions = [
    'Todos',
    ...Array.from(new Set(data.map(i => i.tournament))),
  ];

  // Paginação
  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, end);
  const hasNext = end < filtered.length;
  const hasPrev = page > 0;

  // Handlers
  const handleGameChange = e => {
    setSelectedGame(e.target.value);
  };
  const handleTournamentChange = e => {
    setSelectedTournament(e.target.value);
  };
  const handleNext = () => {
    if (hasNext) setPage(p => p + 1);
  };
  const handlePrev = () => {
    if (hasPrev) setPage(p => p - 1);
  };
  const handleCardClick = item => {
    localStorage.setItem('selectedGame', JSON.stringify(item));
    // se usar rota /game, adapte:
    window.location.href = '/game';
  };

  return (
    <section>
      {/* Filtros */}
      <div className="container mt-5 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 filtros-titulo">
            <h1 className="text-white fw-bold">Campeonatos</h1>
          </div>
          <div className="col-12 col-md-6">
            <div className="row gx-2">
              <div className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer"
                  value={selectedGame}
                  onChange={handleGameChange}
                >
                  {gameOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer"
                  value={selectedTournament}
                  onChange={handleTournamentChange}
                >
                  {tournamentOptions.map(opt => (
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
              <div className="card bg-dark h-100">
                <img
                  className="rounded-3 static-image"
                  src={item.image.replace('./static', '/static')}
                  alt={item.game}
                />
                <div className="gif-container">
                  <img
                    className="rounded-3 gif-image"
                    src={item.gif.replace('./static', '/static')}
                    alt={`${item.game} GIF`}
                  />
                  <div className="gradient"></div>
                </div>
                <h5 className="pt-3 ps-3 text-white fw-bold">{item.game}</h5>
                <h6 className="pb-3 ps-3 text-white">{item.tournament}</h6>
              </div>
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
              Ver menos
            </h5>
          )}
          {hasNext && (
            <h5
              className="text-center ver-mais cursor-pointer"
              onClick={handleNext}
            >
              Ver mais
            </h5>
          )}
        </div>
      </section>
    </section>
  );
}
