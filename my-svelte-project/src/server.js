// 以下ルールで全てのカラムを変更(テーブル名はapp3でエンドポイント名は変更不要)
// app3_title => image_name (validationルールは1文字以上100文字以下、空白は不可)
// app3_text => base64Image (base64で1kb以上で128kb以下)


const db_for_app3 = new sqlite('app3.db');

const initializeDatabase_app3 = () => {
    db_for_app3.exec('DROP TABLE IF EXISTS app3');
    db_for_app3.exec(`
        CREATE TABLE app3 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT NOT NULL CHECK(length(uid) = 64), -- SHA-256 produces a 64-character hex string
            image_name TEXT NOT NULL CHECK(length(image_name) >= 1 AND length(image_name) <= 100 AND image_name NOT LIKE '% %'), -- No spaces allowed
            base64Image TEXT NOT NULL CHECK(length(base64Image) >= 1024 AND length(base64Image) <= 131072), -- 1KB to 128KB
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};
// initializeDatabase_app3();

app.post('/app3/init-database', (req, res) => {
    const { password } = req.body;

    if (password === 'init') {
        try {
            initializeDatabase_app3();
            res.status(200).json({ message: 'Database initialized successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize database.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});

app.post('/app3/create', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { uid, image_name, base64Image } = req.body;

    // Validation for uid
    if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
        return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    }

    // Validation for image_name
    if (typeof image_name !== 'string' || image_name.length < 1 || image_name.length > 100 || /\s/.test(image_name)) {
        return res.status(400).json({ error: 'Invalid image_name. It must be a string between 1 and 100 characters without spaces.' });
    }

    // Validation for base64Image
    if (typeof base64Image !== 'string' || base64Image.length < 1024 || base64Image.length > 131072) {
        return res.status(400).json({ error: 'Invalid base64Image. It must be a base64 string between 1KB and 128KB.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app3.prepare('INSERT INTO app3 (uid, image_name, base64Image) VALUES (?, ?, ?)');
    const result = stmt.run(hashedUid, image_name, base64Image);

    return res.status(201).json({
        id: result.lastInsertRowid,
        uid: hashedUid,
        image_name,
        base64Image,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    });
});

app.post('/app3/read', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { uid } = req.body;

    try {
        const stmt_all = db_for_app3.prepare('SELECT * FROM app3');
        const all_json = stmt_all.all();

        if (uid) {
            const hashedUid = hashUid(uid);
            const stmt_uid = db_for_app3.prepare('SELECT * FROM app3 WHERE uid = ?');
            const uid_json = stmt_uid.all(hashedUid);
            res.status(200).json({ uid_json, all_json });
        } else {
            res.status(200).json({ all_json });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve records.' });
    }
});

app.post('/app3/update', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { id, uid, image_name, base64Image } = req.body;

    // Validation
    if (typeof id !== 'number' || typeof uid !== 'string' || uid.length < 1 || uid.length > 50 ||
        typeof image_name !== 'string' || image_name.length < 1 || image_name.length > 100 || /\s/.test(image_name) ||
        (typeof base64Image !== 'string' || base64Image.length < 1024 || base64Image.length > 131072)) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app3.prepare('UPDATE app3 SET image_name = ?, base64Image = ?, updated = CURRENT_TIMESTAMP WHERE id = ? AND uid = ?');
    const result = stmt.run(image_name, base64Image, id, hashedUid);

    if (result.changes > 0) {
        res.status(200).json({ message: 'Record updated successfully.' });
    } else {
        res.status(404).json({ error: 'Record not found or UID mismatch.' });
    }
});

app.post('/app3/delete', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { id, uid } = req.body;

    if (typeof id !== 'number' || typeof uid !== 'string') {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app3.prepare('DELETE FROM app3 WHERE id = ? AND uid = ?');
    const result = stmt.run(id, hashedUid);

    if (result.changes > 0) {
        res.status(200).json({ message: 'Record deleted successfully.' });
    } else {
        res.status(404).json({ error: 'Record not found or UID mismatch.' });
    }
});
