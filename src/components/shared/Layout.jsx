import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Swords, Trophy, ShieldCheck, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isDemoMode } from '../../hooks/useData'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jogadores', label: 'Jogadores', icon: Users },
  { to: '/partidas', label: 'Partidas', icon: Swords },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
]

function ParticlesBg() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s`,
            animationDelay: `${-Math.random() * 20}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.2 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location])

  return (
    <div className="min-h-screen pitch-bg pitch-lines relative">
      <ParticlesBg />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col glass border-r border-white/5 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center shadow-gold">
              <Trophy size={16} className="text-black" />
            </div>
            <div>
              <div className="text-white font-display text-xl tracking-widest leading-none">SEM TREINO</div>
              <div className="text-yellow-500 font-display text-xl tracking-widest leading-none">FC</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link text-sm ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-slate-600 font-mono">v1.0.0 • Team Stats</div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/5 px-4 py-3 flex items-center justify-between" style={{ marginTop: isDemoMode ? '32px' : '0' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center">
            <Trophy size={14} className="text-black" />
          </div>
          <span className="font-display text-lg tracking-widest">
            <span className="text-white">SEM TREINO</span>
            <span className="text-yellow-500 ml-1">FC</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white p-1 transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 glass border-r border-white/5 pt-20 p-3" onClick={e => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className="md:ml-56 min-h-screen relative z-10"
        style={{ paddingTop: isDemoMode ? '80px' : undefined }}
      >
        <div className="md:pt-0 pt-16">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav md:hidden flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                isActive ? 'text-yellow-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
