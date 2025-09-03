'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { getMatches } from '@/app/services/matchService';
import { getChampionships } from '@/app/services/championshipService';
import { getGames } from '@/app/services/gameService';
import { getTeamById } from '@/app/services/teamService';


function ymdToDateLocal(ymd) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseTimeFromDate(d) {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return ''; }
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState('all');
  const [gameFilter, setGameFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch from backend on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [matchesRes, champsRes] = await Promise.all([
          getMatches(0, 200),
          getChampionships(0, 200),
        ]);

        const matches = Array.isArray(matchesRes.content || matchesRes)
          ? (matchesRes.content || matchesRes)
          : (Array.isArray(matchesRes) ? matchesRes : []);

        const championships = Array.isArray(champsRes.content || champsRes)
          ? (champsRes.content || champsRes)
          : (Array.isArray(champsRes) ? champsRes : []);

        // --- Coleta de IDs de times (vários formatos possíveis) ---
        const teamIdSet = new Set();
        matches.forEach(m => {
          // campos óbvios
          if (m.team1Id) teamIdSet.add(String(m.team1Id));
          if (m.team2Id) teamIdSet.add(String(m.team2Id));

          // teamDTOS com teamId
          if (Array.isArray(m.teamDTOS)) {
            m.teamDTOS.forEach(t => {
              if (t.teamId) teamIdSet.add(String(t.teamId));
              // às vezes vem nested como t.team.id
              if (t.team && (t.team.id || t.team.teamId)) teamIdSet.add(String(t.team.id || t.team.teamId));
            });
          }

          // competitors/participants com id
          if (Array.isArray(m.competitors)) {
            m.competitors.forEach(c => { if (c.teamId) teamIdSet.add(String(c.teamId)); if (c.id) teamIdSet.add(String(c.id)); });
          }
          if (Array.isArray(m.participants)) {
            m.participants.forEach(p => { if (p.teamId) teamIdSet.add(String(p.teamId)); if (p.id) teamIdSet.add(String(p.id)); });
          }

          // campos homeTeam/awayTeam que podem conter apenas id
          if (m.homeTeam && (typeof m.homeTeam === 'number' || typeof m.homeTeam === 'string')) teamIdSet.add(String(m.homeTeam));
          if (m.awayTeam && (typeof m.awayTeam === 'number' || typeof m.awayTeam === 'string')) teamIdSet.add(String(m.awayTeam));
          if (m.home && (typeof m.home === 'number' || typeof m.home === 'string')) teamIdSet.add(String(m.home));
          if (m.away && (typeof m.away === 'number' || typeof m.away === 'string')) teamIdSet.add(String(m.away));
        });

        // --- Busca nomes por ID (paralelo) ---
        const teamIds = Array.from(teamIdSet);
        const teamMap = {}; // id -> nome
        if (teamIds.length > 0) {
          // faz todas as requisições em paralelo; usamos Promise.allSettled para não falhar tudo se um id der erro
          const promises = teamIds.map(id => getTeamById(id).then(res => ({ id, res })).catch(err => ({ id, err })));
          const results = await Promise.all(promises);
          results.forEach(r => {
            if (r.res) {
              const t = r.res;
              // tenta extrair o nome do time de várias keys possíveis
              const name = t.name || t.teamName || t.title || t.fullName || t.shortName || (t.data && t.data.name) || null;
              teamMap[String(r.id)] = name || `Time ${r.id}`;
            } else {
              console.warn('[Calendar] falha ao buscar team:', r.id, r.err);
              teamMap[String(r.id)] = `Time ${r.id}`;
            }
          });
        }

        // --- Agora mapeia matches usando teamMap quando necessário ---
        const mappedMatches = matches.map((m) => {
          let dateStr = '';
          let timeStr = '';

          if (m.date && m.time) {
            dateStr = m.date;
            timeStr = m.time;
          } else if (m.date) {
            try {
              const dt = new Date(m.date);
              if (!isNaN(dt.getTime())) {
                dateStr = toYMD(dt);
                timeStr = parseTimeFromDate(m.date);
              } else dateStr = m.date;
            } catch (e) { dateStr = m.date; }
          } else if (m.dateTime || m.dateHour || m.matchDate) {
            const dtVal = m.dateTime || m.dateHour || m.matchDate;
            const dt = new Date(dtVal);
            if (!isNaN(dt.getTime())) {
              dateStr = toYMD(dt);
              timeStr = parseTimeFromDate(dtVal);
            } else {
              dateStr = (dtVal || '').split('T')[0] || '';
            }
          }

          // Extrai nomes de times — agora resolve IDs via teamMap
          const teamsArr = [];

          // 1) teamDTOS (pode ter teamName ou teamId)
          if (Array.isArray(m.teamDTOS) && m.teamDTOS.length) {
            m.teamDTOS.forEach(t => {
              if (t.teamName) teamsArr.push(String(t.teamName));
              else if (t.name) teamsArr.push(String(t.name));
              else if (t.team && (t.team.name || t.team.title)) teamsArr.push(String(t.team.name || t.team.title));
              else if (t.teamId) teamsArr.push(teamMap[String(t.teamId)] || String(t.teamId));
            });
          }

          // 2) team1/team2 ou home/away (podem ser objetos ou ids)
          const readMaybe = (v) => {
            if (!v) return null;
            if (typeof v === 'string' || typeof v === 'number') return String(v);
            if (v.name) return v.name;
            if (v.teamName) return v.teamName;
            if (v.title) return v.title;
            if (v.id) return String(v.id);
            return null;
          };

          if (teamsArr.length === 0) {
            const t1 = readMaybe(m.team1) || (m.team1Id ? teamMap[String(m.team1Id)] : null);
            const t2 = readMaybe(m.team2) || (m.team2Id ? teamMap[String(m.team2Id)] : null);
            if (t1) teamsArr.push(t1);
            if (t2) teamsArr.push(t2);
          }

          if (teamsArr.length === 0) {
            const h = readMaybe(m.homeTeam) || (m.homeTeam && teamMap[String(m.homeTeam)]) || (m.home && teamMap[String(m.home)]);
            const a = readMaybe(m.awayTeam) || (m.awayTeam && teamMap[String(m.awayTeam)]) || (m.away && teamMap[String(m.away)]);
            if (h) teamsArr.push(h);
            if (a) teamsArr.push(a);
          }

          // 3) participants/competitors arrays
          if (teamsArr.length === 0 && Array.isArray(m.participants) && m.participants.length) {
            m.participants.forEach(p => {
              const n = p.name || p.teamName || (p.team && (p.team.name || p.team.title)) || (p.id ? teamMap[String(p.id)] : null);
              if (n) teamsArr.push(String(n));
            });
          }
          if (teamsArr.length === 0 && Array.isArray(m.competitors) && m.competitors.length) {
            m.competitors.forEach(c => {
              const n = c.name || c.teamName || (c.team && (c.team.name || c.team.title)) || (c.id ? teamMap[String(c.id)] : null);
              if (n) teamsArr.push(String(n));
            });
          }

          // 4) se ainda vazio, tente campos simples
          if (teamsArr.length === 0 && m.team) {
            const n = readMaybe(m.team) || (m.team.id ? teamMap[String(m.team.id)] : null);
            if (n) teamsArr.push(n);
          }

          // extrai campeonato / torneio
          const championshipName =
            (m.championship && (m.championship.name || m.championship)) ||
            m.championshipName ||
            m.tournament?.name ||
            m.tournamentName ||
            m.league?.name ||
            m.leagueName ||
            '';

          const gameName = m.game?.name || m.gameName || m.game || '';

          // monta título conforme solicitado
          let title = '';
          if (teamsArr.length >= 2) {
            title = `${teamsArr[0]} vs ${teamsArr[1]}`;
            if (championshipName) title += ` - ${championshipName}`;
          } else if (teamsArr.length === 1) {
            title = teamsArr[0];
            if (championshipName) title += ` - ${championshipName}`;
            else if (!title) title = m.title || gameName || `Partida ${m.id || ''}`;
          } else {
            title = championshipName || m.title || gameName || `Partida ${m.id || ''}`;
            console.warn('[Calendar] fallback title used for match id:', m.id, '-> title:', title, 'raw:', m);
          }

          return {
            id: `match-${m.id}`,
            title,
            date: dateStr || '',
            time: timeStr || '',
            type: 'partida',
            championship: championshipName,
            game: gameName,
            teams: teamsArr,
            raw: m,
          };
        });

        const mappedChamps = championships.map((c) => {
          let dateStr = '';
          let timeStr = '';
          if (c.startDate) {
            const dt = new Date(c.startDate);
            if (!isNaN(dt.getTime())) {
              dateStr = toYMD(dt);
              timeStr = parseTimeFromDate(c.startDate);
            } else {
              dateStr = c.startDate;
            }
          } else if (c.date) {
            try {
              const dt = new Date(c.date);
              if (!isNaN(dt.getTime())) {
                dateStr = toYMD(dt);
                timeStr = parseTimeFromDate(c.date);
              } else dateStr = c.date;
            } catch (e) { dateStr = c.date; }
          }
          const gameName = c.game?.name || c.gameName || c.game || '';
          return {
            id: `champ-${c.id}`,
            title: c.name || c.title || `Campeonato ${c.id}`,
            date: dateStr || '',
            time: timeStr || '',
            type: 'campeonato',
            championship: c.name || '',
            game: gameName,
            teams: [],
            raw: c,
          };
        });

        const combined = [...mappedMatches, ...mappedChamps].filter(ev => ev.date);
        if (!cancelled) setEvents(combined);
      } catch (err) {
        console.error('Erro carregando eventos do backend:', err);
        if (!cancelled) setError(err.message || 'Erro ao carregar eventos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => { cancelled = true; };
  }, []);

  // games derivado dinamicamente
  const games = useMemo(() => {
    const s = new Set();
    events.forEach((e) => { if (e.game) s.add(e.game); });
    return ['all', ...Array.from(s)];
  }, [events]);

  // Filtragem (mantém comportamento "all" = tudo)
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (typeFilter !== 'all' && ev.type !== typeFilter) return false;
      if (gameFilter !== 'all' && ev.game !== gameFilter) return false;
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        const teamsStr = (ev.teams || []).join(' ').toLowerCase();
        if (!ev.title.toLowerCase().includes(q) && !ev.championship.toLowerCase().includes(q) && !teamsStr.includes(q)) return false;
      }
      return true;
    });
  }, [events, typeFilter, gameFilter, query]);

  function buildMonthGrid(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const end = new Date(last);
    end.setDate(last.getDate() + (6 - last.getDay()));
    const grid = [];
    let cur = new Date(start);
    while (cur <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      grid.push(week);
    }
    return grid;
  }

  const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  // Mapa por chave 'YYYY-MM-DD'
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!ev.date) return;
      map[ev.date] = map[ev.date] || [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  function prevMonth() { setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)); setSelectedDate(null); }
  function nextMonth() { setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)); setSelectedDate(null); }
  function isSameMonth(d, ref) { return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear(); }
  function formatMonthTitle(d) { return d.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }); }

  const eventsForSelectedDate = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  function getIndicatorType(events) {
    if (!events || events.length === 0) return null;
    if (events.some(e => e.type === 'partida')) return 'partida';
    if (events.some(e => e.type === 'campeonato')) return 'campeonato';
    return 'time';
  }

  return (
    <div className="container my-5">
      <link rel="stylesheet" href="/css/calendario.css" />

      <div className="row mb-3 align-items-center">
        <div className="col-12 col-md-6">
          <h1 className="fw-bold mb-1" style={{ color: '#fff' }}>Calendário de Partidas</h1>
          <p className="text-white">Filtre o que quer ver no calendário e clique em um dia para ver detalhes.</p>
        </div>

        <div className="col-12 col-md-6 d-flex text-md-end">
          <div className="row w-100">
            <div className="col-12 col-md-6 mb-2">
              <select className="form-select rounded-5 cursor-pointer bg-dark text-white border  filter-pill" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Todos os tipos</option>
                <option value="partida">Próximas partidas</option>
                <option value="campeonato">Campeonatos</option>
                <option value="time">Partidas de time/jogador</option>
              </select>
            </div>

            <div className="col-12 col-md-6 mb-2">
              <select className="form-select rounded-5 cursor-pointer bg-dark text-white border filter-pill" value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
                {games.map((g) => (<option key={g} value={g}>{g === 'all' ? 'Todos os jogos' : g}</option>))}
              </select>
            </div>

            <div className="col-12 mt-1">
              <input className="form-control rounded-5 cursor-pointer bg-dark text-white border filter-pill" placeholder="Pesquisar (time, campeonato...)" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="text-white mb-3">Carregando eventos...</div>}
      {error && <div className="text-danger mb-3">Erro: {error}</div>}

      <div className="calendar-wrapper">
        <div className="row">
          <div className="col-12 col-md-9 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
              <h4 className="mb-0 text-white">{formatMonthTitle(currentMonth)}</h4>
              <div className="mb-2">
                <button className="btn btn-outline-primary me-2 mb-1" onClick={prevMonth}>← Voltar</button>
                <button className="btn btn-outline-primary mb-1" onClick={nextMonth}>Avançar →</button>
              </div>
            </div>

            <div className="calendar-scroll">
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th>
                  </tr>
                </thead>
                <tbody>
                  {monthGrid.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day) => {
                        const y = day.getFullYear();
                        const m = (day.getMonth() + 1).toString().padStart(2, '0');
                        const d = day.getDate().toString().padStart(2, '0');
                        const dateKey = `${y}-${m}-${d}`;
                        const eventsOnDay = eventsByDate[dateKey] || [];
                        const inactive = !isSameMonth(day, currentMonth);
                        const isSelected = selectedDate === dateKey;
                        const indicatorType = getIndicatorType(eventsOnDay);
                        const visibleEvents = eventsOnDay.slice(0, 2);
                        const remaining = eventsOnDay.length - visibleEvents.length;

                        return (
                          <td key={dateKey}>
                            <div
                              className={`calendar-day ${inactive ? 'inactive' : ''} ${isSelected ? 'selected' : ''}`}
                              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                            >
                              {indicatorType && <span className={`event-indicator ind-${indicatorType}`} title={`${eventsOnDay.length} evento(s)`} />}

                              <div className="d-flex justify-content-between align-items-start">
                                <div className="day-number">{day.getDate()}</div>
                                <div style={{ fontSize: 12 }} className="text-muted">{eventsOnDay.length > 0 ? `${eventsOnDay.length}` : ''}</div>
                              </div>

                              <div className="mt-2 day-events">
                                {eventsOnDay.length === 0 && <div className="day-empty">✦</div>}

                                {visibleEvents.map((ev) => (
                                  <div key={ev.id} className={`badge-event ${ev.type === 'campeonato' ? 'type-campeonato' : ev.type === 'partida' ? 'type-partida' : 'type-time'}`}>
                                    <span className="event-dot" />
                                    <div className="d-flex " style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      <small style={{ color: '#fff' }}>{ev.time ? `${ev.time} • ` : ''}{ev.title}</small>
                                      <div className="small text-muted">{ev.game}</div>
                                    </div>
                                  </div>
                                ))}

                                {remaining > 0 && (
                                  <div className="more-events">+{remaining} mais</div>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="sidebar-card mb-3">
              <h5>Detalhes do Dia</h5>

              {selectedDate ? (
                <>
                  <div className="mb-2">
                    <strong>
                      {ymdToDateLocal(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </strong>
                  </div>

                  {eventsForSelectedDate.length === 0 && <div className="text-white small">Nenhum evento para essa data.</div>}

                  {eventsForSelectedDate.map((ev) => (
                    <div key={ev.id} className="card bg-dark text-light mb-2" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-bold">{ev.title}</div>
                            <div className="small text-white">{ev.championship || ev.game}</div>
                          </div>
                          <div className="text-end">
                            <div className="small">{ev.time}</div>
                            <div className="small text-white">{ev.game}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="d-grid mt-2">
                    <button className="btn btn-outline-light btn-sm" onClick={() => setSelectedDate(null)}>Fechar</button>
                  </div>
                </>
              ) : (
                <div className="text-white small">Nenhuma data selecionada.</div>
              )}
            </div>

            <div className="sidebar-card">
              <h5>Próximos eventos</h5>
              {filteredEvents.length === 0 && <div className="small text-white">Sem eventos</div>}
              {filteredEvents.slice(0, 6).map((ev) => (
                <div key={ev.id} className="d-flex align-items-start mb-2">
                  <div style={{ width: 8, height: 8, borderRadius: 8, background: '#1ea7ff', marginRight: 8, marginTop: 6 }} />
                  <div>
                    <div className="small fw-bold">{ev.title}</div>
                    <div className="tiny text-white" style={{ fontSize: 12 }}>{ev.date} • {ev.time} • {ev.game}</div>
                  </div>
                </div>
              ))}

              <div className="mt-3">
                <button className="btn btn-primary btn-sm w-100" onClick={() => {
                  if (filteredEvents.length > 0) {
                    const d = ymdToDateLocal(filteredEvents[0].date);
                    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                    setSelectedDate(filteredEvents[0].date);
                  }
                }}>Ir para primeiro evento</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
