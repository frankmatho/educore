const router = require('express').Router()
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(getStudents)
  .post(createStudent)

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent)

module.exports = router