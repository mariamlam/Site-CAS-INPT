// routes/activities.js

const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateActivity = [
    body('title')      .trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
];

// GET /api/activities
router.get('/', (req, res) => {
    const db   = req.app.locals.db;
    const rows = db.all('SELECT * FROM activities ORDER BY created_at ASC');
    res.json({ success: true, data: rows });
});

// POST /api/activities
router.post('/', validateActivity, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { title, description, icon = 'bi-star-fill', color = 'text-warning' } = req.body;
    const db = req.app.locals.db;

    const result = db.run(
        'INSERT INTO activities (title, description, icon, color) VALUES (?, ?, ?, ?)',
        [title, description, icon, color]
    );

    const newActivity = db.get('SELECT * FROM activities WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, data: newActivity });
});

// DELETE /api/activities/:id
router.delete('/:id', (req, res) => {
    const db     = req.app.locals.db;
    const exists = db.get('SELECT id FROM activities WHERE id = ?', [req.params.id]);
    if (!exists) return res.status(404).json({ success: false, message: 'Activity not found' });

    db.run('DELETE FROM activities WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Activity deleted' });
});

// PATCH /api/activities/:id
router.patch('/:id', (req, res) => {
    const { title, description } = req.body;
    const db = req.app.locals.db;
    db.run(
        'UPDATE activities SET title = COALESCE(?, title), description = COALESCE(?, description) WHERE id = ?',
        [title || null, description || null, req.params.id]
    );
    const updated = db.get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated });
});

module.exports = router;