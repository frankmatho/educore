require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoutes    = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const classRoutes   = require('./routes/classRoutes')
const gradeRoutes   = require('./routes/gradeRoutes')

const app  = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/classes',  classRoutes)
app.use('/api/grades',   gradeRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))