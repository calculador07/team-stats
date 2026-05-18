import { getCardTier, getTierColors } from '../../lib/supabase'

const positionAbbr = {
  'Goleiro': 'GK',
  'Defensor': 'DEF',
  'Meia': 'MID',
  'Atacante': 'ATK',
  'Lateral': 'LAT',
  'Volante': 'VOL',
}

function PlayerAvatar({ nome, fotoUrl, size = 'md' }) {
  const initials = nome?.split(' ').map(n => n[0]).slice(0, 2).join('') || '?'
  const sizes = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-28 h-28 text-4xl',
  }

  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nome}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-display text-slate-300`}
    >
      {initials}
    </div>
  )
}

export function FifaCard({ jogador, onClick, size = 'normal' }) {
  const tier = getCardTier(jogador.overall)
  const colors = getTierColors(tier)

  const stats = [
    { label: 'GOL', value: jogador.gols },
    { label: 'ASS', value: jogador.assistencias },
    { label: 'JOG', value: jogador.jogos },
    { label: 'VIT', value: jogador.vitorias },
    { label: 'MVP', value: jogador.mvps },
  ]

  const posAbbr = positionAbbr[jogador.posicao] || jogador.posicao?.slice(0, 3).toUpperCase()

  const isSmall = size === 'small'

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl cursor-pointer
        card-shimmer group transition-all duration-300
        border ${colors.border} ${colors.glow}
        bg-gradient-to-br ${colors.bg} bg-pitch-800
        ${isSmall ? 'p-3' : 'p-4'}
        hover:scale-[1.03] hover:z-10
      `}
      style={{
        background: 'linear-gradient(145deg, rgba(17,24,39,0.95) 0%, rgba(10,15,26,0.98) 100%)',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
        }} />
      </div>

      {/* Top row: Overall + Position + Name */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="text-left">
          <div className={`font-display leading-none ${isSmall ? 'text-3xl' : 'text-4xl'} ${colors.overall}`}>
            {jogador.overall}
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-widest mt-0.5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {posAbbr}
          </div>
        </div>

        {/* Number badge */}
        <div className={`${colors.badge} rounded-full ${isSmall ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} flex items-center justify-center font-display`}>
          {jogador.numero || '?'}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-3">
        <div className={`relative ${colors.glow} rounded-full`}>
          <PlayerAvatar nome={jogador.nome} fotoUrl={jogador.foto_url} size={isSmall ? 'md' : 'lg'} />
          {tier === 'icon' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px]">
              ⭐
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-3">
        <div className={`font-display tracking-wide text-white leading-tight ${isSmall ? 'text-sm' : 'text-base'}`}>
          {jogador.nome.split(' ')[0].toUpperCase()}
        </div>
        {!isSmall && jogador.nome.split(' ').length > 1 && (
          <div className="text-xs text-slate-400 tracking-widest font-display">
            {jogador.nome.split(' ').slice(1).join(' ').toUpperCase()}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={`border-t ${colors.border} opacity-40 mb-3`} />

      {/* Stats */}
      <div className="grid grid-cols-5 gap-1">
        {stats.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className={`font-display ${isSmall ? 'text-sm' : 'text-base'} text-white leading-none`}>
              {value}
            </div>
            <div className="stat-label mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tier glow overlay */}
      {tier === 'icon' && (
        <div className="absolute inset-0 rounded-xl pointer-events-none animate-pulse-gold opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,193,7,0.3), transparent 70%)' }}
        />
      )}
    </div>
  )
}

export { PlayerAvatar }
