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
        const resp = await pool.query("SELECT username, password_hash, id FROM users WHERE username=$1 ", [username])

        const user = resp.rows?.[0];

        if (!user) return res.status(400).send('Invalid username or password');

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).send('Invalid username or password');

        const token = jwt.sign({ user_id: user?.id }, jwtSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id: user?.id }, jwtSecret);
        const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);

        await pool.query('INSERT INTO refresh_token (token, user_id, expires) VALUES ($1, $2, $3)', [refreshToken, user?.id, expires]);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.send({ token });
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }

})

module.exports = router;