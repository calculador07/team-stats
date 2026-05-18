import { usePartidas } from '../hooks/useData'
import { ResultBadge, SectionHeader } from '../components/shared/StatCard'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Calendar } from 'lucide-react'

export default function Partidas() {
  const { partidas, loading } = usePartidas()

  const vitorias = partidas.filter(p => p.resultado === 'vitoria').length
  const derrotas = partidas.filter(p => p.resultado === 'derrota').length
  const empates = partidas.filter(p => p.resultado === 'empate').length
  const gols = partidas.reduce((a, p) => a + (p.placar_nos || 0), 0)
  const golsSofridos = partidas.reduce((a, p) => a + (p.placar_adversario || 0), 0)

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-8 max-w-4xl space-y-5">
      <div>
        <h1 className="text-white font-display text-3xl md:text-4xl tracking-widest">PARTIDAS</h1>
        <p className="text-slate-500 font-semibold text-sm">{partidas.length} jogos disputados</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'VITÓRIAS', value: vitorias, color: 'text-emerald-400' },
          { label: 'EMPATES', value: empates, color: 'text-yellow-400' },
          { label: 'DERROTAS', value: derrotas, color: 'text-red-400' },
          { label: 'GOLS MARCADOS', value: gols, color: 'text-blue-400' },
          { label: 'GOLS SOFRIDOS', value: golsSofridos, color: 'text-slate-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl p-3 text-center border border-white/5">
            <div className={`font-display text-3xl ${color}`}>{value}</div>
            <div className="stat-label mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Partidas List */}
      <div className="space-y-3">
        <SectionHeader title="HISTÓRICO DE PARTIDAS" />
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl skeleton" />
          ))
        ) : partidas.length === 0 ? (
          <div className="text-center py-12 text-slate-600 font-display text-xl">Nenhuma partida registrada</div>
        ) : (
          partidas.map(p => (
            <div key={p.id} className="glass glass-hover rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                {/* Result */}
                <ResultBadge resultado={p.resultado} />

                {/* Adversary */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">vs {p.adversario}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {p.data && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                        <Calendar size={11} />
                        {format(parseISO(p.data), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {p.local && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                        <MapPin size={11} />
                        {p.local}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`font-display text-2xl leading-none ${
                    p.resultado === 'vitoria' ? 'text-emerald-400' :
                    p.resultado === 'derrota' ? 'text-red-400' : 'text-yellow-500'
                  }`}>
                    {p.placar_nos} — {p.placar_adversario}
                  </div>
                  <div className={`text-xs font-bold tracking-widest mt-0.5 ${
                    p.resultado === 'vitoria' ? 'text-emerald-500' :
                    p.resultado === 'derrota' ? 'text-red-500' : 'text-yellow-600'
                  }`}>
                    {p.resultado === 'vitoria' ? 'VITÓRIA' : p.resultado === 'derrota' ? 'DERROTA' : 'EMPATE'}
                  </div>
                </div>
              </div>
              {p.observacoes && (
                <p className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-500">{p.observacoes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
