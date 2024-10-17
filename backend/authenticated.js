require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        jwt.verify(token, jwtSecret, (err, event_id) => {
            if (err) return res.sendStatus(403);
            req.id = event_id;
            next();
        });
    } catch (e) {
        res.status(401).send('Please authenticate');
    }
};

module.exports = authenticate;