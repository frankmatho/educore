const Class = require('../models/classModel')

const uid = () => 'CLS' + Math.random().toString(36).slice(2, 6).toUpperCase()

const getClasses = async (req, res) => {
  try {
    res.json(await Class.getAll())
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const getClass = async (req, res) => {
  try {
    const cls = await Class.getById(req.params.id)
    if (!cls) return res.status(404).json({ message: 'Class not found' })
    res.json(cls)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createClass = async (req, res) => {
  try {
    const cls = await Class.create({ ...req.body, class_id: uid() })
    res.status(201).json(cls)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateClass = async (req, res) => {
  try {
    const cls = await Class.update(req.params.id, req.body)
    if (!cls) return res.status(404).json({ message: 'Class not found' })
    res.json(cls)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteClass = async (req, res) => {
  try {
    await Class.remove(req.params.id)
    res.json({ message: 'Class deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getClasses, getClass, createClass, updateClass, deleteClass }