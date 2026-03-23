const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id])
  return result.rows[0]
}

const create = async ({ student_id, name, age, class: cls, gender, email, status }) => {
  const result = await pool.query(
    `INSERT INTO students (student_id, name, age, class, gender, email, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [student_id, name, age, cls, gender, email, status]
  )
  return result.rows[0]
}

const update = async (id, { name, age, class: cls, gender, email, status }) => {
  const result = await pool.query(
    `UPDATE students
     SET name=$1, age=$2, class=$3, gender=$4, email=$5, status=$6
     WHERE id=$7
     RETURNING *`,
    [name, age, cls, gender, email, status, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query('DELETE FROM students WHERE id = $1', [id])
}

module.exports = { getAll, getById, create, update, remove }