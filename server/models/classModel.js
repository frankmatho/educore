const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM classes ORDER BY created_at DESC')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM classes WHERE id = $1', [id])
  return result.rows[0]
}

const create = async ({ class_id, name, subject, teacher, students, room, time }) => {
  const result = await pool.query(
    `INSERT INTO classes (class_id, name, subject, teacher, students, room, time)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [class_id, name, subject, teacher, students, room, time]
  )
  return result.rows[0]
}

const update = async (id, { name, subject, teacher, students, room, time }) => {
  const result = await pool.query(
    `UPDATE classes
     SET name=$1, subject=$2, teacher=$3, students=$4, room=$5, time=$6
     WHERE id=$7
     RETURNING *`,
    [name, subject, teacher, students, room, time, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query('DELETE FROM classes WHERE id = $1', [id])
}

module.exports = { getAll, getById, create, update, remove }