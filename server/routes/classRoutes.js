const router = require('express').Router()
const { getClasses, getClass, createClass, updateClass, deleteClass } = require('../controllers/classController')
const { protect } = require('../middleware/auth')
 
router.use(protect)
 
router.route('/')
  .get(getClasses)
  .post(createClass)
 
router.route('/:id')
  .get(getClass)
  .put(updateClass)
  .delete(deleteClass)
 
module.exports = router