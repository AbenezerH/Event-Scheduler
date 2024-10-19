require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require("../pool");

const jwtSecret = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const token = req.cookies.refreshToken;
    console.log('Received token:', token);
    if (!token) return res.sendStatus(401);
    try {
        const result = await pool.query('SELECT * FROM refresh_token WHERE token = $1', [token]);
        const refreshTokenDoc = result.rows[0];
        if (!refreshTokenDoc) return res.sendStatus(403);
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) return res.sendStatus(403);
            const newToken = jwt.sign({ user_id: user?.user_id }, jwtSecret, { expiresIn: '1h' });
            console.log('New Token Generated:', newToken);
            res.json({ token: newToken });
        });
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});


module.exports = router;