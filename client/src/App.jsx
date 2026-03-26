import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'

// Admin
import AdminDashboard from './pages/admin/AdminDashBoard'
import AdminStudents  from './pages/admin/AdminStudents'
import { AdminTeachers, AdminClasses, AdminGrades } from './pages/admin/AdminPages'

// Teacher
import { TeacherDashboard, TeacherGrades } from './pages/teacher/TeacherPortal'

// Student
import { StudentDashboard, StudentGrades, StudentSchedule } from './pages/student/StudentPortal'

function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user)   return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"      element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/teachers" element={<ProtectedRoute role="admin"><AdminTeachers /></ProtectedRoute>} />
      <Route path="/admin/classes"  element={<ProtectedRoute role="admin"><AdminClasses /></ProtectedRoute>} />
      <Route path="/admin/grades"   element={<ProtectedRoute role="admin"><AdminGrades /></ProtectedRoute>} />

      {/* Teacher routes */}
      <Route path="/teacher"        element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/grades" element={<ProtectedRoute role="teacher"><TeacherGrades /></ProtectedRoute>} />

      {/* Student routes */}
      <Route path="/student"           element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/grades"    element={<ProtectedRoute role="student"><StudentGrades /></ProtectedRoute>} />
      <Route path="/student/schedule"  element={<ProtectedRoute role="student"><StudentSchedule /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}