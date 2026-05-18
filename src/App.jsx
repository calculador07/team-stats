import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/shared/Layout'
import Dashboard from './pages/Dashboard'
import Jogadores from './pages/Jogadores'
import Partidas from './pages/Partidas'
import Ranking from './pages/Ranking'
import Admin from './pages/Admin'
import { isDemoMode } from './hooks/useData'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#e2e8f0',
            border: '1px solid rgba(255,193,7,0.2)',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
          },
          success: {
            iconTheme: { primary: '#FFC107', secondary: '#0a0f1a' },
          },
          error: {
            iconTheme: { primary: '#FF4757', secondary: '#0a0f1a' },
          },
        }}
      />
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 text-black text-center py-1.5 text-sm font-bold" style={{fontFamily: 'Rajdhani, sans-serif'}}>
          ⚡ MODO DEMO — Configure o Supabase no .env.local para ativar o banco de dados
        </div>
      )}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="jogadores" element={<Jogadores />} />
          <Route path="partidas" element={<Partidas />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
