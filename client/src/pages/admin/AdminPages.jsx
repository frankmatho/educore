import { useState, useEffect, useMemo } from 'react'
import { api } from '../../api/client'
import AdminLayout from './AdminLayout'
import { Avatar, Badge, Button, Modal, FormField, Input, Select, Table, Tr, Td, PageHeader, SearchBar, ErrorAlert, gradeColor, gradeBarColor, scoreToGrade } from '../../components/UI'

/* ── Teachers ─────────────────────────────────────────── */
const T_BLANK = { name: '', subject: '', classes: '', email: '', status: 'Active' }

export function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(T_BLANK)
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => { api.getTeachers().then(setTeachers).catch(console.error) }, [])

  const filtered = useMemo(() =>
    teachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase()))
  , [teachers, search])

  const openAdd  = () => { setForm(T_BLANK); setError(''); setModal('add') }
  const openEdit = (t) => { setForm({ name: t.name, subject: t.subject, classes: t.classes, email: t.email, status: t.status }); setError(''); setModal(t) }
  const save = async () => {
    setSaving(true); setError('')
    try {
      if (modal === 'add') { const t = await api.createTeacher(form); setTeachers((p) => [t, ...p]) }
      else { const t = await api.updateTeacher(modal.id, form); setTeachers((p) => p.map((x) => x.id === modal.id ? t : x)) }
      setModal(null)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  const del = async (id) => { if (!confirm('Delete?')) return; await api.deleteTeacher(id); setTeachers((p) => p.filter((t) => t.id !== id)) }
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <AdminLayout counts={{ Teachers: teachers.length }}>
      <PageHeader title="Teachers" sub={`${teachers.length} on staff`} action={<Button onClick={openAdd}>+ Add Teacher</Button>} />
      <div className="flex gap-2.5 mb-5"><SearchBar value={search} onChange={setSearch} placeholder="Search teachers…" /></div>
      <Table headers={['Teacher','Subject','Classes','Email','Status','Actions']} isEmpty={filtered.length===0} emptyIcon="👨‍🏫" emptyMessage="No teachers found">
        {filtered.map((t, i) => (
          <Tr key={t.id}>
            <Td><div className="flex items-center gap-2.5"><Avatar name={t.name} index={i+2} /><div><p className="font-medium">{t.name}</p><p className="text-[11px] text-muted">{t.teacher_id}</p></div></div></Td>
            <Td><Badge color="blue">{t.subject}</Badge></Td>
            <Td className="text-muted text-xs">{t.classes}</Td>
            <Td className="text-muted text-xs">{t.email}</Td>
            <Td><Badge color={t.status==='Active'?'green':t.status==='On Leave'?'yellow':'red'}>{t.status}</Badge></Td>
            <Td><div className="flex gap-1.5"><Button variant="ghost" size="sm" onClick={()=>openEdit(t)}>Edit</Button><Button variant="danger" size="sm" onClick={()=>del(t.id)}>Delete</Button></div></Td>
          </Tr>
        ))}
      </Table>
      {modal && (
        <Modal title={modal==='add'?'Add Teacher':'Edit Teacher'} onClose={()=>setModal(null)}>
          <ErrorAlert message={error} />
          <FormField label="Full Name"><Input value={form.name} onChange={set('name')} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject"><Input value={form.subject} onChange={set('subject')} /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={set('status')}><option>Active</option><option>On Leave</option><option>Inactive</option></Select></FormField>
          </div>
          <FormField label="Classes"><Input placeholder="e.g. Form 3A, Form 4B" value={form.classes} onChange={set('classes')} /></FormField>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
          <div className="flex justify-end gap-2.5 mt-6">
            <Button variant="ghost" onClick={()=>setModal(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving?'Saving…':'Save Teacher'}</Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}

/* ── Classes ──────────────────────────────────────────── */
const C_BLANK = { name: '', subject: '', teacher: '', students: '', room: '', time: '' }

export function AdminClasses() {
  const [classes,  setClasses]  = useState([])
  const [teachers, setTeachers] = useState([])
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(C_BLANK)
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    Promise.all([api.getClasses(), api.getTeachers()]).then(([c, t]) => { setClasses(c); setTeachers(t) }).catch(console.error)
  }, [])

  const filtered = useMemo(() =>
    classes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.subject?.toLowerCase().includes(search.toLowerCase()))
  , [classes, search])

  const openAdd  = () => { setForm(C_BLANK); setError(''); setModal('add') }
  const openEdit = (c) => { setForm({ name: c.name, subject: c.subject, teacher: c.teacher, students: c.students, room: c.room, time: c.time }); setError(''); setModal(c) }
  const save = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...form, students: Number(form.students) || 0 }
      if (modal === 'add') { const c = await api.createClass(body); setClasses((p) => [c, ...p]) }
      else { const c = await api.updateClass(modal.id, body); setClasses((p) => p.map((x) => x.id === modal.id ? c : x)) }
      setModal(null)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  const del = async (id) => { if (!confirm('Delete?')) return; await api.deleteClass(id); setClasses((p) => p.filter((c) => c.id !== id)) }
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <AdminLayout counts={{ Classes: classes.length }}>
      <PageHeader title="Class Schedule" sub={`${classes.length} classes this term`} action={<Button onClick={openAdd}>+ Add Class</Button>} />
      <div className="flex gap-2.5 mb-5"><SearchBar value={search} onChange={setSearch} placeholder="Search classes…" /></div>
      <Table headers={['Class','Subject','Teacher','Students','Room','Schedule','Actions']} isEmpty={filtered.length===0} emptyIcon="📚" emptyMessage="No classes found">
        {filtered.map((c) => (
          <Tr key={c.id}>
            <Td><p className="font-medium">{c.name}</p><p className="text-[11px] text-muted">{c.class_id}</p></Td>
            <Td><Badge color="blue">{c.subject}</Badge></Td>
            <Td>{c.teacher}</Td>
            <Td><Badge color="green">{c.students} students</Badge></Td>
            <Td className="text-muted text-xs">{c.room}</Td>
            <Td className="text-muted text-xs">{c.time}</Td>
            <Td><div className="flex gap-1.5"><Button variant="ghost" size="sm" onClick={()=>openEdit(c)}>Edit</Button><Button variant="danger" size="sm" onClick={()=>del(c.id)}>Delete</Button></div></Td>
          </Tr>
        ))}
      </Table>
      {modal && (
        <Modal title={modal==='add'?'Add Class':'Edit Class'} onClose={()=>setModal(null)}>
          <ErrorAlert message={error} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class Name"><Input placeholder="e.g. Form 3A" value={form.name} onChange={set('name')} /></FormField>
            <FormField label="Subject"><Input value={form.subject} onChange={set('subject')} /></FormField>
          </div>
          <FormField label="Teacher"><Select value={form.teacher} onChange={set('teacher')}><option value="">Select teacher…</option>{teachers.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}</Select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="No. Students"><Input type="number" value={form.students} onChange={set('students')} /></FormField>
            <FormField label="Room"><Input placeholder="e.g. Room 7" value={form.room} onChange={set('room')} /></FormField>
          </div>
          <FormField label="Schedule"><Input placeholder="e.g. Mon–Fri 9:00–10:00 AM" value={form.time} onChange={set('time')} /></FormField>
          <div className="flex justify-end gap-2.5 mt-6">
            <Button variant="ghost" onClick={()=>setModal(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving?'Saving…':'Save Class'}</Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}

/* ── Grades ───────────────────────────────────────────── */
const G_BLANK = { student: '', student_id: '', subject: '', score: '', term: 'Term 1', teacher: '' }

export function AdminGrades() {
  const [grades,   setGrades]   = useState([])
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [search,   setSearch]   = useState('')
  const [filterG,  setFilterG]  = useState('All')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(G_BLANK)
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    Promise.all([api.getGrades(), api.getStudents(), api.getTeachers()])
      .then(([g, s, t]) => { setGrades(g); setStudents(s); setTeachers(t) }).catch(console.error)
  }, [])

  const filtered = useMemo(() =>
    grades.filter((g) => (filterG==='All'||g.grade===filterG) && (g.student.toLowerCase().includes(search.toLowerCase())||g.subject?.toLowerCase().includes(search.toLowerCase())))
  , [grades, search, filterG])

  const avg = filtered.length ? Math.round(filtered.reduce((a,g)=>a+g.score,0)/filtered.length) : 0

  const openAdd  = () => { setForm(G_BLANK); setError(''); setModal('add') }
  const openEdit = (g) => { setForm({ student: g.student, student_id: g.student_id, subject: g.subject, score: g.score, term: g.term, teacher: g.teacher }); setError(''); setModal(g) }
  const save = async () => {
    setSaving(true); setError('')
    try {
      if (modal==='add') { const g = await api.createGrade(form); setGrades((p) => [g, ...p]) }
      else { const g = await api.updateGrade(modal.id, form); setGrades((p) => p.map((x) => x.id===modal.id?g:x)) }
      setModal(null)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  const del = async (id) => { if (!confirm('Delete?')) return; await api.deleteGrade(id); setGrades((p) => p.filter((g) => g.id!==id)) }
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <AdminLayout counts={{ Grades: grades.length }}>
      <PageHeader title="Grades & Results" sub={`${grades.length} records · Avg: ${avg}%`} action={<Button onClick={openAdd}>+ Add Grade</Button>} />
      <div className="flex gap-2.5 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search grades…" />
        <select className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer" value={filterG} onChange={(e)=>setFilterG(e.target.value)}>
          <option>All</option><option>A</option><option>B</option><option>C</option><option>D</option>
        </select>
      </div>
      <Table headers={['Student','Subject','Score','Grade','Term','Teacher','Actions']} isEmpty={filtered.length===0} emptyIcon="📊" emptyMessage="No grade records">
        {filtered.map((g) => (
          <Tr key={g.id}>
            <Td className="font-medium">{g.student}</Td>
            <Td><Badge color="blue">{g.subject}</Badge></Td>
            <Td><div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-surface2 overflow-hidden"><div className="h-full rounded-full" style={{width:`${g.score}%`,background:gradeBarColor(g.grade)}} /></div>{g.score}%</div></Td>
            <Td className={`text-lg font-bold ${gradeColor(g.grade)}`}>{g.grade}</Td>
            <Td><Badge color="gray">{g.term}</Badge></Td>
            <Td className="text-muted text-xs">{g.teacher}</Td>
            <Td><div className="flex gap-1.5"><Button variant="ghost" size="sm" onClick={()=>openEdit(g)}>Edit</Button><Button variant="danger" size="sm" onClick={()=>del(g.id)}>Delete</Button></div></Td>
          </Tr>
        ))}
      </Table>
      {modal && (
        <Modal title={modal==='add'?'Add Grade':'Edit Grade'} onClose={()=>setModal(null)}>
          <ErrorAlert message={error} />
          <FormField label="Student"><Select value={form.student} onChange={(e)=>{const s=students.find(x=>x.name===e.target.value);setForm(p=>({...p,student:e.target.value,student_id:s?.student_id||''}))}}>
            <option value="">Select student…</option>{students.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</Select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject"><Input value={form.subject} onChange={set('subject')} /></FormField>
            <FormField label="Score (%)"><Input type="number" min="0" max="100" value={form.score} onChange={set('score')} /></FormField>
          </div>
          <FormField label="Teacher"><Select value={form.teacher} onChange={set('teacher')}><option value="">Select teacher…</option>{teachers.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}</Select></FormField>
          <FormField label="Term"><Select value={form.term} onChange={set('term')}><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select></FormField>
          <p className="text-xs text-muted mb-4">Grade auto-calculated: A≥80 · B≥65 · C≥50 · D&lt;50</p>
          <div className="flex justify-end gap-2.5 mt-2">
            <Button variant="ghost" onClick={()=>setModal(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving?'Saving…':'Save Grade'}</Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}