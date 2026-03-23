const Grade = require('../models/gradeModel')

const uid = () => 'GRD' + Math.random().toString(36).slice(2, 6).toUpperCase()

const scoreToGrade = (score) => {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

const getGrades = async (req, res) => {
  try {
    res.json(await Grade.getAll())
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const getGrade = async (req, res) => {
  try {
    const grade = await Grade.getById(req.params.id)
    if (!grade) return res.status(404).json({ message: 'Grade not found' })
    res.json(grade)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createGrade = async (req, res) => {
  try {
    const score = Number(req.body.score)
    const grade = await Grade.create({
      ...req.body,
      score,
      grade: scoreToGrade(score),
      grade_id: uid(),
    })
    res.status(201).json(grade)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateGrade = async (req, res) => {
  try {
    const score = Number(req.body.score)
    const grade = await Grade.update(req.params.id, {
      ...req.body,
      score,
      grade: scoreToGrade(score),
    })
    if (!grade) return res.status(404).json({ message: 'Grade not found' })
    res.json(grade)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteGrade = async (req, res) => {
  try {
    await Grade.remove(req.params.id)
    res.json({ message: 'Grade deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getGrades, getGrade, createGrade, updateGrade, deleteGrade }