const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;


    try {
        const hash = await bcrypt.hash(password, 10);


        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hash]
        );


        const token = jwt.sign(
            { userId: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );


        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;


    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );


    if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }


    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);


    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }


    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );


    res.json({ token });
};


exports.me = async (req, res) => {
    const userId = req.userId;


    const [rows] = await pool.query(
        'SELECT id, name, email, phone, avatar_url, created_at FROM users WHERE id = ?',
        [userId]
    );


    res.json(rows[0]);
};