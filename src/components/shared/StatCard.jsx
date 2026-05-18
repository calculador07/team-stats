export function StatCard({ label, value, icon: Icon, color = 'gold', sublabel, trend }) {
  const colors = {
    gold: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    slate: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
  }

  return (
    <div className={`glass rounded-xl p-4 border ${colors[color]} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="stat-label mb-1">{label}</p>
          <p className="font-display text-3xl text-white leading-none">{value}</p>
          {sublabel && <p className="text-xs text-slate-500 mt-1 font-semibold">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg border ${colors[color]}`}>
            <Icon size={20} className={colors[color].split(' ')[0]} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend)}% vs último mês</span>
        </div>
      )}
    </div>
  )
}

export function LoadingSkeleton({ rows = 3, cols = 4 }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-4`}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 h-24 skeleton" />
      ))}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm font-semibold">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function EmptyState({ message = 'Nenhum dado encontrado', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-600">
      {Icon && <Icon size={40} className="mb-3 opacity-50" />}
      <p className="font-display text-lg tracking-wide">{message}</p>
    </div>
  )
}

export function ResultBadge({ resultado }) {
  const map = {
    vitoria: { label: 'V', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    derrota: { label: 'D', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
    empate: { label: 'E', class: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  }
  const r = map[resultado] || map.empate
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-display border ${r.class}`}>
      {r.label}
    </span>
  )
}
