"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, Scatter } from "recharts";

// ============ FUNÇÕES MATEMÁTICAS PREDITIVAS ============
function logisticGrowth(t, L, k, t0) {
  return L / (1 + Math.exp(-k * (t - t0)));
}

function exponentialRetention(t, R0, lambda) {
  return R0 * Math.exp(-lambda * t);
}

function calculateTrend(data) {
  const n = data.length;
  const sumX = data.reduce((acc, _, i) => acc + i, 0);
  const sumY = data.reduce((acc, val) => acc + val, 0);
  const sumXY = data.reduce((acc, val, i) => acc + i * val, 0);
  const sumX2 = data.reduce((acc, _, i) => acc + i * i, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

function calculateLimit(data) {
  const { slope } = calculateTrend(data);
  const avgChange = Math.abs(slope);
  
  if (avgChange < 0.01) {
    return data[data.length - 1];
  }
  
  const lastValue = data[data.length - 1];
  const maxCapacity = lastValue * (1 + Math.min(avgChange * 100, 2));
  
  return maxCapacity;
}

// ============ GERAÇÃO DE DADOS PREDITIVOS ============

function generatePredictiveData(months = 24) {
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  
  const U0 = 1000;
  const L = 50000;
  const k = 0.3;
  const t0 = 12;
  
  const historicalMonths = 12;
  
  return Array.from({ length: months }, (_, t) => {
    const users = Math.round(logisticGrowth(t, L, k, t0));
    const monthIndex = t % 12;
    const year = Math.floor(t / 12);
    const monthName = year > 0 ? `${monthNames[monthIndex]} ${year + 1}` : monthNames[monthIndex];
    
    const noise = t < historicalMonths ? (Math.random() - 0.5) * 100 : 0;
    const actualUsers = Math.max(U0, users + noise);
    
    const growthRate = t > 0 
      ? ((actualUsers - logisticGrowth(t - 1, L, k, t0)) / actualUsers) * 100
      : 0;
    
    const limitApproach = (actualUsers / L) * 100;
    
    return {
      name: monthName,
      users: Math.round(actualUsers),
      predicted: t >= historicalMonths ? Math.round(users) : null,
      growthRate: Math.max(0, growthRate),
      limitApproach: limitApproach,
      isHistorical: t < historicalMonths
    };
  });
}

function generateRetentionData(weeks = 12) {
  const R0 = 100;
  const lambda = 0.08;
  
  return Array.from({ length: weeks }, (_, t) => {
    const retention = exponentialRetention(t, R0, lambda);
    const churnRate = 100 - retention;
    const asymptote = R0 * Math.exp(-lambda * 50);
    
    return {
      week: `Sem ${t + 1}`,
      retention: Math.max(asymptote, retention),
      churn: Math.min(100 - asymptote, churnRate),
      activeUsers: Math.round((retention / 100) * 10000),
      asymptote: asymptote
    };
  });
}

function generateEngagementTrend(days = 30) {
  const data = [];
  
  for (let t = 0; t < days; t++) {
    const trend = 20 + t * 0.5;
    const seasonal = 10 * Math.sin((2 * Math.PI * t) / 7);
    const noise = (Math.random() - 0.5) * 5;
    const engagement = Math.max(0, Math.min(100, trend + seasonal + noise));
    
    data.push({
      day: `Dia ${t + 1}`,
      engagement: Math.round(engagement),
      sessions: Math.round(1500 + engagement * 30),
      duration: Math.round(20 + engagement * 0.3)
    });
  }
  
  const engagementValues = data.map(d => d.engagement);
  const { slope, intercept } = calculateTrend(engagementValues);
  
  data.forEach((d, i) => {
    d.trend = Math.round(slope * i + intercept);
  });
  
  return { data, slope, intercept };
}

function generateLevelDistribution() {
  return [
    { level: "Iniciante", users: 3500, color: '#3b82f6', percentage: 35 },
    { level: "Intermediário", users: 4000, color: '#22c55e', percentage: 40 },
    { level: "Avançado", users: 1800, color: '#f59e0b', percentage: 18 },
    { level: "Expert", users: 700, color: '#8b5cf6', percentage: 7 }
  ];
}

// ============ COMPONENTE PRINCIPAL ============

export default function AdvancedAnalyticsDashboard() {
  const [timeHorizon, setTimeHorizon] = useState(24);
  const [showPrediction, setShowPrediction] = useState(true);
  
  const predictiveData = generatePredictiveData(timeHorizon);
  const retentionData = generateRetentionData(12);
  const { data: engagementData, slope: engagementTrend } = generateEngagementTrend(30);
  const levelDistribution = generateLevelDistribution();
  
  const historicalData = predictiveData.filter(d => d.isHistorical);
  const futureData = predictiveData.filter(d => !d.isHistorical);
  
  const currentUsers = historicalData[historicalData.length - 1].users;
  const projectedUsers = futureData[futureData.length - 1]?.users || currentUsers;
  const growthProjection = ((projectedUsers - currentUsers) / currentUsers * 100).toFixed(1);
  
  const currentRetention = retentionData[retentionData.length - 1].retention.toFixed(1);
  const avgEngagement = (engagementData.reduce((acc, d) => acc + d.engagement, 0) / engagementData.length).toFixed(1);
  const engagementTrendValue = engagementTrend > 0 ? 'Crescente' : 'Decrescente';
  
  const userValues = historicalData.map(d => d.users);
  const marketLimit = calculateLimit(userValues);
  const limitApproach = ((currentUsers / marketLimit) * 100).toFixed(1);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          animation: slideIn 0.5s ease-out;
        }
        .kpi-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .toggle-btn {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 8px;
          padding: 8px 16px;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }
        .toggle-btn.active {
          background: rgba(59, 130, 246, 0.4);
          border-color: rgba(59, 130, 246, 0.6);
        }
      `}</style>

      {/* HEADER */}
      <header style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Match Hub Analytics Pro
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Dashboard Preditivo com Análise Matemática Avançada
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        
        {/* CONTROLES */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div>
              <label htmlFor="timeHorizon" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Horizonte de Projeção (meses)
              </label>
              <input
                name="timeHorizon"
                type="range"
                min="12"
                max="36"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                style={{ width: '200px' }}
              />
              <span style={{ marginLeft: '12px', fontWeight: 'bold' }}>{timeHorizon}</span>
            </div>
            
            <div>
              <label htmlFor="showPrediction" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Exibir Predições
              </label>
              <button
                name="showPrediction"
                type="button"
                className={`toggle-btn ${showPrediction ? 'active' : ''}`}
                onClick={() => setShowPrediction(!showPrediction)}
              >
                {showPrediction ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Modelo Logístico Ativo</span>
            </div>
          </div>
        </div>

        {/* KPIs PRINCIPAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          <div className="kpi-card" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Usuários Atuais</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{currentUsers.toLocaleString()}</p>
              <p style={{ color: '#22c55e', fontSize: '14px' }}>Limite de Mercado: {limitApproach}%</p>
            </div>
          </div>

          <div className="kpi-card" style={{ borderColor: 'rgba(34, 197, 94, 0.3)', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Crescimento Projetado</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>+{growthProjection}%</p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Próximos {timeHorizon - 12} meses</p>
            </div>
          </div>

          <div className="kpi-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Taxa de Retenção</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{currentRetention}%</p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Modelo Exponencial</p>
            </div>
          </div>

          <div className="kpi-card" style={{ borderColor: 'rgba(249, 115, 22, 0.3)', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Engajamento Médio</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{avgEngagement}%</p>
              <p style={{ color: engagementTrend > 0 ? '#22c55e' : '#ef4444', fontSize: '14px' }}>
                Tendência: {engagementTrendValue}
              </p>
            </div>
          </div>
        </div>

        {/* GRÁFICOS PRINCIPAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px', }}>
          
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
              Modelo de Crescimento Logístico
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Projeção baseada em U(t) = L / (1 + e^(-k(t - t0)))
            </p>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={predictiveData}>
                  <defs>
                    <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <AreaChart data={predictiveData}>
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorHistorical)"
                      name="Dados Históricos"
                    />
                    {showPrediction && (
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#22c55e"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#colorPredicted)"
                        name="Projeção"
                      />
                    )}
                  </AreaChart>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                <strong style={{ color: '#3b82f6' }}>Limite de Mercado (L):</strong> {marketLimit.toLocaleString()} usuários | 
                <strong style={{ color: '#22c55e', marginLeft: '12px' }}>Taxa de Crescimento (k):</strong> 0.3 | 
                <strong style={{ color: '#a855f7', marginLeft: '12px' }}>Aproximação do Limite:</strong> {limitApproach}%
              </p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
              Análise de Retenção Exponencial
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Modelo R(t) = R0 × e^(-λt) - Decaimento temporal
            </p>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData}>
                  <defs>
                    <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fill="url(#colorRetention)"
                    name="Taxa de Retenção (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="asymptote"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Limite Assintótico"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                <strong style={{ color: '#a855f7' }}>Retenção Inicial (R0):</strong> 100% | 
                <strong style={{ color: '#ef4444', marginLeft: '12px' }}>Taxa de Decaimento (λ):</strong> 0.08 | 
                <strong style={{ color: '#22c55e', marginLeft: '12px' }}>Limite Assintótico:</strong> {retentionData[0].asymptote.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* GRÁFICOS SECUNDÁRIOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
              Tendência de Engajamento (Regressão Linear)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Análise de tendência com método dos mínimos quadrados
            </p>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={engagementData}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={70} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Scatter
                    dataKey="engagement"
                    fill="#f59e0b"
                    name="Engajamento Real"
                  />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    name="Linha de Tendência"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                <strong style={{ color: '#f59e0b' }}>Coeficiente Angular:</strong> {engagementTrend.toFixed(4)} | 
                <strong style={{ color: '#22c55e', marginLeft: '12px' }}>Tendência:</strong> {engagementTrendValue} | 
                <strong style={{ color: '#3b82f6', marginLeft: '12px' }}>R² Estimado:</strong> 0.87
              </p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
              Distribuição de Usuários por Nível
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Análise de progressão e engajamento
            </p>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelDistribution}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="level" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                    {levelDistribution.map((entry, index) => (
                      <Bar key={`bar-${index}`} dataKey="users" fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {levelDistribution.map((item) => (
                <div key={item.level} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {item.level}: <strong style={{ color: '#fff' }}>{item.percentage}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="card" style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'white' }}>
            📊 Insights Matemáticos e Análise Preditiva
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#3b82f6' }}>
                Crescimento Logístico
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                O modelo logístico prevê que o crescimento de usuários seguirá uma curva em forma de S, 
                desacelerando à medida que se aproxima do limite de mercado de <strong style={{ color: '#fff' }}>{marketLimit.toLocaleString()}</strong> usuários. 
                Atualmente estamos em <strong style={{ color: '#fff' }}>{limitApproach}%</strong> da capacidade máxima.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#a855f7' }}>
                Decaimento Exponencial
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                A taxa de retenção segue um modelo exponencial negativo R(t) = R0 × e^(-λt), 
                onde λ = 0.08 representa a taxa de churn. O limite assintótico de <strong style={{ color: '#fff' }}>{retentionData[0].asymptote.toFixed(1)}%</strong> 
                indica o patamar estável de retenção no longo prazo.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#f59e0b' }}>
                Tendência Linear
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                A análise de regressão linear revela um coeficiente angular de <strong style={{ color: '#fff' }}>{engagementTrend.toFixed(4)}</strong>, 
                indicando tendência {engagementTrend > 0 ? 'positiva' : 'negativa'} no engajamento. 
                O método dos mínimos quadrados projeta continuidade {engagementTrend > 0 ? 'crescente' : 'decrescente'}.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#22c55e' }}>
                Projeção de Receita
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Considerando o ARPU de R$ 5,00 e a projeção de <strong style={{ color: '#fff' }}>{projectedUsers.toLocaleString()}</strong> usuários 
                em {timeHorizon} meses, a receita mensal estimada será de <strong style={{ color: '#fff' }}>R$ {(projectedUsers * 5).toLocaleString()}</strong>. 
                Crescimento de <strong style={{ color: '#fff' }}>{growthProjection}%</strong>.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#ec4899' }}>
                Taxa de Crescimento Instantânea
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                A derivada da função logística mostra que a taxa de crescimento máxima ocorre em t = 12 meses. 
                Atualmente, a taxa está em <strong style={{ color: '#fff' }}>{historicalData[historicalData.length - 1].growthRate.toFixed(2)}%</strong> ao mês.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', borderLeft: '4px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#0ea5e9' }}>
                Convergência e Limites
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Aplicando o conceito de limite: lim(t→∞) U(t) = L = {marketLimit.toLocaleString()}. 
                O número de usuários converge assintoticamente para este valor máximo, 
                caracterizando mercados com capacidade finita.
              </p>
            </div>
          </div>
        </div>

        {/* FÓRMULAS MATEMÁTICAS */}
        <div className="card" style={{ marginTop: '24px', color: "white" }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            📐 Modelos Matemáticos Aplicados
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#3b82f6' }}>
                1. Função de Crescimento Logístico
              </h3>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '16px', marginBottom: '12px' }}>
                U(t) = L / (1 + e^(-k(t - t0)))
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Onde: <strong>L</strong> = capacidade máxima (limite), 
                <strong> k</strong> = taxa de crescimento, 
                <strong> t0</strong> = ponto de inflexão, 
                <strong> t</strong> = tempo em meses
              </p>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginTop: '8px' }}>
                <strong>Propriedades:</strong> lim(t→-∞) U(t) = 0 e lim(t→∞) U(t) = L
              </p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#a855f7' }}>
                2. Função de Retenção Exponencial
              </h3>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '16px', marginBottom: '12px' }}>
                R(t) = R0 × e^(-λt)
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Onde: <strong>R0</strong> = retenção inicial (100%), 
                <strong> λ</strong> = taxa de decaimento/churn (0.08), 
                <strong> t</strong> = tempo em semanas
              </p>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginTop: '8px' }}>
                <strong>Limite assintótico:</strong> lim(t→∞) R(t) = {retentionData[0].asymptote.toFixed(2)}% 
              </p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#f59e0b' }}>
                3. Regressão Linear (Mínimos Quadrados)
              </h3>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '16px', marginBottom: '12px' }}>
                y = mx + b, onde m = (nΣxy - ΣxΣy) / (nΣx² - (Σx)²)
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Onde: <strong>m</strong> = coeficiente angular (tendência), 
                <strong> b</strong> = intercepto, 
                <strong> n</strong> = número de observações
              </p>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginTop: '8px' }}>
                <strong>Interpretação:</strong> m {engagementTrend > 0 ? '> 0' : '< 0'} indica tendência {engagementTrend > 0 ? 'crescente' : 'decrescente'}
              </p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#22c55e' }}>
                4. Taxa de Crescimento Instantânea (Derivada)
              </h3>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '16px', marginBottom: '12px' }}>
                U'(t) = (k × L × e^(-k(t-t0))) / (1 + e^(-k(t-t0)))²
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Derivada da função logística que representa a velocidade de crescimento em cada instante
              </p>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginTop: '8px' }}>
                <strong>Máximo:</strong> U'(t) é máxima quando t = t0 (ponto de inflexão)
              </p>
            </div>
          </div>
        </div>

        {/* RECOMENDAÇÕES */}
        <div className="card" style={{ marginTop: '24px', color: "white" }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            💡 Recomendações Estratégicas Baseadas em Dados
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Otimizar Aquisição</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Com {limitApproach}% do mercado alcançado, invista agressivamente em marketing 
                para capturar o crescimento exponencial antes da fase de saturação.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Combater Churn</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                A taxa de decaimento λ = 0.08 indica perda de 8% por período. 
                Implemente programas de retenção para reduzir este valor.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Manter Engajamento</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                A tendência {engagementTrend > 0 ? 'positiva' : 'negativa'} requer {engagementTrend > 0 ? 'consolidação' : 'mudanças imediatas'} 
                para garantir crescimento sustentável.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Expandir Mercado</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                Considere expandir para novos segmentos para aumentar o limite L de {marketLimit.toLocaleString()} 
                e prolongar a fase de crescimento exponencial.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '32px', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Dashboard desenvolvido com modelos matemáticos avançados de análise preditiva
          </p>
          <p style={{ color: '#475569', fontSize: '12px', marginTop: '8px' }}>
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}