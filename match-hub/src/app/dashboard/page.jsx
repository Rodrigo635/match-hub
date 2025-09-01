"use client";
import { useState, useEffect } from "react";
import { handleGetUser } from "../global/global";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

// Função que gera os dados de crescimento exponencial
function generateUserGrowthData(U0, r, months = 12) {
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  return Array.from({ length: months }, (_, t) => ({
    name: monthNames[t],
    users: Math.round(U0 * Math.pow(1 + r, t + 1)),
    growth: t === 0 ? 0 : Math.round((U0 * Math.pow(1 + r, t + 1) - U0 * Math.pow(1 + r, t)) / (U0 * Math.pow(1 + r, t)) * 100)
  }));
}

// Dados de exemplo para receita
function generateRevenueData(usersData, ARPU = 5) {
  return usersData.map(item => ({
    name: item.name,
    revenue: item.users * ARPU,
    users: item.users
  }));
}

// Dados de exemplo para Pie Chart
const pieData = [
  { name: 'Usuários Ativos', value: 68, color: '#0ea5e9' },
  { name: 'Usuários Inativos', value: 22, color: '#ef4444' },
  { name: 'Novos Usuários', value: 10, color: '#22c55e' },
];

const COLORS = ['#0ea5e9', '#ef4444', '#22c55e'];

// Dados simulados para métricas adicionais
const engagementData = [
  { name: 'Dom', sessions: 2100, duration: 25 },
  { name: 'Seg', sessions: 1800, duration: 32 },
  { name: 'Ter', sessions: 1900, duration: 20 },
  { name: 'Qua', sessions: 1500, duration: 22 },
  { name: 'Qui', sessions: 2100, duration: 30 },
  { name: 'Sex', sessions: 2800, duration: 40 },
  { name: 'Sáb', sessions: 2400, duration: 35 },
];

export default function DashboardPage() {
  const [growthRate, setGrowthRate] = useState(0.05);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const initialUsers = 1000;

  const router = useRouter();
  const userData = generateUserGrowthData(initialUsers, growthRate);
  const revenueData = generateRevenueData(userData);


  useEffect(() => {
    async function fetchUser() {
      const user = await handleGetUser({ setToken, setUser });
      if (!user) {
        router.push("/cadastro");
        return;
      }

      if (user.role !== "ADMIN") {
        router.push("/perfil");
        return;
      }

      setUser(user);
    }

    fetchUser();
  }, []);

  // Calcular métricas
  const finalUsers = userData[userData.length - 1].users;
  const totalRevenue = finalUsers * 5;
  const avgGrowth = userData.reduce((acc, curr) => acc + curr.growth, 0) / userData.length;

  const customStyles = {
    body: {
      background: '#1e1e1e',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logo: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '8px'
    },
    controlPanel: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    kpiCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid',
      position: 'relative',
      overflow: 'hidden'
    },
    kpiCardBlue: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.2)'
    },
    kpiCardGreen: {
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
      borderColor: 'rgba(34, 197, 94, 0.2)'
    },
    kpiCardPurple: {
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
      borderColor: 'rgba(168, 85, 247, 0.2)'
    },
    kpiCardOrange: {
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
      borderColor: 'rgba(249, 115, 22, 0.2)'
    },
    chartContainer: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    decorativeCircle: {
      width: '96px',
      height: '96px',
      borderRadius: '50%',
      position: 'absolute',
      top: '-48px',
      right: '-48px'
    },
    iconContainer: {
      padding: '12px',
      borderRadius: '8px'
    },
    input: {
      width: '80px',
      background: 'rgba(51, 65, 85, 0.5)',
      border: '1px solid #475569',
      borderRadius: '8px',
      color: '#fff'
    },
    statusDot: {
      width: '12px',
      height: '12px',
      backgroundColor: '#22c55e',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    legend: {
      width: '12px',
      height: '12px',
      borderRadius: '4px'
    }
  };

  return (
    <div className="bg-escuro" style={customStyles.body}>
      {/* Bootstrap CSS */}
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div className="container">


        {/* HEADER */}
        <header style={customStyles.header} className="px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <h1 className="h3 fw-bold text-white mb-1">Match Hub Analytics</h1>
                <p className="text-light small mb-0">Dashboard de Performance e Crescimento</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTROLES */}
        <div className="px-4 py-3">
          <div style={customStyles.controlPanel} className="p-3">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="d-flex align-items-center">
                <label className="text-light fw-medium me-2">Taxa de Crescimento Mensal:</label>
                <div className="position-relative">
                  <input
                    type="number"
                    value={(growthRate * 100).toFixed(1)}
                    onChange={(e) => setGrowthRate(Number(e.target.value) / 100)}
                    style={customStyles.input}
                    className="form-control px-3 py-2 fw-medium"
                  />
                  <span className="position-absolute top-50 translate-middle-y text-muted small" style={{ right: '12px' }}>%</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div style={customStyles.statusDot} className="pulse-animation me-2"></div>
                <span className="text-light small">Dados em tempo real</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="px-4 pb-4">

          {/* KPI CARDS */}
          <div className="d-flex flex-wrap mb-4" style={{ gap: '1.5rem' }}>
            {/* Usuários Totais */}
            <div className="flex-fill" style={{ ...customStyles.kpiCard, ...customStyles.kpiCardBlue, minWidth: '250px' }}>
              <div style={{ ...customStyles.decorativeCircle, background: 'rgba(59, 130, 246, 0.1)' }}></div>
              <div className="p-3 position-relative" style={{ zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ ...customStyles.iconContainer, background: 'rgba(59, 130, 246, 0.2)' }}>
                    <svg style={{ width: '24px', height: '24px' }} className="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="text-success small fw-medium">+{(growthRate * 100).toFixed(1)}%</span>
                </div>
                <h3 className="text-light small mb-1">Usuários Totais</h3>
                <p className="text-white h2 fw-bold mb-1">{finalUsers.toLocaleString()}</p>
                <p style={{ fontSize: '0.75rem' }}>Projeção 12 meses</p>
              </div>
            </div>

            {/* Receita */}
            <div className="flex-fill" style={{ ...customStyles.kpiCard, ...customStyles.kpiCardGreen, minWidth: '250px' }}>
              <div style={{ ...customStyles.decorativeCircle, background: 'rgba(34, 197, 94, 0.1)' }}></div>
              <div className="p-3 position-relative" style={{ zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ ...customStyles.iconContainer, background: 'rgba(34, 197, 94, 0.2)' }}>
                    <svg style={{ width: '24px', height: '24px' }} className="text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-success small fw-medium">MRR</span>
                </div>
                <h3 className="text-light small mb-1">Receita Estimada</h3>
                <p className="text-white h2 fw-bold mb-1">R$ {totalRevenue.toLocaleString()}</p>
                <p style={{ fontSize: '0.75rem' }}>ARPU: R$ 5,00</p>
              </div>
            </div>

            {/* Taxa Crescimento */}
            <div className="flex-fill" style={{ ...customStyles.kpiCard, ...customStyles.kpiCardPurple, minWidth: '250px' }}>
              <div style={{ ...customStyles.decorativeCircle, background: 'rgba(168, 85, 247, 0.1)' }}></div>
              <div className="p-3 position-relative" style={{ zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ ...customStyles.iconContainer, background: 'rgba(168, 85, 247, 0.2)' }}>
                    <svg style={{ width: '24px', height: '24px' }} className="text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-light small fw-medium">Mensal</span>
                </div>
                <h3 className="text-light small mb-1">Crescimento Médio</h3>
                <p className="text-white h2 fw-bold mb-1">{avgGrowth.toFixed(1)}%</p>
                <p style={{ fontSize: '0.75rem' }}>Últimos 12 meses</p>
              </div>
            </div>

            {/* Engajamento */}
            <div className="flex-fill" style={{ ...customStyles.kpiCard, ...customStyles.kpiCardOrange, minWidth: '250px' }}>
              <div style={{ ...customStyles.decorativeCircle, background: 'rgba(249, 115, 22, 0.1)' }}></div>
              <div className="p-3 position-relative" style={{ zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ ...customStyles.iconContainer, background: 'rgba(249, 115, 22, 0.2)' }}>
                    <svg style={{ width: '24px', height: '24px' }} className="text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-warning small fw-medium">68%</span>
                </div>
                <h3 className="text-light small mb-1">Taxa de Engajamento</h3>
                <p className="text-white h2 fw-bold mb-1">32 min</p>
                <p style={{ fontSize: '0.75rem' }}>Sessão média</p>
              </div>
            </div>
          </div>

          {/* GRÁFICOS PRINCIPAIS */}
          <div className="d-flex flex-wrap mb-4" style={{ gap: '1.5rem' }}>

            {/* Crescimento de Usuários - Área Chart */}
            <div className="flex-fill" style={{ ...customStyles.chartContainer, flex: '2', minWidth: '400px' }}>
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h2 className="h5 fw-semibold text-white mb-1">Crescimento de Usuários</h2>
                    <p className="text-light small mb-0">Projeção baseada na taxa de crescimento atual</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ ...customStyles.legend, backgroundColor: '#3b82f6' }} className="me-2"></div>
                    <span className="text-light small">Usuários</span>
                  </div>
                </div>
                <div style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorUsers)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Distribuição de Usuários */}
            <div className="flex-fill" style={{ ...customStyles.chartContainer, minWidth: '320px' }}>
              <div className="p-3">
                <div className="mb-3">
                  <h2 className="h5 fw-semibold text-white mb-1">Status dos Usuários</h2>
                  <p className="text-light small mb-0">Distribuição atual da base</p>
                </div>
                <div style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="d-flex flex-column" style={{ gap: '0.75rem' }}>
                  {pieData.map((item, index) => (
                    <div key={item.name} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            ...customStyles.legend,
                            backgroundColor: COLORS[index]
                          }}
                          className="me-2"
                        ></div>
                        <span className="text-light small">{item.name}</span>
                      </div>
                      <span className="text-white fw-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GRÁFICOS SECUNDÁRIOS */}
          <div className="d-flex flex-wrap" style={{ gap: '1.5rem' }}>

            {/* Receita Mensal */}
            <div className="flex-fill" style={{ ...customStyles.chartContainer, minWidth: '400px' }}>
              <div className="p-3">
                <div className="mb-3">
                  <h2 className="h5 fw-semibold text-white mb-1">Receita Projetada</h2>
                  <p className="text-light small mb-0">Baseada no ARPU de R$ 5,00</p>
                </div>
                <div style={{ height: '288px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Engajamento Semanal */}
            <div className="flex-fill" style={{ ...customStyles.chartContainer, minWidth: '400px' }}>
              <div className="p-3">
                <div className="mb-3">
                  <h2 className="h5 fw-semibold text-white mb-1">Engajamento Semanal</h2>
                  <p className="text-light small mb-0">Sessões e tempo médio por dia</p>
                </div>
                <div style={{ height: '288px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}