import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirects to /login if not authenticated
// Redirects to their role dashboard if wrong role
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />
  }

  return children
}