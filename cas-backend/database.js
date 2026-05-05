// database.js — Uses sql.js (pure JS, no compilation needed)

const initSqlJs = require('sql.js');
const fs        = require('fs');
const path      = require('path');

const DB_PATH = path.join(__dirname, 'cas_inpt.db');

let db;

function saveDb() {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function run(sql, params = []) {
    db.run(sql, params);
    saveDb();
    const row = db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: row[0]?.values[0][0] ?? null };
}

function get(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
    }
    stmt.free();
    return null;
}

function all(sql, params = []) {
    const results = db.exec(sql, params);
    if (!results.length) return [];
    const { columns, values } = results[0];
    return values.map(row =>
        Object.fromEntries(columns.map((col, i) => [col, row[i]]))
    );
}

async function initDb() {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            subject    TEXT NOT NULL,
            message    TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS members (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            email      TEXT NOT NULL UNIQUE,
            department TEXT NOT NULL,
            motivation TEXT,
            status     TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS activities (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            description TEXT NOT NULL,
            icon        TEXT DEFAULT 'bi-star-fill',
            color       TEXT DEFAULT 'text-warning',
            created_at  TEXT DEFAULT (datetime('now'))
        );
    `);

    const count = get('SELECT COUNT(*) as n FROM activities').n;
    if (count === 0) {
        const defaults = [
            ['Blood Drive',        'Organizing donation days at INPT to save lives.',               'bi-droplet-fill',    'text-danger'],
            ['Neqraw Jmi3',        'Providing school supplies to underprivileged children.',         'bi-pencil-square',   'text-primary'],
            ['Al Ihssan Caravan',  'Improving access to clean water in remote rural areas.',         'bi-truck',           'text-success'],
            ['Academic Support',   'Tutoring sessions to empower learners.',                         'bi-book-half',       'text-info'],
            ['Little Engineer',    'Introducing children to engineering through activities.',         'bi-cpu',             'text-warning'],
            ['Action Ramadan',     'Providing Ftour meals to those in need.',                        'bi-moon-stars-fill', 'text-dark'],
            ['Aid Sghir',          'Offering new clothes to orphans for Aid Al-Fitr.',               'bi-gift',            'text-danger'],
            ['Madkhoul',           'Financing income-generating projects for families.',             'bi-cash-stack',      'text-success'],
            ['Farhat Al Aid',      'Donating sheep to families in need for Aid Al-Adha.',            'bi-heart-fill',      'text-primary'],
            ['Nursing Home Visit', 'Visiting senior citizens and bringing companionship.',           'bi-people-fill',     'text-primary'],
        ];
        defaults.forEach(([title, description, icon, color]) =>
            db.run('INSERT INTO activities (title, description, icon, color) VALUES (?, ?, ?, ?)',
                [title, description, icon, color])
        );
        saveDb();
        console.log('✅ Seeded default activities');
    }

    console.log('✅ Database ready');
    return { run, get, all };
}

module.exports = { initDb };