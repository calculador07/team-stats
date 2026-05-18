import { useState } from 'react'
import toast from 'react-hot-toast'
import { useJogadores, usePartidas, useAdminJogadores, useAdminPartidas, isDemoMode } from '../hooks/useData'
import { calcularOverall } from '../lib/supabase'
import { Plus, Edit2, Trash2, Users, Swords, Upload, ShieldCheck, Save, X } from 'lucide-react'

const POSICOES = ['Goleiro', 'Defensor', 'Lateral', 'Volante', 'Meia', 'Atacante']

const emptyJogador = {
  nome: '', posicao: 'Meia', numero: '', foto_url: '',
  gols: 0, assistencias: 0, jogos: 0, vitorias: 0, derrotas: 0, mvps: 0
}

const emptyPartida = {
  adversario: '', data: new Date().toISOString().split('T')[0],
  placar_nos: 0, placar_adversario: 0, local: '', observacoes: ''
}

function JogadorForm({ jogador, onSave, onCancel, saving }) {
  const [form, setForm] = useState(jogador || emptyJogador)
  const [file, setFile] = useState(null)

  const overall = calcularOverall(form)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome.trim()) return toast.error('Nome é obrigatório')
    onSave(form, file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="stat-label block mb-1">NOME *</label>
          <input className="input-dark" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome completo" required />
        </div>
        <div>
          <label className="stat-label block mb-1">POSIÇÃO</label>
          <select className="input-dark" value={form.posicao} onChange={e => set('posicao', e.target.value)}>
            {POSICOES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="stat-label block mb-1">NÚMERO</label>
          <input className="input-dark" type="number" value={form.numero} onChange={e => set('numero', e.target.value)} placeholder="Ex: 10" min="1" max="99" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { k: 'gols', label: 'GOLS' },
          { k: 'assistencias', label: 'ASSISTÊNCIAS' },
          { k: 'jogos', label: 'JOGOS' },
          { k: 'vitorias', label: 'VITÓRIAS' },
          { k: 'derrotas', label: 'DERROTAS' },
          { k: 'mvps', label: 'MVPs' },
        ].map(({ k, label }) => (
          <div key={k}>
            <label className="stat-label block mb-1">{label}</label>
            <input className="input-dark" type="number" value={form[k]} onChange={e => set(k, parseInt(e.target.value) || 0)} min="0" />
          </div>
        ))}
      </div>

      {/* Foto */}
      <div>
        <label className="stat-label block mb-1">FOTO</label>
        <div className="flex gap-2">
          <input className="input-dark flex-1" value={form.foto_url} onChange={e => set('foto_url', e.target.value)} placeholder="URL da foto (ou faça upload)" />
          <label className="btn-secondary cursor-pointer flex items-center gap-1 flex-shrink-0">
            <Upload size={14} />
            <span>Upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        {file && <p className="text-xs text-emerald-400 mt-1 font-semibold">📎 {file.name}</p>}
      </div>

      {/* Overall Preview */}
      <div className="glass rounded-xl p-3 border border-yellow-500/20 flex items-center justify-between">
        <span className="text-slate-400 font-semibold">OVERALL CALCULADO:</span>
        <span className="font-display text-3xl text-yellow-400">{overall}</span>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Jogador'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-4">
          <X size={16} />
        </button>
      </div>
    </form>
  )
}

function PartidaForm({ onSave, onCancel, saving, jogadores }) {
  const [form, setForm] = useState(emptyPartida)
  const [stats, setStats] = useState([])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addJogadorStat = (jogadorId) => {
    if (!jogadorId || stats.find(s => s.jogador_id === jogadorId)) return
    setStats(s => [...s, { jogador_id: jogadorId, gols: 0, assistencias: 0, mvp: false }])
  }

  const updateStat = (id, k, v) => setStats(s => s.map(st => st.jogador_id === id ? { ...st, [k]: v } : st))
  const removeStat = (id) => setStats(s => s.filter(st => st.jogador_id !== id))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.adversario.trim()) return toast.error('Adversário é obrigatório')
    onSave({ ...form, placar_nos: Number(form.placar_nos), placar_adversario: Number(form.placar_adversario), estatisticas: stats })
  }

  const resultado = Number(form.placar_nos) > Number(form.placar_adversario) ? 'VITÓRIA' :
    Number(form.placar_nos) < Number(form.placar_adversario) ? 'DERROTA' : 'EMPATE'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="stat-label block mb-1">ADVERSÁRIO *</label>
          <input className="input-dark" value={form.adversario} onChange={e => set('adversario', e.target.value)} placeholder="Nome do adversário" required />
        </div>
        <div>
          <label className="stat-label block mb-1">DATA</label>
          <input className="input-dark" type="date" value={form.data} onChange={e => set('data', e.target.value)} />
        </div>
        <div>
          <label className="stat-label block mb-1">LOCAL</label>
          <input className="input-dark" value={form.local} onChange={e => set('local', e.target.value)} placeholder="Local do jogo" />
        </div>
      </div>

      {/* Placar */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="text-center stat-label mb-3">PLACAR</div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="stat-label mb-1">NÓS</div>
            <input
              type="number" min="0" value={form.placar_nos}
              onChange={e => set('placar_nos', e.target.value)}
              className="input-dark w-16 text-center font-display text-2xl"
            />
          </div>
          <div className="font-display text-3xl text-slate-500">×</div>
          <div className="text-center">
            <div className="stat-label mb-1">ADVERSÁRIO</div>
            <input
              type="number" min="0" value={form.placar_adversario}
              onChange={e => set('placar_adversario', e.target.value)}
              className="input-dark w-16 text-center font-display text-2xl"
            />
          </div>
        </div>
        <div className={`text-center mt-3 font-display text-lg ${
          resultado === 'VITÓRIA' ? 'text-emerald-400' : resultado === 'DERROTA' ? 'text-red-400' : 'text-yellow-500'
        }`}>
          {resultado}
        </div>
      </div>

      {/* Stats por jogador */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="stat-label">ESTATÍSTICAS DOS JOGADORES</label>
        </div>
        <select
          className="input-dark mb-2"
          onChange={e => { addJogadorStat(e.target.value); e.target.value = '' }}
          defaultValue=""
        >
          <option value="">+ Adicionar jogador à partida...</option>
          {jogadores.filter(j => !stats.find(s => s.jogador_id === j.id)).map(j => (
            <option key={j.id} value={j.id}>{j.nome}</option>
          ))}
        </select>

        {stats.map(s => {
          const j = jogadores.find(jj => jj.id === s.jogador_id)
          return (
            <div key={s.jogador_id} className="glass rounded-lg p-3 mb-2 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">{j?.nome}</span>
                <button type="button" onClick={() => removeStat(s.jogador_id)} className="text-slate-500 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="stat-label">GOLS</label>
                  <input type="number" min="0" value={s.gols} onChange={e => updateStat(s.jogador_id, 'gols', parseInt(e.target.value) || 0)} className="input-dark py-1 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="stat-label">ASSISTS</label>
                  <input type="number" min="0" value={s.assistencias} onChange={e => updateStat(s.jogador_id, 'assistencias', parseInt(e.target.value) || 0)} className="input-dark py-1 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.mvp}
                      onChange={e => {
                        if (e.target.checked) setStats(prev => prev.map(st => ({ ...st, mvp: st.jogador_id === s.jogador_id })))
                        else updateStat(s.jogador_id, 'mvp', false)
                      }}
                      className="accent-yellow-500"
                    />
                    <span className="text-xs text-yellow-400 font-bold">MVP⭐</span>
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Save size={16} />
          {saving ? 'Salvando...' : 'Registrar Partida'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-4">
          <X size={16} />
        </button>
      </div>
    </form>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(!import.meta.env.VITE_ADMIN_PASSWORD || isDemoMode)
  const [senha, setSenha] = useState('')
  const [activeTab, setActiveTab] = useState('jogadores')
  const [showForm, setShowForm] = useState(false)
  const [editJogador, setEditJogador] = useState(null)

  const { jogadores, refetch } = useJogadores()
  const { partidas, refetch: refetchPartidas } = usePartidas()
  const { salvarJogador, deletarJogador, uploadFoto, saving } = useAdminJogadores()
  const { salvarPartida, saving: savingPartida } = useAdminPartidas()

  const handleLogin = () => {
    if (senha === (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123')) {
      setAuthed(true)
    } else {
      toast.error('Senha incorreta')
    }
  }

  const handleSalvarJogador = async (form, file) => {
    let foto_url = form.foto_url
    if (file && editJogador?.id) {
      const r = await uploadFoto(file, editJogador.id)
      if (r.success && r.url) foto_url = r.url
    }
    const r = await salvarJogador({ ...form, foto_url }, editJogador?.id || null)
    if (r.success) {
      toast.success(r.demo ? '✅ Salvo (modo demo - configure Supabase para persistir)' : '✅ Jogador salvo!')
      setShowForm(false)
      setEditJogador(null)
      refetch()
    } else {
      toast.error(r.error || 'Erro ao salvar')
    }
  }

  const handleDeletar = async (id, nome) => {
    if (!confirm(`Remover ${nome}?`)) return
    const r = await deletarJogador(id)
    if (r.success) {
      toast.success('Jogador removido')
      refetch()
    }
  }

  const handleSalvarPartida = async (form) => {
    const r = await salvarPartida(form)
    if (r.success) {
      toast.success(r.demo ? '✅ Partida salva (modo demo)' : '✅ Partida registrada!')
      setShowForm(false)
      refetchPartidas()
    } else {
      toast.error(r.error || 'Erro ao salvar')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 border border-yellow-500/20 max-w-sm w-full shadow-gold animate-slide-up">
          <div className="text-center mb-6">
            <ShieldCheck size={40} className="text-yellow-500 mx-auto mb-3" />
            <h1 className="font-display text-3xl text-white tracking-widest">PAINEL ADMIN</h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">Acesso restrito</p>
          </div>
          <input
            type="password"
            className="input-dark mb-3"
            placeholder="Senha de administrador"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="btn-primary w-full">ENTRAR</button>
          <p className="text-center text-xs text-slate-600 mt-3">Senha padrão: admin123</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-8 max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display text-3xl md:text-4xl tracking-widest flex items-center gap-2">
            <ShieldCheck className="text-yellow-500" size={28} />
            PAINEL ADMIN
          </h1>
          {isDemoMode && (
            <p className="text-yellow-500 text-xs font-semibold mt-1">
              ⚡ Modo demo — configure Supabase para persistência real
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'jogadores', label: 'Jogadores', icon: Users },
          { id: 'partidas', label: 'Partidas', icon: Swords },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setShowForm(false); setEditJogador(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === t.id
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'glass text-slate-400 border border-white/5'
            }`}
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="glass rounded-xl p-5 border border-yellow-500/20 animate-slide-up">
          <h2 className="font-display text-xl text-white tracking-wide mb-4">
            {activeTab === 'jogadores'
              ? (editJogador ? 'EDITAR JOGADOR' : 'NOVO JOGADOR')
              : 'REGISTRAR PARTIDA'}
          </h2>
          {activeTab === 'jogadores' ? (
            <JogadorForm
              jogador={editJogador}
              onSave={handleSalvarJogador}
              onCancel={() => { setShowForm(false); setEditJogador(null) }}
              saving={saving}
            />
          ) : (
            <PartidaForm
              onSave={handleSalvarPartida}
              onCancel={() => setShowForm(false)}
              saving={savingPartida}
              jogadores={jogadores}
            />
          )}
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditJogador(null) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {activeTab === 'jogadores' ? 'Novo Jogador' : 'Registrar Partida'}
        </button>
      )}

      {/* List */}
      {activeTab === 'jogadores' && (
        <div className="space-y-2">
          {jogadores.map(j => (
            <div key={j.id} className="glass glass-hover rounded-xl p-3 border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-display text-slate-300 flex-shrink-0">
                {j.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">{j.nome}</div>
                <div className="text-xs text-slate-500 font-semibold">{j.posicao} • #{j.numero}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl text-yellow-400">{j.overall}</div>
                <div className="stat-label">OVR</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditJogador(j); setShowForm(true) }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDeletar(j.id, j.nome)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'partidas' && (
        <div className="space-y-2">
          {partidas.map(p => (
            <div key={p.id} className="glass rounded-xl p-3 border border-white/5 flex items-center gap-3">
              <div className={`font-display text-lg w-6 text-center ${
                p.resultado === 'vitoria' ? 'text-emerald-400' :
                p.resultado === 'derrota' ? 'text-red-400' : 'text-yellow-500'
              }`}>
                {p.resultado === 'vitoria' ? 'V' : p.resultado === 'derrota' ? 'D' : 'E'}
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">vs {p.adversario}</div>
                <div className="text-xs text-slate-500 font-semibold">{p.data}</div>
              </div>
              <div className="font-display text-lg text-white">{p.placar_nos} — {p.placar_adversario}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
