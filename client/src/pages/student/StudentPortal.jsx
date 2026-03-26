import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { Badge, gradeColor, gradeBarColor, Spinner } from '../../components/UI'

/* ── Student Layout ───────────────────────────────────── */
function StudentLayout({ children }) {
  const { user, logout } = useAuth()
  const NAV = [
    { to: '/student',          icon: '⊞', label: 'Dashboard' },
    { to: '/student/grades',   icon: '📊', label: 'My Grades'    },
    { to: '/student/schedule', icon: '📚', label: 'My Schedule'  },
  ]
  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-60 min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col px-4 py-6">
        <div className="font-display text-2xl font-extrabold text-accent tracking-tight mb-0.5">Edu<span className="text-white">Core</span></div>
        <p className="text-[11px] text-muted uppercase tracking-widest mb-2">Student Portal</p>
        <div className="bg-yellow/10 text-yellow text-xs font-semibold px-2 py-1 rounded-md w-fit mb-7">STUDENT</div>
        <p className="text-[10px] text-muted uppercase tracking-widest mb-2 pl-3">Menu</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==='/student'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all no-underline
              ${isActive ? 'bg-yellow/10 text-yellow' : 'text-muted hover:bg-surface2 hover:text-white'}`}>
            <span className="text-lg w-5 text-center">{icon}</span>{label}
          </NavLink>
        ))}
        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-sm font-semibold text-white">{user?.name}</p>
          <p className="text-xs text-muted mb-3">{user?.email}</p>
          <button onClick={logout} className="text-xs text-red hover:text-red/80 transition-colors cursor-pointer">Sign out →</button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  )
}

/* ── Student Dashboard ────────────────────────────────── */
export function StudentDashboard() {
  const { user } = useAuth()
  const [grades,  setGrades]  = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getGrades(), api.getClasses()])
      .then(([g, c]) => {
        setGrades(g.filter(x => x.student === user?.name))
        setClasses(c)
      })
      .catch(console.error).finally(() => setLoading(false))
  }, [user])

  if (loading) return <Spinner />

  const avgScore = grades.length ? Math.round(grades.reduce((a,g)=>a+g.score,0)/grades.length) : 0
  const best     = grades.length ? grades.reduce((a,g)=>g.score>a.score?g:a, grades[0]) : null
  const gradeCount = { A: 0, B: 0, C: 0, D: 0 }
  grades.forEach(g => { if (gradeCount[g.grade] !== undefined) gradeCount[g.grade]++ })

  return (
    <StudentLayout>
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted text-sm mt-1">Here's your academic overview for this term.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { icon: '📊', value: grades.length,   label: 'Results this term',  color: 'yellow' },
          { icon: '🎯', value: `${avgScore}%`,  label: 'Average score',      color: 'accent' },
          { icon: '🏆', value: best?.grade??'—', label: best ? `Best: ${best.subject}` : 'No grades yet', color: 'blue' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-${color}`} />
            <div className="text-2xl mb-3">{icon}</div>
            <div className={`font-display text-3xl font-extrabold text-${color}`}>{value}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Grade breakdown */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-4">Grade Breakdown</h3>
          {Object.entries(gradeCount).map(([grade, count]) => (
            <div key={grade} className="flex items-center gap-3 mb-3">
              <span className={`w-6 text-base font-bold ${gradeColor(grade)}`}>{grade}</span>
              <div className="flex-1 h-2 bg-surface2 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: grades.length ? `${(count/grades.length)*100}%` : '0%', background: gradeBarColor(grade) }} />
              </div>
              <span className="text-xs text-muted w-4">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border font-display font-bold text-sm">Recent Results</div>
          <table className="w-full">
            <thead className="bg-surface2"><tr>{['Subject','Score','Grade'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {grades.slice(0,5).map(g => (
                <tr key={g.id} className="hover:bg-surface2 border-b border-border last:border-0">
                  <td className="px-4 py-3"><Badge color="blue">{g.subject}</Badge></td>
                  <td className="px-4 py-3 text-sm">{g.score}%</td>
                  <td className={`px-4 py-3 text-lg font-bold ${gradeColor(g.grade)}`}>{g.grade}</td>
                </tr>
              ))}
              {grades.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted text-sm">No results yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  )
}

/* ── Student: My Grades ───────────────────────────────── */
export function StudentGrades() {
  const { user } = useAuth()
  const [grades,  setGrades]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGrades()
      .then(g => setGrades(g.filter(x => x.student === user?.name)))
      .catch(console.error).finally(() => setLoading(false))
  }, [user])

  if (loading) return <Spinner />

  const avg = grades.length ? Math.round(grades.reduce((a,g)=>a+g.score,0)/grades.length) : 0

  return (
    <StudentLayout>
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold">My Grades</h1>
        <p className="text-muted text-sm mt-1">{grades.length} results · Average: {avg}%</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-surface2">
            <tr>{['Subject','Score','Grade','Term','Teacher'].map(h=><th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {grades.length === 0
              ? <tr><td colSpan={5}><div className="text-center py-12 text-muted"><div className="text-4xl mb-3">📊</div><p>No grades recorded yet</p></div></td></tr>
              : grades.map(g => (
                <tr key={g.id} className="hover:bg-surface2 border-b border-border last:border-0">
                  <td className="px-4 py-3.5"><Badge color="blue">{g.subject}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface2 overflow-hidden"><div className="h-full rounded-full" style={{width:`${g.score}%`,background:gradeBarColor(g.grade)}} /></div>
                      <span className="text-sm">{g.score}%</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3.5 text-xl font-bold ${gradeColor(g.grade)}`}>{g.grade}</td>
                  <td className="px-4 py-3.5"><Badge color="gray">{g.term}</Badge></td>
                  <td className="px-4 py-3.5 text-xs text-muted">{g.teacher}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </StudentLayout>
  )
}

/* ── Student: My Schedule ─────────────────────────────── */
export function StudentSchedule() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getClasses().then(setClasses).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <StudentLayout>
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold">My Schedule</h1>
        <p className="text-muted text-sm mt-1">Classes running this term.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {classes.map(c => (
          <div key={c.id} className="bg-surface border border-border rounded-xl p-5 hover:border-blue/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display font-bold text-base">{c.name}</p>
                <p className="text-xs text-muted mt-0.5">{c.class_id}</p>
              </div>
              <Badge color="blue">{c.subject}</Badge>
            </div>
            <div className="space-y-1.5 text-xs text-muted">
              <p>👨‍🏫 <span className="text-white">{c.teacher}</span></p>
              <p>🚪 <span className="text-white">{c.room}</span></p>
              <p>🕐 <span className="text-white">{c.time}</span></p>
              <p>👥 <span className="text-white">{c.students} students</span></p>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted">
            <div className="text-4xl mb-3">📚</div>
            <p>No classes scheduled yet</p>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}