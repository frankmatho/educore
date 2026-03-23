const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User   = require('../models/userModel')

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' })

    const existing = await User.findByEmail(email)
    if (existing)
      return res.status(409).json({ message: 'Email already in use' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.createUser({ name, email, hashedPassword, role })
    const token = generateToken(user)

    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findByEmail(email)
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = generateToken(user)

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user })
}

module.exports = { register, login, getMe }