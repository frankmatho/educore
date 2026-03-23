import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin',          icon: '⊞', label: 'Dashboard'  },
  { to: '/admin/students', icon: '🎓', label: 'Students'   },
  { to: '/admin/teachers', icon: '👨‍🏫', label: 'Teachers'   },
  { to: '/admin/classes',  icon: '📚', label: 'Classes'    },
  { to: '/admin/grades',   icon: '📊', label: 'Grades'     },
]

export default function AdminLayout({ children, counts = {} }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col px-4 py-6">
        <div className="font-display text-2xl font-extrabold text-accent tracking-tight mb-0.5">
          Edu<span className="text-white">Core</span>
        </div>
        <p className="text-[11px] text-muted uppercase tracking-widest mb-2">Admin Panel</p>
        <div className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-md w-fit mb-7">ADMIN</div>

        <p className="text-[10px] text-muted uppercase tracking-widest mb-2 pl-3">Main Menu</p>

        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all no-underline
              ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface2 hover:text-white'}`}>
            <span className="text-lg w-5 text-center">{icon}</span>
            <span>{label}</span>
            {counts[label] !== undefined && (
              <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-surface2 text-muted">{counts[label]}</span>
            )}
          </NavLink>
        ))}

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-sm font-semibold text-white">{user?.name}</p>
          <p className="text-xs text-muted mb-3">{user?.email}</p>
          <button onClick={logout}
            className="text-xs text-red hover:text-red/80 transition-colors cursor-pointer">
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  )
}