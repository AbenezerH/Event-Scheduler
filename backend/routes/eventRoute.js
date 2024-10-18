const express = require("express");
const router = express.Router();
const authenticate = require("../authenticated");

const pool = require("../pool");

router.get("/", authenticate, async (req, res) => {
    try {
        const query = `
            SELECT
                e.*,
                r.recurrence_type,
                r.time_unit,
                r.recurrence_amount,
                r.relative_recurrence_by,
                r.selected_days,
                r.recurrence_description
            FROM events e
            LEFT JOIN recurrence r ON e.recurrence_id = r.id
        `;
        const resp = await pool.query(query);
        res.json(resp.rows.map(row => ({ ...row, selected_days: row?.selected_days?.days })));
    } catch (error) {
        console.error('Error during fetching data:\n', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/", authenticate, async (req, res) => {
    try {
        const {
            user_id,
            event_title,
            event_description,
            event_date,
            event_location,
            event_organizer,
            recurrence // This includes all recurrence fields if provided
        } = req.body;


        let formattedDate = event_date && new Date(event_date)?.toISOString();

        if (recurrence) {
            console.log(recurrence.selected_days);
            // Insert recurrence data and get the recurrence_id
            const recurrenceResp = await pool.query(
                "INSERT INTO recurrence (recurrence_type, time_unit, recurrence_amount, relative_recurrence_by, selected_days, recurrence_description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
                [recurrence.recurrence_type, recurrence.time_unit, recurrence.recurrence_amount, recurrence.relative_recurrence_by, { days: recurrence.selected_days }, recurrence.recurrence_description]
            );
            const recurrence_id = recurrenceResp.rows[0].id;

            // Insert event with the recurrence_id
            const resp = await pool.query(
                "INSERT INTO events (user_id, event_title, event_description, event_date, event_location, event_organizer, recurrence_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [user_id, event_title, event_description, formattedDate, event_location, event_organizer, recurrence_id]
            );
            res.json(resp.rows.map(row => ({ ...row, selected_days: row?.selected_days?.days })));
        } else {
            // Insert event without recurrence_id
            const resp = await pool.query(
                "INSERT INTO events (user_id, event_title, event_description, event_date, event_location, event_organizer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [user_id, event_title, event_description, formattedDate, event_location, event_organizer]
            );
            res.json(resp.rows.map(row => ({ ...row, selected_days: row?.selected_days?.days })));

        }
    } catch (error) {
        console.error("Error during inserting data:\n", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, event_title, event_description, event_date, event_location, event_organizer, recurrence } = req.body;

        let formattedDate = event_date && new Date(event_date)?.toISOString();

        if (recurrence) {
            console.log(recurrence)
            // Update recurrence data
            const resp1 = await pool.query(
                "UPDATE recurrence SET recurrence_type = $1, time_unit = $2, recurrence_amount = $3, relative_recurrence_by = $4, selected_days = $5, recurrence_description = $6 WHERE id = $7 RETURNING *",
                [recurrence.recurrence_type, recurrence.time_unit, recurrence.recurrence_amount, recurrence.relative_recurrence_by, { days: recurrence.selected_days }, recurrence.recurrence_description, recurrence.recurrence_id]
            );

            // Update event with the recurrence_id
            const resp = await pool.query(
                "UPDATE events SET user_id = $1, event_title = $2, event_description = $3, event_date = $4, event_location = $5, event_organizer = $6 WHERE id = $7 RETURNING *",
                [user_id, event_title, event_description, formattedDate, event_location, event_organizer, id]
            );
            res.json([{ ...resp1.rows[0], selected_days: resp1.rows[0]?.selected_days?.days, ...resp.rows[0] }]);
        } else {
            // Update event without recurrence_id
            const resp = await pool.query(
                "UPDATE events SET user_id = $1, event_title = $2, event_description = $3, event_date = $4, event_location = $5, event_organizer = $6, recurrence_id = NULL WHERE id = $7 RETURNING *",
                [user_id, event_title, event_description, formattedDate, event_location, event_organizer, id]
            );
            res.json(resp.rows);
        }
    } catch (error) {
        console.error("Error during updating data:\n", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const resp = await pool.query("DELETE FROM events WHERE id = $1", [Number(id)]);
        console.log(resp.rowCount, id);
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