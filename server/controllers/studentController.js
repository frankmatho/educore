const Student = require('../models/studentModel')

const uid = () => 'STU' + Math.random().toString(36).slice(2, 6).toUpperCase()

// GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.getAll()
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/students/:id
const getStudent = async (req, res) => {
  try {
    const student = await Student.getById(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const student = await Student.create({ ...req.body, student_id: uid() })
    res.status(201).json(student)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.update(req.params.id, req.body)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    await Student.remove(req.params.id)
    res.json({ message: 'Student deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent }