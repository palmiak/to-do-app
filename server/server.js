const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// get all todos by user email
app.get('/todos/:email', async (req, res) => {
    const {email} = req.params
    try {
        const todos = await pool.query(`SELECT * FROM todos WHERE user_email = $1;`, [email])
        res.json(todos.rows)
    } catch (err) {
        console.error(err)
    }
})

// add new todo
app.post('/todos', async (req, res) => {
    const {user_email, title, progress, date} = req.body
    const id = uuidv4()
    try {
        const newToDo = await pool.query(
            `INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
            [id, user_email, title, progress, date]
        )
        res.json(newToDo)
    } catch (err) {
        console.error(err)
    }
})

// edit a todo
app.put('/todos/:id', async (req, res) => {
    const {id} = req.params
    const {user_email, title, progress, date} = req.body

    try {
        const editToDo = await pool.query(
            'UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5',
            [user_email, title, progress, date, id]
        )
        res.json(editToDo)
    } catch (err) {
        console.error(err)
    }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    const {id} = req.params
    try {
        const deletedToDo = await pool.query('DELETE FROM todos WHERE id = $1', [id])
        res.json(deletedToDo)
    } catch (err) {
        console.error(err)
    }
})

//  sign up
app.post('/signup', async (req, res) => {
    const {email, password} = req.body
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
            [email, hashedPassword])

        const token = jwt.sign({email}, 'secret', {expiresIn: '1h'})
        const error = signUp.name === 'error'

        if (!error) {
            res.json({email, token})
        } else {
            res.json({detail: signUp.detail})
        }
    } catch (err) {
        res.json(err)
        console.error(err)
    }
})

// log in
app.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (!users.rows.length) return res.json("User not found")
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', {expiresIn: '1h'})

        if (success) {
            res.json({"email": users.rows[0].email, token})
        } else {
            res.json({detail: "Login failed"})
        }
    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, () => console.log('server is running on PORT ' + PORT))