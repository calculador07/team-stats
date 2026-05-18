import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Configure o .env.local')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Calcular overall baseado nas stats
export function calcularOverall(stats) {
  const { gols = 0, assistencias = 0, vitorias = 0, mvps = 0, derrotas = 0, jogos = 0 } = stats
  const pontos = (gols * 5) + (assistencias * 3) + (vitorias * 2) + (mvps * 7) - (derrotas * 1) + (jogos * 1)
  const base = jogos > 0 ? pontos / jogos : 0
  const overall = Math.round(60 + Math.min(39, Math.max(0, base * 3)))
  return Math.max(60, Math.min(99, overall))
}

// Determinar tier do card baseado no overall
export function getCardTier(overall) {
  if (overall >= 90) return 'icon' // Dourado especial
  if (overall >= 85) return 'gold'
  if (overall >= 75) return 'silver'
  return 'bronze'
}

export function getTierColors(tier) {
  switch (tier) {
    case 'icon':
      return {
        border: 'border-yellow-300',
        bg: 'from-yellow-900/40 via-yellow-800/20 to-transparent',
        glow: 'shadow-[0_0_30px_rgba(253,224,71,0.5)]',
        text: 'text-yellow-300',
        badge: 'bg-yellow-400 text-black',
        overall: 'text-yellow-300',
      }
    case 'gold':
      return {
        border: 'border-yellow-500/70',
        bg: 'from-yellow-900/30 via-yellow-800/10 to-transparent',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500 text-black',
        overall: 'text-yellow-400',
      }
    case 'silver':
      return {
        border: 'border-slate-400/60',
        bg: 'from-slate-600/30 via-slate-700/10 to-transparent',
        glow: 'shadow-[0_0_15px_rgba(148,163,184,0.2)]',
        text: 'text-slate-300',
        badge: 'bg-slate-400 text-black',
        overall: 'text-slate-300',
      }
    default:
      return {
        border: 'border-amber-700/50',
        bg: 'from-amber-900/20 via-amber-800/5 to-transparent',
        glow: 'shadow-[0_0_10px_rgba(180,83,9,0.2)]',
        text: 'text-amber-500',
        badge: 'bg-amber-700 text-white',
        overall: 'text-amber-500',
      }
  }
}
