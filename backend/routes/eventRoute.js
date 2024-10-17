const express = require("express");
const router = express.Router();
const authenticate = require("../authenticated");

const pool = require("../pool");

router.get("/", authenticate, async (req, res) => {
    try {
        const resp = await pool.query("SELECT * FROM events");
        res.json(resp.rows);
    } catch (error) {
        console.error('Error during fetching data:\n', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/", authenticate, async (req, res) => {
    try {
        const { user_id, event_title, event_description, event_date, event_location, event_organizer } = req.body;
        let formattedDate = event_date && new Date(event_date)?.toLocaleString()

        const resp = await pool.query("INSERT INTO events (user_id, event_title, event_description, event_date, event_location, event_organizer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [user_id, event_title, event_description, formattedDate, event_location, event_organizer])
        res.status(200).send(resp.rows);
    } catch (error) {
        console.error("Error during inserting data:\n", error);
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.put("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { event_title, event_description, event_date, event_location, event_organizer } = req.body;

    let formattedDate = event_date && new Date(event_date)?.toLocaleString()
    console.log(formattedDate, typeof formattedDate);

    try {
        const resp = await pool.query(
            "UPDATE events SET event_title = $1, event_description = $2, event_date = $3, event_location = $4, event_organizer = $5 WHERE id = $6 RETURNING *",
            [event_title, event_description, formattedDate, event_location, event_organizer, id]
        );

        if (resp.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(resp.rows);
    } catch (error) {
        console.error("Error during updating data:\n", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const resp = await pool.query("DELETE FROM events WHERE id = $1", [id]);
        if (resp.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:\n', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;