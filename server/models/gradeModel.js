const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM grades ORDER BY created_at DESC')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM grades WHERE id = $1', [id])
  return result.rows[0]
}

const create = async ({ grade_id, student, student_id, subject, score, grade, term, teacher }) => {
  const result = await pool.query(
    `INSERT INTO grades (grade_id, student, student_id, subject, score, grade, term, teacher)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [grade_id, student, student_id, subject, score, grade, term, teacher]
  )
  return result.rows[0]
}

const update = async (id, { student, student_id, subject, score, grade, term, teacher }) => {
  const result = await pool.query(
    `UPDATE grades
     SET student=$1, student_id=$2, subject=$3, score=$4, grade=$5, term=$6, teacher=$7
     WHERE id=$8
     RETURNING *`,
    [student, student_id, subject, score, grade, term, teacher, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query('DELETE FROM grades WHERE id = $1', [id])
}

module.exports = { getAll, getById, create, update, remove }