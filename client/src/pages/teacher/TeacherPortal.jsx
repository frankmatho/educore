import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { Badge, Button, Modal, FormField, Input, Select, Table, Tr, Td, gradeColor, gradeBarColor, ErrorAlert, Spinner } from '../../components/ui'

/* ── Teacher Layout ───────────────────────────────────── */
function TeacherLayout({ children }) {
  const { user, logout } = useAuth()
  const NAV = [
    { to: '/teacher',        icon: '⊞', label: 'Dashboard' },
    { to: '/teacher/classes', icon: '📚', label: 'My Classes' },
    { to: '/teacher/grades',  icon: '📊', label: 'Enter Grades' },
  ]
  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-60 min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col px-4 py-6">
        <div className="font-display text-2xl font-extrabold text-accent tracking-tight mb-0.5">Edu<span className="text-white">Core</span></div>
        <p className="text-[11px] text-muted uppercase tracking-widest mb-2">Teacher Portal</p>
        <div className="bg-blue/10 text-blue text-xs font-semibold px-2 py-1 rounded-md w-fit mb-7">TEACHER</div>
        <p className="text-[10px] text-muted uppercase tracking-widest mb-2 pl-3">Menu</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==='/teacher'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all no-underline
              ${isActive ? 'bg-blue/10 text-blue' : 'text-muted hover:bg-surface2 hover:text-white'}`}>
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

/* ── Teacher Dashboard ────────────────────────────────── */
export function TeacherDashboard() {
  const { user } = useAuth()
  const [classes,  setClasses]  = useState([])
  const [grades,   setGrades]   = useState([])
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([api.getClasses(), api.getGrades(), api.getStudents()])
      .then(([c, g, s]) => { setClasses(c); setGrades(g); setStudents(s) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const myClasses = classes.filter(c => c.teacher === user?.name)
  const myGrades  = grades.filter(g => g.teacher === user?.name)
  const avgScore  = myGrades.length ? Math.round(myGrades.reduce((a,g)=>a+g.score,0)/myGrades.length) : 0

  return (
    <TeacherLayout>
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted text-sm mt-1">Here's your teaching overview for this term.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { icon: '📚', value: myClasses.length, label: 'My Classes',   color: 'blue'   },
          { icon: '📊', value: myGrades.length,  label: 'Grades Given', color: 'accent' },
          { icon: '🎯', value: `${avgScore}%`,   label: 'Avg Score',    color: 'yellow' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-${color}`} />
            <div className="text-2xl mb-3">{icon}</div>
            <div className={`font-display text-3xl font-extrabold text-${color}`}>{value}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-border font-display font-bold text-sm">My Classes</div>
        <table className="w-full">
          <thead className="bg-surface2"><tr>{['Class','Subject','Students','Room','Schedule'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {myClasses.length === 0
              ? <tr><td colSpan={5}><div className="text-center py-8 text-muted">No classes assigned yet</div></td></tr>
              : myClasses.map(c => (
                <tr key={c.id} className="hover:bg-surface2 border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-sm">{c.name}</td>
                  <td className="px-4 py-3"><Badge color="blue">{c.subject}</Badge></td>
                  <td className="px-4 py-3"><Badge color="green">{c.students}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted">{c.room}</td>
                  <td className="px-4 py-3 text-xs text-muted">{c.time}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  )
}

/* ── Teacher: Enter Grades ────────────────────────────── */
const G_BLANK = { student: '', student_id: '', subject: '', score: '', term: 'Term 1' }

export function TeacherGrades() {
  const { user } = useAuth()
  const [grades,   setGrades]   = useState([])
  const [students, setStudents] = useState([])
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(G_BLANK)
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    Promise.all([api.getGrades(), api.getStudents()])
      .then(([g, s]) => { setGrades(g.filter(x => x.teacher === user?.name)); setStudents(s) })
      .catch(console.error)
  }, [user])

  const openAdd  = () => { setForm(G_BLANK); setError(''); setModal('add') }
  const openEdit = (g) => { setForm({ student: g.student, student_id: g.student_id, subject: g.subject, score: g.score, term: g.term }); setError(''); setModal(g) }
  const save = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...form, teacher: user?.name }
      if (modal==='add') { const g = await api.createGrade(body); setGrades((p) => [g, ...p]) }
      else { const g = await api.updateGrade(modal.id, body); setGrades((p) => p.map((x) => x.id===modal.id?g:x)) }
      setModal(null)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  const del = async (id) => { if (!confirm('Delete?')) return; await api.deleteGrade(id); setGrades((p) => p.filter(g=>g.id!==id)) }
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <TeacherLayout>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Enter Grades</h1>
          <p className="text-muted text-sm mt-1">Grades you have recorded this term.</p>
        </div>
        <Button onClick={openAdd}>+ Add Grade</Button>
      </div>

      <Table headers={['Student','Subject','Score','Grade','Term','Actions']} isEmpty={grades.length===0} emptyIcon="📊" emptyMessage="No grades recorded yet">
        {grades.map((g) => (
          <Tr key={g.id}>
            <Td className="font-medium">{g.student}</Td>
            <Td><Badge color="blue">{g.subject}</Badge></Td>
            <Td><div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-surface2 overflow-hidden"><div className="h-full rounded-full" style={{width:`${g.score}%`,background:gradeBarColor(g.grade)}} /></div>{g.score}%</div></Td>
            <Td className={`text-lg font-bold ${gradeColor(g.grade)}`}>{g.grade}</Td>
            <Td><Badge color="gray">{g.term}</Badge></Td>
            <Td><div className="flex gap-1.5"><Button variant="ghost" size="sm" onClick={()=>openEdit(g)}>Edit</Button><Button variant="danger" size="sm" onClick={()=>del(g.id)}>Delete</Button></div></Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal title={modal==='add'?'Add Grade':'Edit Grade'} onClose={()=>setModal(null)}>
          <ErrorAlert message={error} />
          <FormField label="Student"><Select value={form.student} onChange={(e)=>{const s=students.find(x=>x.name===e.target.value);setForm(p=>({...p,student:e.target.value,student_id:s?.student_id||''}))}}><option value="">Select student…</option>{students.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</Select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject"><Input value={form.subject} onChange={set('subject')} /></FormField>
            <FormField label="Score (%)"><Input type="number" min="0" max="100" value={form.score} onChange={set('score')} /></FormField>
          </div>
          <FormField label="Term"><Select value={form.term} onChange={set('term')}><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select></FormField>
          <p className="text-xs text-muted mb-4">Grade auto-calculated: A≥80 · B≥65 · C≥50 · D&lt;50</p>
          <div className="flex justify-end gap-2.5 mt-2">
            <Button variant="ghost" onClick={()=>setModal(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving?'Saving…':'Save Grade'}</Button>
          </div>
        </Modal>
      )}
    </TeacherLayout>
  )
}