// Modules
const { Router } = require('express');
const jwt = require('jsonwebtoken');

// Our process
const pool = require('../database');
const { jsonToken } = require('../keys');
const Staff = require('../models/staff');
const verifyToken = require('../controllers/varifyToken');

// Initializations
const router = Router();


router.post('/signup', async (req, res) => {
    const staff = new Staff(req.body);
    staff.password = await staff.encrypttPassword(staff.password);

    const valid = await pool.query('SELECT * FROM staff WHERE username = ?', [staff.getUsername()]);

    if (valid[0]) {
        return res.status(401).json({ auth: false, message: 'The email is register' });
    }

    const result = await pool.query('INSERT INTO staff SET ?', [staff.getStaff()]);

    const token = jwt.sign({ id: result.insertId }, jsonToken.secretStaff, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    
    const result = await pool.query('SELECT * FROM staff WHERE username = ?', [username]);

    if (!result[0]) {
        return res.status(404).send("The staff doesn't exists");
    }

    const staff = new Staff(result[0]);

    const validPassword = await staff.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json({ auth: false, token: null });
    }

    const token = jwt.sign({ id: staff.getId() }, jsonToken.secretStaff, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token });
});

router.get('/', verifyToken, async (req, res) => {
    const staff = await pool.query('SELECT id, username FROM staff WHERE id = ?', [req.userId]);
     if (!staff[0].id) {
         return res.status(404).send('No staff found');
     }
    res.json(staff[0]);
});

module.exports = router;