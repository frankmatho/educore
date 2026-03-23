// Badge
const badgeStyles = {
  green:  'bg-accent/10 text-accent',
  blue:   'bg-blue/10 text-blue',
  red:    'bg-red/10 text-red',
  yellow: 'bg-yellow/10 text-yellow',
  gray:   'bg-surface2 text-muted',
}
export function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[color]}`}>
      {children}
    </span>
  )
}

// Avatar
export function Avatar({ name, index }) {
  const colors = ['#4fffb0', '#4f8fff', '#ff6b6b', '#ffd166', '#c084fc', '#fb923c']
  const bg = colors[index % colors.length]
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: bg + '22', color: bg }}>
      {initials}
    </div>
  )
}

// Button
const btnStyles = {
  primary: 'bg-accent text-bg hover:bg-accent/80 font-semibold',
  ghost:   'bg-transparent text-muted border border-border hover:bg-surface2 hover:text-white',
  danger:  'bg-red/10 text-red border border-red/20 hover:bg-red/20',
}
const btnSizes = { md: 'px-4 py-2 text-sm', sm: 'px-2.5 py-1 text-xs' }
export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${btnStyles[variant]} ${btnSizes[size]}`}>
      {children}
    </button>
  )
}

// Input
export function Input({ ...props }) {
  return (
    <input className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors" {...props} />
  )
}

// Select
export function Select({ children, ...props }) {
  return (
    <select className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors cursor-pointer" {...props}>
      {children}
    </select>
  )
}

// FormField
export function FormField({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// Modal
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface border border-border rounded-2xl p-7 w-[480px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Table
export function Table({ headers, children, emptyIcon, emptyMessage, isEmpty }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-surface2">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-widest text-muted font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty
            ? <tr><td colSpan={headers.length}><div className="text-center py-12 text-muted"><div className="text-4xl mb-3">{emptyIcon}</div><p>{emptyMessage}</p></div></td></tr>
            : children}
        </tbody>
      </table>
    </div>
  )
}
export function Tr({ children }) {
  return <tr className="hover:bg-surface2 transition-colors">{children}</tr>
}
export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3.5 text-sm border-b border-border last:border-0 ${className}`}>{children}</td>
}

// Spinner
export function Spinner() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  )
}

// Page header
export function PageHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        {sub && <p className="text-muted text-sm mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// Search bar
export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">🔍</span>
      <input
        className="bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-white outline-none focus:border-accent w-56 transition-colors"
        placeholder={placeholder || 'Search…'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// Error alert
export function ErrorAlert({ message }) {
  if (!message) return null
  return (
    <div className="bg-red/10 border border-red/20 text-red text-sm rounded-lg px-4 py-3 mb-4">
      {message}
    </div>
  )
}

// Grade helpers
export const gradeColor    = (g) => ({ A: 'text-accent', B: 'text-blue', C: 'text-yellow', D: 'text-red' }[g] ?? '')
export const gradeBarColor = (g) => ({ A: '#4fffb0', B: '#4f8fff', C: '#ffd166', D: '#ff6b6b' }[g] ?? '#6b7280')
export const scoreToGrade  = (s) => s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : 'D'