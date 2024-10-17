require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require("../pool");
const jwtSecret = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const resp = await pool.query("SELECT username FROM users WHERE username=$1", [username]);
        if (resp.rows.length > 0) return res.status(400).send('Username already exists');

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
            [username, password_hash]
        );

        const user_id = newUser.rows[0].id;
        const token = jwt.sign({ user_id }, jwtSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id }, jwtSecret);
        const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);

        await pool.query('INSERT INTO refresh_token (token, user_id, expires) VALUES ($1, $2, $3)', [refreshToken, user_id, expires]);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.send({ token });
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;
