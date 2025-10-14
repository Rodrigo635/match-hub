'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getGameById } from '../../services/gameService';
import { getChampionshipsByGame } from '../../services/championshipService';
import { useUser } from '@/context/UserContext';
import { toggleFavoriteGame, removeFavorite } from '@/services/userService';

export default function GamePage() {
  const router = useRouter();
  const { user, token } = useUser();
  const [gameData, setGameData] = useState(null);
  const [championshipData, setChampionshipData] = useState([]);
  const [matchesData, setMatchesData] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('Todos');
  const [selectedTime, setSelectedTime] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  
  // Usar useRef para evitar chamadas duplicadas
  const championshipsLoaded = useRef(false);
  const favoritesChecked = useRef(false);

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

  // Verificar se o jogo é favorito
  const handleCheckFavorite = async gameId => {
    try {
      if (!user || !token || favoritesChecked.current) return;

      // Verifica se o jogo está nos favoritos do usuário
      const isFav = user.favoriteGames?.some(game => game.id === gameId) || false;
      setIsFavorite(isFav);
      favoritesChecked.current = true;
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      setIsFavorite(false);
    }
  };

// Toggle de notificações (favoritar/remover)
const handleToggleNotification = async () => {
  try {
    if (!user || !token || !gameData) {
      alert("Você precisa estar logado para ativar notificações.");
      return;
    }

    setLoadingFavorite(true);

    if (user.favoriteGames?.some((game) => game.id === gameData.id)) {
      // Já favoritado → remover
      await removeFavorite(gameData.id, token, "game");
      setIsFavorite(false);
      user.favoriteGames = user.favoriteGames.filter((game) => game.id !== gameData.id);
      console.log("Favorito removido com sucesso");
    } else {
      // Não é favorito → adicionar
      await toggleFavoriteGame(gameData.id, token, "game");
      user.favoriteGames.push(gameData);
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

  // UseEffect 3: Verifica se o jogo é favorito quando user e gameData estão disponíveis
  useEffect(() => {
    if (user && token && gameData?.id && !favoritesChecked.current) {
      handleCheckFavorite(gameData.id);
    }
  }, [user, token, gameData?.id]);

  // UseEffect 4: Processa partidas quando championshipData estiver disponível
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

      setMatchesData(allMatches);
      setFilteredMatches(allMatches);
    }
  }, [championshipData]);

  // UseEffect 5: Aplica filtros nas partidas
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
    Array.from(camps).sort().forEach(c => campeonatoOptions.push(c));
    Array.from(times).sort().forEach(t => timeOptions.push(t));
  }

  useEffect(() => {
    if (!gameData) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [gameData]);

  // Função de voltar
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


  if (!gameData) {
    return (
      <>
        <link rel="stylesheet" href="/css/game.css" />
        <div className="game-loading d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          <div className="loading-wrapper text-center">
            <div className="loader" role="status" aria-live="polite" aria-label="Carregando jogo" />
            <h4 className="mt-3 text-white">Carregando jogo...</h4>
            <p className="text-muted small mt-3">Se a página demorar muito, verifique sua conexão ou tente recarregar.</p>
          </div>
        </div>
      </>
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
                <div className="row mb-3 mb-md-0">
                  <div className="col-12 d-flex justify-content-center justify-content-md-start gap-2 order-last order-md-first mt-md-5">
                    <button type="button" onClick={handleBack} className="btn btn-voltar text-white">
                      <h5 className="mb-0 ms-2"><i className="fa-solid fa-arrow-left me-2"/> Voltar</h5>
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${isFavorite ? 'btn-voltar' : 'btn-outline-branco'} w-auto text-white`}
                      onClick={handleToggleNotification}
                      disabled={loadingFavorite}
                    >
                      <h5 className="mb-0 ms-2">
                        <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-bell me-2`}/>
                        {loadingFavorite ? 'Processando...' : isFavorite ? 'Notificações Ativas' : 'Ativar Notificações'}
                      </h5>
                    </button>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4 mb-4">
                    <h1 className="game-title fw-bold text-white text-start mt-5 mt-md-4">
                      {gameData.name}
                    </h1>
                    <div className="d-flex text-white justify-content-center justify-content-md-start">
                      <h4 id="game-tournament">Principal Torneio: {gameData.tournament}</h4>
                    </div>
                    <h5 id="game-descricao" className="text-white texto-justificado mt-3 mb-3">
                      {gameData.description || gameData.descricao}
                    </h5>
                  </div>
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

      {/* Lista de próximos jogos (cards) */}
      <section className="container">
        <div className="row g-4" id="cards-container">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((item, idx) => (
              <div
                key={idx}
                className="col-12 col-md-6 col-lg-4"
                onClick={() => {
                  if (item.link) window.open(item.link, '_blank');
                }}
              >
                <div className="card border-0 rounded-4 bg-dark text-white h-100">
                  <div className="card-body bg-dark p-4 rounded-5">
                    <h5 className="card-title text-primary fw-bold mb-3">
                      {item.campeonato}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="text-center">
                        <div style={{ width: 48, height: 48, position: 'relative', margin: '0 auto' }}>
                          <Image
                            src={item.imgTime1}
                            alt={item.time1}
                            fill
                            sizes="48px"
                          />
                        </div>
                        <p className="mb-0 fw-semibold">{item.time1}</p>
                      </div>
                      <div className="fw-bold fs-4">VS</div>
                      <div className="text-center">
                        <div style={{ width: 48, height: 48, position: 'relative', margin: '0 auto' }}>
                          <Image
                            src={item.imgTime2}
                            alt={item.time2}
                            fill
                            sizes="48px"
                          />
                        </div>
                        <p className="mb-0 fw-semibold">{item.time2}</p>
                      </div>
                    </div>
                    <p className="my-2">
                      <span className="fw-bold">Data:</span> {item.data} às {item.horario}
                    </p>
                    <div className="d-grid mt-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-live btn-outline-primary rounded-pill ${isFuture(item.data, item.horario) ? 'disabled' : ''}`}
                      >
                        <h5 className="mb-0 h5-btn-trasmissao">
                          {getBotaoTexto(item.data, item.horario)}
                        </h5>
                      </a>
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
              <div className="col-12 col-md-6 mb-0 mb-md-3">
                <div className="d-flex mb-1">
                  <h5 className="fw-bold text-white me-2">Desenvolvedora:</h5>
                  <h5 className="text-cinza mb-0">{gameData.developer}</h5>
                </div>
                <div className="d-flex mb-1">
                  <h5 className="fw-bold text-white me-2">Gênero:</h5>
                  <h5 className="text-cinza mb-0">{gameData.genre}</h5>
                </div>
                <div className="d-flex mb-1">
                  <h5 className="fw-bold text-white me-2">Lançamento:</h5>
                  <h5 className="text-cinza mb-0">{gameData.release}</h5>
                </div>
                <div className="d-flex mb-1">
                  <h5 className="fw-bold text-white me-2">Campeonatos:</h5>
                  <h5 className="text-cinza mb-0">{championshipData.length} campeonatos</h5>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="d-flex mb-2">
                  <h5 className="fw-bold text-white me-2">Tags:</h5>
                  <h5 className="text-cinza mb-0">
                    {Array.isArray(gameData.tags) ? gameData.tags.join(', ') : ''}
                  </h5>
                </div>
                <div className="d-flex mb-1">
                  <h5 className="fw-bold text-white me-2">Distribuidora:</h5>
                  <h5 className="text-cinza mb-0">{gameData.publisher}</h5>
                </div>
                <div className="d-flex mb-1">
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