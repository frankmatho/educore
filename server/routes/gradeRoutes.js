const router = require('express').Router()
const { getGrades, getGrade, createGrade, updateGrade, deleteGrade } = require('../controllers/gradeController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(getGrades)
  .post(createGrade)

router.route('/:id')
  .get(getGrade)
  .put(updateGrade)
  .delete(deleteGrade)

module.exports = router