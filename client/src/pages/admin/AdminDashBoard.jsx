import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import AdminLayout from './AdminLayout'
import { Badge, Avatar, gradeColor, Spinner } from '../../components/UI'

export default function AdminDashboard() {
  const [data,    setData]    = useState({ students: [], teachers: [], classes: [], grades: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getStudents(), api.getTeachers(), api.getClasses(), api.getGrades()])
      .then(([students, teachers, classes, grades]) => setData({ students, teachers, classes, grades }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const { students, teachers, classes, grades } = data
  const avgScore = grades.length ? Math.round(grades.reduce((a, g) => a + g.score, 0) / grades.length) : 0
  const counts = { Students: students.length, Teachers: teachers.length, Classes: classes.length, Grades: grades.length }

  return (
    <AdminLayout counts={counts}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back — here's today's overview.</p>
        </div>
        <div className="text-right text-sm text-muted">
          <p className="text-accent font-bold">Term 1 · 2026</p>
          <p>Academic Year 2025/2026</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { icon: '🎓', value: students.length, label: `${students.filter(s=>s.status==='Active').length} active`, color: 'accent'  },
          { icon: '👨‍🏫', value: teachers.length, label: `${teachers.filter(t=>t.status==='Active').length} active`, color: 'blue'    },
          { icon: '📚', value: classes.length,   label: 'Classes this term',                                         color: 'yellow'  },
          { icon: '📊', value: `${avgScore}%`,   label: 'Avg grade score',                                           color: 'red'     },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-${color}`} />
            <div className="text-2xl mb-3">{icon}</div>
            <div className={`font-display text-3xl font-extrabold text-${color}`}>{value}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border font-display font-bold text-sm">Recent Students</div>
          <table className="w-full">
            <thead className="bg-surface2">
              <tr>{['Student','Class','Status'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {students.slice(0,5).map((s,i) => (
                <tr key={s.id} className="hover:bg-surface2 border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} index={i} />
                      <div><p className="text-sm font-medium">{s.name}</p><p className="text-[11px] text-muted">{s.student_id}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge color="gray">{s.class}</Badge></td>
                  <td className="px-4 py-3"><Badge color={s.status==='Active'?'green':'red'}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border font-display font-bold text-sm">Recent Grades</div>
          <table className="w-full">
            <thead className="bg-surface2">
              <tr>{['Student','Subject','Score','Grade'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {grades.slice(0,6).map((g) => (
                <tr key={g.id} className="hover:bg-surface2 border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm font-medium">{g.student}</td>
                  <td className="px-4 py-3"><Badge color="blue">{g.subject}</Badge></td>
                  <td className="px-4 py-3 text-sm">{g.score}%</td>
                  <td className={`px-4 py-3 text-base font-bold ${gradeColor(g.grade)}`}>{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}