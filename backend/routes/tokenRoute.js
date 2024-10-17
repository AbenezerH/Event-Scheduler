const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require("../pool");

router.post('/', async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        const result = await pool.query('SELECT * FROM refresh_token WHERE token = $1', [token]);
        const refreshTokenDoc = result.rows[0];
        if (!refreshTokenDoc) return res.sendStatus(403);

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            const newToken = jwt.sign({ user_id: user?.user_id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token: newToken });
        });
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;