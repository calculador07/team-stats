import { useState, useEffect, useCallback } from 'react'
import { supabase, calcularOverall } from '../lib/supabase'
import { mockJogadores, mockPartidas } from '../lib/mockData'

const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'

export function useJogadores() {
  const [jogadores, setJogadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJogadores = useCallback(async () => {
    try {
      setLoading(true)
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 600))
        setJogadores(mockJogadores)
        return
      }
      const { data, error } = await supabase
        .from('jogadores')
        .select('*')
        .eq('ativo', true)
        .order('overall', { ascending: false })
      if (error) throw error
      setJogadores(data || [])
    } catch (err) {
      setError(err.message)
      setJogadores(mockJogadores) // fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJogadores() }, [fetchJogadores])

  return { jogadores, loading, error, refetch: fetchJogadores }
}

export function usePartidas() {
  const [partidas, setPartidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPartidas = useCallback(async () => {
    try {
      setLoading(true)
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 400))
        setPartidas(mockPartidas)
        return
      }
      const { data, error } = await supabase
        .from('partidas')
        .select('*')
        .order('data', { ascending: false })
        .limit(20)
      if (error) throw error
      setPartidas(data || [])
    } catch (err) {
      setError(err.message)
      setPartidas(mockPartidas)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPartidas() }, [fetchPartidas])

  return { partidas, loading, error, refetch: fetchPartidas }
}

export function useAdminJogadores() {
  const [saving, setSaving] = useState(false)

  const salvarJogador = async (dados, id = null) => {
    setSaving(true)
    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800))
        return { success: true, demo: true }
      }
      const overall = calcularOverall(dados)
      const payload = { ...dados, overall, updated_at: new Date().toISOString() }
      
      let result
      if (id) {
        result = await supabase.from('jogadores').update(payload).eq('id', id).select().single()
      } else {
        result = await supabase.from('jogadores').insert(payload).select().single()
      }
      if (result.error) throw result.error
      return { success: true, data: result.data }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  const deletarJogador = async (id) => {
    if (isDemoMode) return { success: true, demo: true }
    const { error } = await supabase.from('jogadores').update({ ativo: false }).eq('id', id)
    return error ? { success: false, error: error.message } : { success: true }
  }

  const uploadFoto = async (file, jogadorId) => {
    if (isDemoMode) return { success: true, url: null, demo: true }
    try {
      const ext = file.name.split('.').pop()
      const path = `${jogadorId}.${ext}`
      const { error: upError } = await supabase.storage.from('jogadores').upload(path, file, { upsert: true })
      if (upError) throw upError
      const { data } = supabase.storage.from('jogadores').getPublicUrl(path)
      return { success: true, url: data.publicUrl }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { salvarJogador, deletarJogador, uploadFoto, saving }
}

export function useAdminPartidas() {
  const [saving, setSaving] = useState(false)

  const salvarPartida = async (dados) => {
    setSaving(true)
    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 600))
        return { success: true, demo: true }
      }
      const { estatisticas, ...partida } = dados
      const { data: partData, error: partError } = await supabase
        .from('partidas').insert(partida).select().single()
      if (partError) throw partError

      if (estatisticas?.length) {
        const stats = estatisticas.map(s => ({ ...s, partida_id: partData.id }))
        await supabase.from('estatisticas_partida').insert(stats)

        // Atualizar stats dos jogadores
        for (const stat of estatisticas) {
          const { data: jogador } = await supabase
            .from('jogadores').select('*').eq('id', stat.jogador_id).single()
          if (jogador) {
            const resultado = partida.placar_nos > partida.placar_adversario ? 'vitoria' :
              partida.placar_nos < partida.placar_adversario ? 'derrota' : 'empate'
            const updates = {
              gols: jogador.gols + (stat.gols || 0),
              assistencias: jogador.assistencias + (stat.assistencias || 0),
              jogos: jogador.jogos + 1,
              vitorias: jogador.vitorias + (resultado === 'vitoria' ? 1 : 0),
              derrotas: jogador.derrotas + (resultado === 'derrota' ? 1 : 0),
              mvps: jogador.mvps + (stat.mvp ? 1 : 0),
            }
            updates.overall = calcularOverall(updates)
            await supabase.from('jogadores').update(updates).eq('id', stat.jogador_id)
          }
        }
      }
      return { success: true, data: partData }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }

  return { salvarPartida, saving }
}

export { isDemoMode }
