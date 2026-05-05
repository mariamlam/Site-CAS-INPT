// server.js

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { initDb } = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Boot: init DB first, then mount routes, then listen ───────────────────
initDb().then((dbHelpers) => {

    app.locals.db = dbHelpers;

    const contactRoutes    = require('./routes/contact');
    const joinRoutes       = require('./routes/join');
    const activitiesRoutes = require('./routes/activities');

    // ── Routes ────────────────────────────────────────────────────────────
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', time: new Date().toISOString() });
    });

    app.use('/api/contact',    contactRoutes);
    app.use('/api/join',       joinRoutes);
    app.use('/api/activities', activitiesRoutes);

    // ── 404 — must be AFTER all routes ────────────────────────────────────
    app.use((req, res) => {
        res.status(404).json({ success: false, message: `Route ${req.path} not found` });
    });

    // ── Global error handler ──────────────────────────────────────────────
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });

    app.listen(PORT, () => {
        console.log(`
  ╔══════════════════════════════════════╗
  ║  CAS-INPT Backend running            ║
  ║  http://localhost:${PORT}               ║
  ║                                      ║
  ║  GET  /api/health                    ║
  ║  POST /api/contact                   ║
  ║  POST /api/join                      ║
  ║  GET  /api/activities                ║
  ╚══════════════════════════════════════╝
        `);
    });

}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});