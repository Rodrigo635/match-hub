// src/app/game/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getGameById } from '../services/gameService';
import { getMatchesByChampionship } from '../services/matchService';
import { getChampionshipsByGame } from '../services/championshipService';

export default function GamePage() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [championshipData, setChampionshipData] = useState([]);
  const [matchesData, setMatchesData] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('Todos');
  const [selectedTime, setSelectedTime] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Usar useRef para evitar chamadas duplicadas
  const championshipsLoaded = useRef(false);

  const handleGetInfoGame = async id => {
    try {
      setLoading(true);
      const response = await getGameById(id);
      console.log('Game data recebido:', response);
      setGameData(response);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInfoChampionships = async gameId => {
    try {
      if (championshipsLoaded.current) return; // Evita chamadas duplicadas

      console.log('Carregando campeonatos para o jogo:', gameId);
      const response = await getChampionshipsByGame(gameId);
      setChampionshipData(response.content || []);
      championshipsLoaded.current = true;
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error);
    }
  };

  // UseEffect 1: Inicialização e carregamento do jogo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('selectedGame');
    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const id = JSON.parse(stored);
      if (!id) {
        router.push('/');
        return;
      }

      handleGetInfoGame(id);
    } catch (error) {
      console.error('Erro ao processar dados do localStorage:', error);
      router.push('/');
    }
  }, [router]);

  // UseEffect 2: Carrega campeonatos quando gameData estiver disponível
  useEffect(() => {
    if (gameData?.id && !championshipsLoaded.current) {
      handleGetInfoChampionships(gameData.id);
    }
  }, [gameData?.id]);

  // UseEffect 3: Processa partidas quando championshipData estiver disponível
  useEffect(() => {
    if (championshipData && championshipData.length > 0) {
      console.log('Processando partidas dos campeonatos...');

      const allMatches = [];

      championshipData.forEach(championship => {
        if (championship.matches && championship.matches.length > 0) {
          const matchesWithChampionship = championship.matches.map(match => ({
            ...match,
            campeonato: championship.name,
            time1: match.matchTeams[0]?.team?.name || '',
            time2: match.matchTeams[1]?.team?.name || '',
            imgTime1: match.matchTeams[0]?.team?.logo || '',
            imgTime2: match.matchTeams[1]?.team?.logo || '',
            data: new Date(match.date).toLocaleDateString('pt-BR'),
            horario: match.hour.substring(0, 5),
          }));

          allMatches.push(...matchesWithChampionship);
        }
      });

      // NÃO atualiza gameData - só matchesData
      setMatchesData(allMatches);
      setFilteredMatches(allMatches);
    }
  }, [championshipData]);

  // UseEffect 4: Aplica filtros nas partidas
  useEffect(() => {
    if (!matchesData || matchesData.length === 0) return;

    let arr = matchesData;

    if (selectedCampeonato !== 'Todos') {
      arr = arr.filter(p => p.campeonato === selectedCampeonato);
    }

    if (selectedTime !== 'Todos') {
      arr = arr.filter(p => p.time1 === selectedTime || p.time2 === selectedTime);
    }

    setFilteredMatches(arr);
  }, [selectedCampeonato, selectedTime, matchesData]);

  // Extrair opções de filtro
  const campeonatoOptions = ['Todos'];
  const timeOptions = ['Todos'];

  if (matchesData && Array.isArray(matchesData)) {
    const camps = new Set();
    const times = new Set();

    matchesData.forEach(p => {
      if (p.campeonato) camps.add(p.campeonato);
      if (p.time1) times.add(p.time1);
      if (p.time2) times.add(p.time2);
    });

    Array.from(camps)
      .sort()
      .forEach(c => campeonatoOptions.push(c));
    Array.from(times)
      .sort()
      .forEach(t => timeOptions.push(t));
  }

  const handleBack = () => {
    router.back();
  };

  function isFuture(data, horario) {
    const [dia, mes, ano] = data.split('/');
    const partidaData = new Date(`${ano}-${mes}-${dia}T${horario}`);
    return new Date() < partidaData;
  }

  function getBotaoTexto(data, horario) {
    const [dia, mes, ano] = data.split('/');
    const partidaData = new Date(`${ano}-${mes}-${dia}T${horario}`);
    const agora = new Date();

    const mesmoDia = agora.toDateString() === partidaData.toDateString();

    if (mesmoDia) {
      return (
        <>
          Assistir Transmissão <i className="fas fa-circle-play"></i>
        </>
      );
    }

    if (agora > partidaData) {
      return (
        <>
          Assistir Gravação <i className="fas fa-play"></i>
        </>
      );
    }

    return (
      <>
        Transmissão não disponível <i className="fas fa-lock"></i>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="text-white text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  // Verificação se gameData existe
  if (!gameData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="text-white text-center">
          <p>Erro ao carregar dados do jogo.</p>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="/css/game.css" />
      <section className="jogo">
        <div className="container py-4">
          <div className="row">
            <div className="col">
              <div className="container">
                <div className="my-4 mt-5 d-flex justify-content-center justify-content-md-start">
                  <button onClick={handleBack} className="d-none d-md-flex btn-voltar text-white">
                    <i className="fa-solid fa-arrow-left" />
                    <h5 className="mb-0 ms-2">Voltar</h5>
                  </button>
                </div>
                <div className="col-12 col-md-6 col-lg-4 mb-4">
                  <h1 className="game-title fw-bold text-white text-center text-md-start mt-4">
                    {gameData.name}
                  </h1>
                  <div className="d-flex text-white justify-content-center justify-content-md-start">
                    <h4 className="me-2">Principal Torneio:</h4>
                    <h4 id="game-tournament">{gameData.tournament}</h4>
                  </div>
                  <h5 id="game-descricao" className="text-white texto-justificado mt-4 mb-5">
                    {gameData.description || gameData.descricao}
                  </h5>
                </div>
              </div>

              {/* Vídeo de fundo  */}
              {gameData.video && (
                <div className="video-jogo position-absolute">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    id="game-video"
                    className="w-100"
                    onLoadStart={() => console.log('Video loading started:', gameData.video)}
                    onCanPlay={() => console.log('Video can play')}
                    onError={e => console.error('Video error:', e, 'URL:', gameData.video)}
                    onLoadedData={() => console.log('Video data loaded')}
                  >
                    <source src={gameData.video} type="video/mp4" id="game-video-source" />
                    Seu navegador não suporta a tag de vídeo.
                  </video>
                  <div className="gradient" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="page-game">
        {/* Filtros e cards de partidas */}
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

        {/* Lista de próximos jogos */}
        <section className="container">
          <div className="row g-4" id="cards-container">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((item, idx) => (
                <div
                  key={idx}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4 shadow mb-4"
                  style={{ cursor: item.link ? 'pointer' : 'default' }}
                >
                  <div className="card border-0 rounded-4 bg-dark text-white h-100 shadow-sm hover-shadow-lg transition-all">
                    <div className="card-body p-3 p-md-4 rounded-5">
                      {/* Título do Campeonato */}
                      <h5 className="card-title text-primary fw-bold mb-3">{item.campeonato}</h5>

                      {/* Times - Layout responsivo */}
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-3">
                        {/* Time 1 */}
                        <div className="text-center flex-shrink-0">
                          <div
                            style={{
                              width: window.innerWidth < 576 ? 56 : 48,
                              height: window.innerWidth < 576 ? 56 : 48,
                              position: 'relative',
                              margin: '0 auto',
                            }}
                            className="mb-2"
                          >
                            {item.imgTime1 && (
                              <Image
                                src={item.imgTime1}
                                alt={item.time1}
                                fill
                                sizes="(max-width: 576px) 56px, 48px"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <p
                            className="mb-0 fw-semibold small text-truncate"
                            style={{ maxWidth: '80px' }}
                            title={item.time1}
                          >
                            {item.time1}
                          </p>
                        </div>

                        {/* VS */}
                        <div className="fw-bold fs-4 fs-md-3 text-primary flex-shrink-0 order-sm-2">
                          VS
                        </div>

                        {/* Time 2 */}
                        <div className="text-center flex-shrink-0 order-sm-3">
                          <div
                            style={{
                              width: window.innerWidth < 576 ? 56 : 48,
                              height: window.innerWidth < 576 ? 56 : 48,
                              position: 'relative',
                              margin: '0 auto',
                            }}
                            className="mb-2"
                          >
                            {item.imgTime2 && (
                              <Image
                                src={item.imgTime2}
                                alt={item.time2}
                                fill
                                sizes="(max-width: 576px) 56px, 48px"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <p
                            className="mb-0 fw-semibold small text-truncate"
                            style={{ maxWidth: '80px' }}
                            title={item.time2}
                          >
                            {item.time2}
                          </p>
                        </div>
                      </div>

                      {/* Data e Horário */}
                      <div className="text-center text-md-start mb-3">
                        <p className="mb-1 small">
                          <span className="fw-bold">Data:</span> {item.data}
                        </p>
                        <p className="mb-0 small">
                          <span className="fw-bold">Horário:</span> {item.horario}
                        </p>
                      </div>

                      {/* Botão */}
                      <div className="d-grid mt-auto">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn btn-live btn-outline-primary rounded-pill py-2 ${
                            isFuture(item.data, item.horario) ? 'disabled' : ''
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          <span className="fw-semibold fs-6">
                            {getBotaoTexto(item.data, item.horario)}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <p className="text-white">Nenhum jogo encontrado para este filtro.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Seção de Campeonatos */}
        <section className="container mt-5 mb-3">
          <div className="row align-items-center">
            <div className="col-12 col-md-12 col-lg-6 filtros-titulo">
              <h1 className="text-white fw-bold">Campeonatos</h1>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="row" id="campeonatos-container">
            {championshipData && championshipData.length > 0 ? (
              championshipData.map(camp => (
                <div key={camp.id} className="col-12 col-md-6 col-lg-3 mb-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      // opcional: guardar seleção (não obrigatório)
                      try {
                        localStorage.setItem('selectedChampionship', JSON.stringify(camp.id));
                      } catch (e) {}
                      router.push(`/campeonatos/${camp.id}`);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        router.push(`/campeonatos/${camp.id}`);
                      }
                    }}
                    className="card bg-dark text-white p-3 h-100 border-0 rounded-4 cursor-pointer"
                  >
                    <div className="card-body p-2">
                      {camp.imageChampionship && (
                        <div
                          className="text-center mb-3"
                          style={{ width: 80, height: 80, position: 'relative', margin: '0 auto' }}
                        >
                          <Image src={camp.imageChampionship} alt={camp.name} fill sizes="80px" />
                        </div>
                      )}

                      <h5 className="text-center text-primary fw-bold mb-3 text-truncate">
                        {camp.name}
                      </h5>

                      <div className="d-flex text-white gap-2 align-items-center mb-2">
                        <small className="text-white">Partidas:</small>
                        <span className="badge text-white bg-primary rounded-pill">
                          {camp.totalMatches || 0}
                        </span>
                      </div>

                      {camp.matches && camp.matches.length > 0 && (
                        <div className="mb-3">
                          <small className="text-white d-block mb-2">Times:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {Array.from(
                              new Set(
                                camp.matches.flatMap(match =>
                                  match.matchTeams.map(mt => mt.team.name)
                                )
                              )
                            )
                              .slice(0, 4)
                              .map((teamName, idx) => (
                                <span
                                  key={idx}
                                  className="badge bg-secondary text-truncate"
                                  style={{ maxWidth: '80px', fontSize: '0.7rem' }}
                                  title={teamName}
                                >
                                  {teamName}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto">
                        <small className="text-white">
                          Criado em: {new Date(camp.createdAt).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <p className="text-muted">Nenhum campeonato encontrado para este jogo.</p>
                </div>
              </div>
            )}
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
                  <h5 className="text-cinza mb-0">{gameData.developer}</h5>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Gênero:</h5>
                  <h5 className="text-cinza mb-0">{gameData.genre}</h5>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Lançamento:</h5>
                  <h5 className="text-cinza mb-0">{gameData.release}</h5>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Campeonatos:</h5>
                  <h5 className="text-cinza mb-0">{championshipData.length} campeonatos</h5>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Tags:</h5>
                  <h5 className="text-cinza mb-0">
                    {Array.isArray(gameData.tags) ? gameData.tags.join(', ') : ''}
                  </h5>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Distribuidora:</h5>
                  <h5 className="text-cinza mb-0">{gameData.publisher}</h5>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold text-white me-2">Idade Recomendada:</h5>
                  <h5 className="text-cinza mb-0">{gameData.ageRating}+</h5>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

