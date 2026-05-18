import { useJogadores, usePartidas } from '../hooks/useData'
import { StatCard, SectionHeader, ResultBadge } from '../components/shared/StatCard'
import { FifaCard } from '../components/players/FifaCard'
import { Trophy, Target, GitMerge, Users, Swords, Star, TrendingUp, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-white/10 text-sm">
        <p className="text-slate-400 font-semibold">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { jogadores, loading: jLoading } = useJogadores()
  const { partidas, loading: pLoading } = usePartidas()

  const totalJogos = partidas.length
  const vitorias = partidas.filter(p => p.resultado === 'vitoria').length
  const derrotas = partidas.filter(p => p.resultado === 'derrota').length
  const empates = partidas.filter(p => p.resultado === 'empate').length
  const totalGols = partidas.reduce((acc, p) => acc + (p.placar_nos || 0), 0)
  const taxaVitoria = totalJogos > 0 ? Math.round((vitorias / totalJogos) * 100) : 0

  const topArtilheiro = [...jogadores].sort((a, b) => b.gols - a.gols)[0]
  const topAssistente = [...jogadores].sort((a, b) => b.assistencias - a.assistencias)[0]
  const topMVP = [...jogadores].sort((a, b) => b.mvps - a.mvps)[0]
  const topOverall = [...jogadores].sort((a, b) => b.overall - a.overall).slice(0, 3)

  // Chart data - top 6 jogadores
  const chartData = [...jogadores]
    .sort((a, b) => b.gols - a.gols)
    .slice(0, 6)
    .map(j => ({
      name: j.nome.split(' ')[0],
      Gols: j.gols,
      Assistências: j.assistencias,
    }))

  // Últimas 5 partidas para gráfico de resultados
  const resultadosData = [...partidas]
    .slice(0, 8)
    .reverse()
    .map(p => ({
      name: p.adversario.split(' ')[0],
      Nós: p.placar_nos,
      Adversário: p.placar_adversario,
    }))

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display text-3xl md:text-4xl tracking-widest">
            DASHBOARD
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-0.5">
            Visão geral do time
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-slate-400 font-semibold">{jogadores.length} jogadores ativos</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="JOGOS" value={totalJogos} icon={Swords} color="blue" />
        <StatCard label="VITÓRIAS" value={vitorias} icon={Trophy} color="gold" sublabel={`${taxaVitoria}% aproveitamento`} />
        <StatCard label="GOLS" value={totalGols} icon={Target} color="green" />
        <StatCard label="JOGADORES" value={jogadores.length} icon={Users} color="purple" />
      </div>

      {/* Win Rate + Top Players */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Desempenho */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="DESEMPENHO" />
          <div className="space-y-3">
            {[
              { label: 'Vitórias', value: vitorias, total: totalJogos, color: 'bg-emerald-500' },
              { label: 'Empates', value: empates, total: totalJogos, color: 'bg-yellow-500' },
              { label: 'Derrotas', value: derrotas, total: totalJogos, color: 'bg-red-500' },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-400">{label}</span>
                  <span className="text-sm font-display text-white">{value}/{total}</span>
                </div>
                <div className="h-2 bg-pitch-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-1000`}
                    style={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Record */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
            <div className="flex gap-2 items-center">
              <span className="font-display text-2xl text-emerald-400">{vitorias}</span>
              <span className="text-slate-600 font-display text-xl">-</span>
              <span className="font-display text-2xl text-yellow-500">{empates}</span>
              <span className="text-slate-600 font-display text-xl">-</span>
              <span className="font-display text-2xl text-red-400">{derrotas}</span>
            </div>
          </div>
        </div>

        {/* Destaques */}
        <div className="glass rounded-xl p-4 border border-white/5 space-y-3">
          <SectionHeader title="DESTAQUES" />
          {[
            { label: 'TOP ARTILHEIRO', player: topArtilheiro, stat: `${topArtilheiro?.gols || 0} gols`, icon: Target, color: 'text-yellow-400' },
            { label: 'TOP ASSISTÊNCIAS', player: topAssistente, stat: `${topAssistente?.assistencias || 0} assists`, icon: GitMerge, color: 'text-blue-400' },
            { label: 'TOP MVP', player: topMVP, stat: `${topMVP?.mvps || 0} MVPs`, icon: Star, color: 'text-purple-400' },
          ].map(({ label, player, stat, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3 glass-hover rounded-lg p-2">
              <div className={`p-2 rounded-lg bg-black/30 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="stat-label">{label}</div>
                <div className="text-white font-bold text-sm truncate">{player?.nome || '—'}</div>
              </div>
              <div className={`text-xs font-display ${color}`}>{stat}</div>
            </div>
          ))}
        </div>

        {/* Top 3 Cards */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="TOP RATED" subtitle="Maiores overalls" />
          <div className="space-y-2">
            {topOverall.map((j, i) => (
              <div key={j.id} className="flex items-center gap-3 glass-hover rounded-lg p-2">
                <span className={`rank-badge ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-amber-700'}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">{j.nome}</div>
                  <div className="text-xs text-slate-500 font-semibold">{j.posicao}</div>
                </div>
                <div className={`font-display text-xl ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-amber-700'}`}>
                  {j.overall}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Gols & Assists */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="GOLS & ASSISTÊNCIAS" subtitle="Top 6 jogadores" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani' }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Gols" fill="#FFC107" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Assistências" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resultados */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="ÚLTIMAS PARTIDAS" subtitle="Placar por jogo" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={resultadosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani' }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Nós" stroke="#00FF87" strokeWidth={2} dot={{ fill: '#00FF87', r: 3 }} />
              <Line type="monotone" dataKey="Adversário" stroke="#FF4757" strokeWidth={2} dot={{ fill: '#FF4757', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimas Partidas + Top FIFA Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Histórico */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="HISTÓRICO RECENTE" />
          <div className="space-y-2">
            {partidas.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 glass-hover rounded-lg p-2.5">
                <ResultBadge resultado={p.resultado} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">vs {p.adversario}</div>
                  <div className="text-xs text-slate-500 font-semibold">
                    {p.data ? format(parseISO(p.data), "dd 'de' MMM", { locale: ptBR }) : ''}
                    {p.local && ` • ${p.local}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-lg leading-none ${p.resultado === 'vitoria' ? 'text-emerald-400' : p.resultado === 'derrota' ? 'text-red-400' : 'text-yellow-500'}`}>
                    {p.placar_nos} — {p.placar_adversario}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 FIFA Cards */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <SectionHeader title="CARDS DO TIME" subtitle="Top jogadores" />
          <div className="grid grid-cols-3 gap-2">
            {topOverall.map(j => (
              <FifaCard key={j.id} jogador={j} size="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
