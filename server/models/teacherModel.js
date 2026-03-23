const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM teachers ORDER BY created_at DESC')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [id])
  return result.rows[0]
}

const create = async ({ teacher_id, name, subject, classes, email, status }) => {
  const result = await pool.query(
    `INSERT INTO teachers (teacher_id, name, subject, classes, email, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [teacher_id, name, subject, classes, email, status]
  )
  return result.rows[0]
}

const update = async (id, { name, subject, classes, email, status }) => {
  const result = await pool.query(
    `UPDATE teachers
     SET name=$1, subject=$2, classes=$3, email=$4, status=$5
     WHERE id=$6
     RETURNING *`,
    [name, subject, classes, email, status, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query('DELETE FROM teachers WHERE id = $1', [id])
}

module.exports = { getAll, getById, create, update, remove }