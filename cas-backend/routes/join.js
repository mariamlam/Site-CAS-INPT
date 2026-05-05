// routes/join.js

const express    = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const validateJoin = [
    body('name')      .trim().notEmpty().withMessage('Name is required'),
    body('email')     .trim().isEmail().withMessage('Valid email is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
];

// POST /api/join
router.post('/', validateJoin, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { name, email, department, motivation } = req.body;
    const db = req.app.locals.db;

    const existing = db.get('SELECT id FROM members WHERE email = ?', [email]);
    if (existing) {
        return res.status(409).json({ success: false, message: 'This email is already registered.' });
    }

    const result = db.run(
        'INSERT INTO members (name, email, department, motivation) VALUES (?, ?, ?, ?)',
        [name, email, department, motivation || '']
    );

    // Confirmation email to applicant
    transporter.sendMail({
        from: `"Club Affaires Sociales INPT" <${process.env.EMAIL_USER}>`,
        to:   email,
        subject: 'Application received — CAS-INPT',
        html: `<h2>Welcome, ${name.split(' ')[0]}! 🎉</h2>
               <p>We've received your application and will be in touch soon.</p>`,
    }).catch(err => console.error('Email error:', err.message));

    // Notify admin
    transporter.sendMail({
        from: `"CAS-INPT Website" <${process.env.EMAIL_USER}>`,
        to:   process.env.NOTIFY_EMAIL,
        subject: `[CAS-INPT] New application from ${name}`,
        html: `<h2>New membership application</h2>
               <p><b>Name:</b> ${name}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Department:</b> ${department}</p>
               <p><b>Motivation:</b> ${motivation || '—'}</p>`,
    }).catch(err => console.error('Email error:', err.message));

    res.json({ success: true, id: result.lastInsertRowid, message: 'Application submitted!' });
});

// GET /api/join — list all applicants
router.get('/', (req, res) => {
    const db   = req.app.locals.db;
    const rows = db.all('SELECT * FROM members ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
});

// PATCH /api/join/:id/status
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const db = req.app.locals.db;
    db.run('UPDATE members SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: `Status updated to ${status}` });
});

module.exports = router;