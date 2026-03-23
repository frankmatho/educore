const Teacher = require('../models/teacherModel')

const uid = () => 'TCH' + Math.random().toString(36).slice(2, 6).toUpperCase()

const getTeachers = async (req, res) => {
  try {
    res.json(await Teacher.getAll())
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.getById(req.params.id)
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' })
    res.json(teacher)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create({ ...req.body, teacher_id: uid() })
    res.status(201).json(teacher)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.update(req.params.id, req.body)
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' })
    res.json(teacher)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteTeacher = async (req, res) => {
  try {
    await Teacher.remove(req.params.id)
    res.json({ message: 'Teacher deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher }