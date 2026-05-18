import { useJogadores } from '../hooks/useData'
import { PlayerAvatar } from '../components/players/FifaCard'
import { getCardTier, getTierColors } from '../lib/supabase'
import { Target, GitMerge, Star, Award, Trophy, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const TABS = [
  { id: 'overall', label: 'Overall', icon: Trophy, key: 'overall', color: 'text-yellow-400' },
  { id: 'gols', label: 'Artilharia', icon: Target, key: 'gols', color: 'text-emerald-400' },
  { id: 'assistencias', label: 'Assistências', icon: GitMerge, key: 'assistencias', color: 'text-blue-400' },
  { id: 'mvps', label: 'MVPs', icon: Star, key: 'mvps', color: 'text-purple-400' },
  { id: 'vitorias', label: 'Vitórias', icon: Award, key: 'vitorias', color: 'text-orange-400' },
]

function RankRow({ jogador, rank, statKey, statColor }) {
  const tier = getCardTier(jogador.overall)
  const colors = getTierColors(tier)
  const statValue = jogador[statKey] ?? 0

  return (
    <div className={`
      flex items-center gap-3 p-3 rounded-xl glass glass-hover border transition-all
      ${rank === 1 ? 'border-yellow-500/30 bg-yellow-500/5' :
        rank === 2 ? 'border-slate-400/20' :
        rank === 3 ? 'border-amber-700/20' : 'border-white/5'}
    `}>
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {rank <= 3 ? (
          <span className="text-lg">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
          </span>
        ) : (
          <span className="rank-badge text-slate-500">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <PlayerAvatar nome={jogador.nome} fotoUrl={jogador.foto_url} size="sm" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-sm truncate">{jogador.nome}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 font-semibold">{jogador.posicao}</span>
          <span className={`text-xs font-display ${colors.overall}`}>OVR {jogador.overall}</span>
        </div>
      </div>

      {/* Stats mini */}
      <div className="hidden md:flex gap-3 text-center">
        {[
          { label: 'GOL', v: jogador.gols },
          { label: 'ASS', v: jogador.assistencias },
          { label: 'MVP', v: jogador.mvps },
        ].map(({ label, v }) => (
          <div key={label} className="w-10">
            <div className="text-white font-display text-sm">{v}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Main stat */}
      <div className="text-right flex-shrink-0">
        <div className={`font-display text-2xl ${statColor}`}>{statValue}</div>
      </div>
    </div>
  )
}

export default function Ranking() {
  const { jogadores, loading } = useJogadores()
  const [activeTab, setActiveTab] = useState('overall')

  const tab = TABS.find(t => t.id === activeTab)

  const sorted = [...jogadores].sort((a, b) => (b[tab.key] || 0) - (a[tab.key] || 0))

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-8 max-w-3xl space-y-5">
      <div>
        <h1 className="text-white font-display text-3xl md:text-4xl tracking-widest">RANKING</h1>
        <p className="text-slate-500 font-semibold text-sm">Classificação dos jogadores</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm flex-shrink-0 transition-all ${
                activeTab === t.id
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'glass text-slate-400 border border-white/5 hover:border-white/20'
              }`}
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Ranking List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((j, i) => (
            <RankRow
              key={j.id}
              jogador={j}
              rank={i + 1}
              statKey={tab.key}
              statColor={tab.color}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="glass rounded-xl p-4 border border-white/5">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-3">CÁLCULO DO OVERALL</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Gol marcado', pts: '+5', color: 'text-emerald-400' },
            { label: 'Assistência', pts: '+3', color: 'text-blue-400' },
            { label: 'Vitória', pts: '+2', color: 'text-yellow-400' },
            { label: 'MVP', pts: '+7', color: 'text-purple-400' },
            { label: 'Derrota', pts: '-1', color: 'text-red-400' },
            { label: 'Jogo disputado', pts: '+1', color: 'text-slate-300' },
          ].map(({ label, pts, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">{label}</span>
              <span className={`font-display text-lg ${color}`}>{pts}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-600 font-semibold">
          Overall calculado automaticamente. Range: 60–99
        </div>
      </div>
    </div>
  )
}
