const COLORS = ['#4fffb0', '#4f8fff', '#ff6b6b', '#ffd166', '#c084fc', '#fb923c']

export const uid = (prefix) =>
  prefix + Math.random().toString(36).slice(2, 6).toUpperCase()

export const getAvatar = (name, index) => ({
  bg: COLORS[index % COLORS.length],
  initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
})

export const scoreToGrade = (score) => {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

export const gradeColor = (g) =>
  ({ A: 'text-accent', B: 'text-blue', C: 'text-yellow', D: 'text-red' }[g] ?? '')

export const gradeBarColor = (g) =>
  ({ A: '#4fffb0', B: '#4f8fff', C: '#ffd166', D: '#ff6b6b' }[g] ?? '#6b7280')