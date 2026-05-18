import { useState } from 'react'
import { useJogadores } from '../hooks/useData'
import { FifaCard } from '../components/players/FifaCard'
import { SectionHeader } from '../components/shared/StatCard'
import { Search, SlidersHorizontal } from 'lucide-react'

const POSITIONS = ['Todos', 'Goleiro', 'Defensor', 'Lateral', 'Volante', 'Meia', 'Atacante']
const SORT_OPTIONS = [
  { value: 'overall', label: 'Overall' },
  { value: 'gols', label: 'Gols' },
  { value: 'assistencias', label: 'Assistências' },
  { value: 'mvps', label: 'MVPs' },
  { value: 'jogos', label: 'Jogos' },
]

export default function Jogadores() {
  const { jogadores, loading } = useJogadores()
  const [busca, setBusca] = useState('')
  const [posicao, setPosicao] = useState('Todos')
  const [sortBy, setSortBy] = useState('overall')
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const filtered = jogadores
    .filter(j => {
      const matchBusca = j.nome.toLowerCase().includes(busca.toLowerCase())
      const matchPos = posicao === 'Todos' || j.posicao === posicao
      return matchBusca && matchPos
    })
    .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-8 max-w-7xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-white font-display text-3xl md:text-4xl tracking-widest">JOGADORES</h1>
        <p className="text-slate-500 font-semibold text-sm">{jogadores.length} jogadores no elenco</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 border border-white/5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar jogador..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="input-dark pl-9"
          />
        </div>

        {/* Position + Sort */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {POSITIONS.map(p => (
              <button
                key={p}
                onClick={() => setPosicao(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  posicao === p
                    ? 'bg-yellow-500 text-black'
                    : 'glass text-slate-400 border border-white/5 hover:border-white/20'
                }`}
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-dark py-1 px-2 text-sm w-auto"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="font-display text-4xl mb-2">😔</div>
          <p className="font-display text-xl tracking-wide">Nenhum jogador encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(j => (
            <FifaCard key={j.id} jogador={j} onClick={() => setSelectedPlayer(j)} />
          ))}
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="glass rounded-2xl p-6 border border-white/10 max-w-md w-full animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-2xl text-white tracking-wide">{selectedPlayer.nome.toUpperCase()}</h2>
                <p className="text-slate-400 font-semibold">{selectedPlayer.posicao} • #{selectedPlayer.numero}</p>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="font-display text-5xl text-yellow-400">{selectedPlayer.overall}</div>
                <div className="stat-label">OVERALL</div>
              </div>
              <div className="flex-1 w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-display text-slate-300">
                {selectedPlayer.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'GOLS', value: selectedPlayer.gols, color: 'text-yellow-400' },
                { label: 'ASSISTÊNCIAS', value: selectedPlayer.assistencias, color: 'text-blue-400' },
                { label: 'JOGOS', value: selectedPlayer.jogos, color: 'text-white' },
                { label: 'VITÓRIAS', value: selectedPlayer.vitorias, color: 'text-emerald-400' },
                { label: 'DERROTAS', value: selectedPlayer.derrotas, color: 'text-red-400' },
                { label: 'MVPs', value: selectedPlayer.mvps, color: 'text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass rounded-lg p-3 text-center">
                  <div className={`font-display text-2xl ${color}`}>{value}</div>
                  <div className="stat-label mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
