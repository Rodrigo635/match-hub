'use client';
import React, { useMemo, useState } from 'react';

export default function CalendarPage() {
  const mockEvents = [
    { id: 1, title: 'Team Spirit vs Furia', date: '2025-08-20', time: '20:00', type: 'partida', championship: 'Major 2025', game: 'CS2', teams: ['Team Spirit', 'Furia'] },
    { id: 2, title: 'Worlds - Group Stage', date: '2025-08-05', time: '18:00', type: 'campeonato', championship: 'Worlds 2025', game: 'League of Legends', teams: [] },
    { id: 3, title: 'SEN vs MIBR', date: '2025-08-18', time: '18:00', type: 'partida', championship: 'VCT Americas', game: 'Valorant', teams: ['SEN', 'MIBR'] },
    { id: 4, title: 'FC24 Friendly', date: '2025-08-02', time: '16:30', type: 'time', championship: '', game: 'FC24', teams: ['Manchester City'] },
    { id: 5, title: 'Street Fighter 6 - EVO', date: '2025-08-27', time: '14:00', type: 'campeonato', championship: 'EVO 2025', game: 'Street Fighter 6', teams: [] },
    { id: 6, title: 'Valorant - Champions (Final)', date: '2025-08-30', time: '21:00', type: 'campeonato', championship: 'Champions 2025', game: 'Valorant', teams: [] },
    { id: 7, title: 'CS2 - Major 2025', date: '2025-07-30', time: '20:00', type: 'campeonato', championship: 'Major 2025', game: 'CS2', teams: [] },
    // muitos eventos no mesmo dia (exemplo)
    { id: 8, title: 'CS2 - Major 2025', date: '2025-08-20', time: '16:00', type: 'campeonato', championship: 'Major 2025', game: 'CS2', teams: [] },
    { id: 9, title: 'CS2 - Major 2025', date: '2025-08-20', time: '18:00', type: 'campeonato', championship: 'Major 2025', game: 'CS2', teams: [] },
    { id: 10, title: 'CS2 - Major 2025', date: '2025-08-20', time: '19:00', type: 'campeonato', championship: 'Major 2025', game: 'CS2', teams: [] },
    { id: 11, title: 'CS2 - Major 2025', date: '2025-08-20', time: '21:00', type: 'campeonato', championship: 'Major 2025', game: 'CS2', teams: [] },
  ];

  function ymdToDateLocal(ymd) {
    const [year, month, day] = ymd.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const [typeFilter, setTypeFilter] = useState('all');
  const [gameFilter, setGameFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDate, setSelectedDate] = useState(null);

  const games = useMemo(() => { const s = new Set(); mockEvents.forEach((e) => s.add(e.game)); return ['all', ...Array.from(s)]; }, []);

  // Filtragem (mantém comportamento "all" = tudo)
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((ev) => {
      if (typeFilter !== 'all' && ev.type !== typeFilter) return false;
      if (gameFilter !== 'all' && ev.game !== gameFilter) return false;
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        const teamsStr = (ev.teams || []).join(' ').toLowerCase();
        if (!ev.title.toLowerCase().includes(q) && !ev.championship.toLowerCase().includes(q) && !teamsStr.includes(q)) return false;
      }
      return true;
    });
  }, [mockEvents, typeFilter, gameFilter, query]);

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
              <select className="form-select filter-pill" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Todos os tipos</option>
                <option value="partida">Próximas partidas</option>
                <option value="campeonato">Campeonatos</option>
                <option value="time">Partidas de time/jogador</option>
              </select>
            </div>

            <div className="col-12 col-md-6 mb-2">
              <select className="form-select filter-pill" value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
                {games.map((g) => (<option key={g} value={g}>{g === 'all' ? 'Todos os jogos' : g}</option>))}
              </select>
            </div>

            <div className="col-12 mt-1">
              <input className="form-control filter-pill" placeholder="Pesquisar (time, campeonato...)" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

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
                    <th>Dom</th>
                    <th>Seg</th>
                    <th>Ter</th>
                    <th>Qua</th>
                    <th>Qui</th>
                    <th>Sex</th>
                    <th>Sáb</th>
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
                        const events = eventsByDate[dateKey] || [];
                        const inactive = !isSameMonth(day, currentMonth);
                        const isSelected = selectedDate === dateKey;
                        const indicatorType = getIndicatorType(events);

                        // Mobile-friendly: show only first 2 events and a "+N" when many
                        const visibleEvents = events.slice(0, 2);
                        const remaining = events.length - visibleEvents.length;

                        return (
                          <td key={dateKey}>
                            <div
                              className={`calendar-day ${inactive ? 'inactive' : ''} ${isSelected ? 'selected' : ''}`}
                              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                            >
                              {indicatorType && <span className={`event-indicator ind-${indicatorType}`} title={`${events.length} evento(s)`} />}

                              <div className="d-flex justify-content-between align-items-start">
                                <div className="day-number">{day.getDate()}</div>
                                <div style={{ fontSize: 12 }} className="text-muted">{events.length > 0 ? `${events.length}` : ''}</div>
                              </div>

                              <div className="mt-2 day-events">
                                {events.length === 0 && <div className="day-empty">✦</div>}

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
                      { ymdToDateLocal(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) }
                    </strong>
                  </div>

                  {eventsForSelectedDate.length === 0 && <div className="text-white small">Nenhum evento filtrado para essa data.</div>}

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
              <h6>Próximos eventos (filtrados)</h6>
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
