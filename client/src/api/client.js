const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  // Auth
  login:          (body) => req('POST', '/auth/login', body),
  register:       (body) => req('POST', '/auth/register', body),
  me:             ()     => req('GET',  '/auth/me'),

  // Students
  getStudents:    ()     => req('GET',  '/students'),
  getStudent:     (id)   => req('GET',  `/students/${id}`),
  createStudent:  (body) => req('POST', '/students', body),
  updateStudent:  (id, body) => req('PUT', `/students/${id}`, body),
  deleteStudent:  (id)   => req('DELETE', `/students/${id}`),

  // Teachers
  getTeachers:    ()     => req('GET',  '/teachers'),
  getTeacher:     (id)   => req('GET',  `/teachers/${id}`),
  createTeacher:  (body) => req('POST', '/teachers', body),
  updateTeacher:  (id, body) => req('PUT', `/teachers/${id}`, body),
  deleteTeacher:  (id)   => req('DELETE', `/teachers/${id}`),

  // Classes
  getClasses:     ()     => req('GET',  '/classes'),
  getClass:       (id)   => req('GET',  `/classes/${id}`),
  createClass:    (body) => req('POST', '/classes', body),
  updateClass:    (id, body) => req('PUT', `/classes/${id}`, body),
  deleteClass:    (id)   => req('DELETE', `/classes/${id}`),

  // Grades
  getGrades:      ()     => req('GET',  '/grades'),
  getGrade:       (id)   => req('GET',  `/grades/${id}`),
  createGrade:    (body) => req('POST', '/grades', body),
  updateGrade:    (id, body) => req('PUT', `/grades/${id}`, body),
  deleteGrade:    (id)   => req('DELETE', `/grades/${id}`),
}