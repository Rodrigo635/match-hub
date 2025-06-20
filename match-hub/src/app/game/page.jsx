// src/app/game/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function GamePage() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('Todos');
  const [selectedTime, setSelectedTime] = useState('Todos');

  // Quando carregar: ler localStorage; se não houver, redirecionar para home
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedGame');
      if (!stored) {
        router.push('/');
        return;
      }
      try {
        const item = JSON.parse(stored);
        setGameData(item);
        // inicialmente, todos os matches
        setFilteredMatches(item.partidas || []);
      } catch {
        router.push('/');
      }
    }
  }, [router]);

  // Extrair opções de filtro a partir de gameData.partidas
  const campeonatoOptions = ['Todos'];
  const timeOptions = ['Todos'];
  if (gameData && Array.isArray(gameData.partidas)) {
    const camps = new Set();
    const times = new Set();
    gameData.partidas.forEach(p => {
      if (p.campeonato) camps.add(p.campeonato);
      if (p.time1) times.add(p.time1);
      if (p.time2) times.add(p.time2);
    });
    Array.from(camps).sort().forEach(c => campeonatoOptions.push(c));
    Array.from(times).sort().forEach(t => timeOptions.push(t));
  }

  // Atualiza filteredMatches quando filtros mudam
  useEffect(() => {
    if (!gameData || !Array.isArray(gameData.partidas)) return;
    let arr = gameData.partidas;
    if (selectedCampeonato !== 'Todos') {
      arr = arr.filter(p => p.campeonato === selectedCampeonato);
    }
    if (selectedTime !== 'Todos') {
      arr = arr.filter(
        p => p.time1 === selectedTime || p.time2 === selectedTime
      );
    }
    setFilteredMatches(arr);
  }, [selectedCampeonato, selectedTime, gameData]);

  // Função de voltar
  const handleBack = () => {
    router.back();
  };

  if (!gameData) {
    return null; // ou um loading simples
  }

  // Caminhos absolutos para assets
  // As propriedades image, gif, video no JSON podem vir como "./static/...", então:
  const normalizePath = str => {
    if (!str) return '';
    return str.replace(/^\.?\//, '/').replace('./static', '/static');
  };

  return (
    <>
      <link rel="stylesheet" href="/css/game.css" />
      <section className="jogo">
        <div className="container py-4">
          <div className="row">
            <div className="col">
              <div className="container">
                <div className="my-4 mt-5 d-flex justify-content-center justify-content-md-start">
                  <button
                    onClick={handleBack}
                    className="d-none d-md-flex btn-voltar text-white"
                  >
                    <i className="fa-solid fa-arrow-left" />
                    <h5 className="mb-0 ms-2">Voltar</h5>
                  </button>
                </div>
                <div className="col-12 col-md-6 col-lg-4 mb-4">
                  <h1 className="game-title fw-bold text-white text-center text-md-start mt-4">
                    {gameData.game}
                  </h1>
                  <div className="d-flex text-white justify-content-center justify-content-md-start">
                    <h4 className="me-2">Principal Torneio:</h4>
                    <h4 id="game-tournament">{gameData.tournament}</h4>
                  </div>
                  <h5
                    id="game-descricao"
                    className="text-white texto-justificado mt-4 mb-5"
                  >
                    {gameData.descricao}
                  </h5>
                </div>
              </div>

              {/* Vídeo de fundo ou apresentação */}
              {gameData.video && (
                <div className="video-jogo position-absolute">
                  <video
                    autoPlay
                    loop
                    muted
                    id="game-video"
                    className="w-100"
                  >
                    <source
                      src={normalizePath(gameData.video)}
                      type="video/mp4"
                      id="game-video-source"
                    />
                    Seu navegador não suporta a tag de vídeo.
                  </video>
                  <div className="gradient" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filtros de próximos jogos */}
      <section className="container mt-5 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-12 col-lg-6 filtros-titulo">
            <h1 className="text-white fw-bold">Próximos Jogos</h1>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <ul className="row m-0 p-0 list-style-none gx-2">
              <li className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer"
                  name="campeonatos-game"
                  id="campeonatos-game"
                  value={selectedCampeonato}
                  onChange={e => setSelectedCampeonato(e.target.value)}
                >
                  {campeonatoOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </li>
              <li className="col-6 filtro">
                <select
                  className="form-select rounded-5 fw-bold cursor-pointer"
                  name="campeonatos-time"
                  id="campeonatos-time"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                >
                  {timeOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lista de próximos jogos (cards) */}
      <section className="container">
        <div className="row g-4" id="cards-container">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((item, idx) => (
              <div
                key={idx}
                className="col-12 col-md-6 col-lg-4"
                // opcional: onClick para abrir link
                onClick={() => {
                  if (item.link) window.open(item.link, '_blank');
                }}
              >
                <div className="card bg-dark text-white h-100 p-3">
                  <h5 className="fw-bold">{item.campeonato}</h5>
                  <div className="d-flex justify-content-between">
                    <div className="text-truncate">
                      <span>{item.time1}</span> vs <span>{item.time2}</span>
                    </div>
                    <div>
                      <span>{item.data}</span> <span>{item.horario}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-white">Nenhum jogo encontrado para este filtro.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Campeonatos em destaque, se desejar */}
      <section className="container mt-5 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-12 col-lg-6 filtros-titulo">
            <h1 className="text-white fw-bold">Campeonatos</h1>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="row" id="campeonatos-container">
          {gameData.campeonatos && gameData.campeonatos.length > 0 ? (
            gameData.campeonatos.map((camp, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-3 mb-3">
                <div className="card bg-dark text-white p-3 h-100">
                  <h5 className="mb-0 text-truncate">{camp}</h5>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </section>

      {/* Mais Informações */}
      <section className="bg-cinza py-5">
        <div className="container">
          <div className="d-flex text-center text-md-start mb-4">
            <h1 className="fw-bold text-white">Mais Informações</h1>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Desenvolvedora:</h5>
                <h5 id="game-desenvolvedora" className="text-cinza mb-0">
                  {gameData.desenvolvedora}
                </h5>
              </div>
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Gênero:</h5>
                <h5 id="game-genero" className="text-cinza mb-0">
                  {gameData.genero}
                </h5>
              </div>
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Lançamento:</h5>
                <h5 id="game-lancamento" className="text-cinza mb-0">
                  {gameData.lancamento}
                </h5>
              </div>
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Campeonatos:</h5>
                <h5 id="game-campeonatos" className="text-cinza mb-0 text-truncate">
                  {Array.isArray(gameData.imgCamps)
                    ? gameData.imgCamps.length + ' items'
                    : ''}
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Tags:</h5>
                <h5 id="game-tags" className="text-cinza mb-0">
                  {Array.isArray(gameData.tags) ? gameData.tags.join(', ') : ''}
                </h5>
              </div>
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Distribuidora:</h5>
                <h5 id="game-distribuidora" className="text-cinza mb-0">
                  {gameData.distribuidora}
                </h5>
              </div>
              <div className="d-flex">
                <h5 className="fw-bold text-white me-2">Idade Recomendada:</h5>
                <h5 id="game-idade-recomendada" className="text-cinza mb-0">
                  {gameData.idade_recomendada
                    ? `${gameData.idade_recomendada}+`
                    : ''}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
