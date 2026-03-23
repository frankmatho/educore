import { useState, useEffect, useMemo } from 'react'
import { api } from '../../api/client'
import AdminLayout from './AdminLayout'
import { Avatar, Badge, Button, Modal, FormField, Input, Select, Table, Tr, Td, PageHeader, SearchBar, ErrorAlert } from '../../components/ui'

const BLANK = { name: '', age: '', class: '', gender: 'Female', email: '', status: 'Active' }

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(BLANK)
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => { api.getStudents().then(setStudents).catch(console.error) }, [])

  const filtered = useMemo(() =>
    students.filter((s) =>
      (filter === 'All' || s.status === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    ), [students, search, filter])

  const openAdd  = () => { setForm(BLANK); setError(''); setModal('add') }
  const openEdit = (s) => { setForm({ name: s.name, age: s.age, class: s.class, gender: s.gender, email: s.email, status: s.status }); setError(''); setModal(s) }

  const save = async () => {
    setSaving(true); setError('')
    try {
      if (modal === 'add') {
        const s = await api.createStudent(form)
        setStudents((p) => [s, ...p])
      } else {
        const s = await api.updateStudent(modal.id, form)
        setStudents((p) => p.map((x) => x.id === modal.id ? s : x))
      }
      setModal(null)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete this student?')) return
    await api.deleteStudent(id)
    setStudents((p) => p.filter((s) => s.id !== id))
  }

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  return (
    <AdminLayout counts={{ Students: students.length }}>
      <PageHeader
        title="Students"
        sub={`${students.length} enrolled · ${students.filter(s=>s.status==='Active').length} active`}
        action={<Button onClick={openAdd}>+ Add Student</Button>}
      />

      <div className="flex gap-2.5 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" />
        <select className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
          value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      <Table headers={['Student','Age','Class','Gender','Email','Status','Actions']}
        isEmpty={filtered.length === 0} emptyIcon="👤" emptyMessage="No students found">
        {filtered.map((s, i) => (
          <Tr key={s.id}>
            <Td><div className="flex items-center gap-2.5">
              <Avatar name={s.name} index={i} />
              <div><p className="font-medium">{s.name}</p><p className="text-[11px] text-muted">{s.student_id}</p></div>
            </div></Td>
            <Td>{s.age}</Td>
            <Td><Badge color="gray">{s.class}</Badge></Td>
            <Td>{s.gender}</Td>
            <Td className="text-muted text-xs">{s.email}</Td>
            <Td><Badge color={s.status==='Active'?'green':'red'}>{s.status}</Badge></Td>
            <Td><div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => del(s.id)}>Delete</Button>
            </div></Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Student' : 'Edit Student'} onClose={() => setModal(null)}>
          <ErrorAlert message={error} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name"><Input value={form.name} onChange={set('name')} /></FormField>
            <FormField label="Age"><Input type="number" value={form.age} onChange={set('age')} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class"><Input placeholder="e.g. Form 3A" value={form.class} onChange={set('class')} /></FormField>
            <FormField label="Gender"><Select value={form.gender} onChange={set('gender')}><option>Female</option><option>Male</option><option>Other</option></Select></FormField>
          </div>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
          <FormField label="Status"><Select value={form.status} onChange={set('status')}><option>Active</option><option>Inactive</option></Select></FormField>
          <div className="flex justify-end gap-2.5 mt-6">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Student'}</Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}