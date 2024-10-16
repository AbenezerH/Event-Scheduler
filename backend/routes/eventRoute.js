const express = require("express");
const router = express.Router();

const pool = require("../pool");

router.get("/", async (req, res) => {
    try {
        res.json("hello");
    } catch (error) {
        console.error('Error during fetching data:\n', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;