import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorAlert } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      // Redirect based on role
      navigate(`/${user.role}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display text-4xl font-extrabold text-accent tracking-tight">
            Edu<span className="text-white">Core</span>
          </div>
          <p className="text-muted text-sm mt-2">School Management System</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <h2 className="font-display text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-6">Sign in to your account to continue</p>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="you@school.edu"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-bg font-semibold rounded-lg py-2.5 text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Role hint */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted text-center mb-3">Demo accounts</p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="bg-surface2 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-accent font-semibold">Admin</span>
                <span className="text-muted">admin@school.edu</span>
              </div>
              <div className="bg-surface2 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-blue font-semibold">Teacher</span>
                <span className="text-muted">teacher@school.edu</span>
              </div>
              <div className="bg-surface2 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-yellow font-semibold">Student</span>
                <span className="text-muted">student@school.edu</span>
              </div>
            </div>
            <p className="text-xs text-muted text-center mt-2">Password: <span className="text-white">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}