
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

let pool;
async function initDb() {
  pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}
initDb().catch(err => {
  console.error('Failed to initialize DB pool', err);
  process.exit(1);
});

// Routes
app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/students', async (req, res) => {
  try {
    const { name, email, course } = req.body;
    if (!name || !email || !course) return res.status(400).json({ error: 'Missing fields' });
    const [result] = await pool.query('INSERT INTO students (name, email, course) VALUES (?, ?, ?)', [name, email, course]);
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course } = req.body;
    await pool.query('UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?', [name, email, course, id]);
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM students WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
