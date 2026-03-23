const router = require('express').Router()
const { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(getTeachers)
  .post(createTeacher)

router.route('/:id')
  .get(getTeacher)
  .put(updateTeacher)
  .delete(deleteTeacher)

module.exports = router