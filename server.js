const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Set up MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Replace with your MySQL username
    password: '',       // Replace with your MySQL password
    database: 'task_manager'
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Signup Endpoint (Create Account)
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            // Store the new user
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        bcrypt.compare(password, result[0].password, (err, match) => {
            if (err) throw err;
            if (!match) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Send a success message (authentication can be handled with JWT in a real app)
            res.status(200).json({ message: 'Login successful' });
        });
    });
});

// Task Endpoints

// Get Tasks
app.get('/tasks', (req, res) => {
    const userId = 1;  // You would fetch this from the logged-in user session or JWT

    db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
});

// Add Task
app.post('/tasks', (req, res) => {
    const { title, description, priority, due_date } = req.body;
    const userId = 1;  // Fetch from session

    db.query('INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)', 
    [userId, title, description, priority, due_date], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Task added successfully' });
    });
});

// Mark Task as Completed
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const userId = 1; // Fetch from session

    db.query('UPDATE tasks SET completed = TRUE WHERE id = ? AND user_id = ?', [taskId, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: 'Task marked as completed' });
    });
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const userId = 1; // Fetch from session

    db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: 'Task deleted successfully' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
