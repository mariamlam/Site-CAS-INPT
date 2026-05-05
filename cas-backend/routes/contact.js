

const express    = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const validateContact = [
    body('name')   .trim().notEmpty().withMessage('Name is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// POST /api/contact
router.post('/', validateContact, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { name, subject, message } = req.body;
    const db = req.app.locals.db;

    const result = db.run(
        'INSERT INTO contacts (name, subject, message) VALUES (?, ?, ?)',
        [name, subject, message]
    );

    // Email notification (fire and forget)
    transporter.sendMail({
        from: `"CAS-INPT Website" <${process.env.EMAIL_USER}>`,
        to:   process.env.NOTIFY_EMAIL,
        subject: `[CAS-INPT Contact] ${subject}`,
        html: `<h2>New contact message</h2>
               <p><b>From:</b> ${name}</p>
               <p><b>Subject:</b> ${subject}</p>
               <p><b>Message:</b> ${message}</p>`,
    }).catch(err => console.error('Email error:', err.message));

    res.json({ success: true, id: result.lastInsertRowid, message: 'Message received!' });
});

// GET /api/contact — list all messages
router.get('/', (req, res) => {
    const db   = req.app.locals.db;
    const rows = db.all('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
});

module.exports = router;