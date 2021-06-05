// Modules
const { Router, json } = require('express');
const jwt = require('jsonwebtoken');

// Our process
const pool = require('../database');
const Doctor = require('../models/doctor');
const { jsonToken } = require('../keys');

// Initializations
const router = Router();


router.post('/signup', async (req, res) => {
    const doctor = new Doctor(req.body);
    doctor.password = await doctor.encrypttPassword(doctor.password);
    //const result = await pool.query('INSERT INTO doctor SET ?', [doctor.getDoctor()]);

    const token = jwt.sign({ id: 1 /*result.insertId*/ }, jsonToken.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token });
});

router.get('/', async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }

    const decoded = jwt.verify(token, jsonToken.secret);
    console.log(decoded);
    const doc = await pool.query('SELECT * FROM doctor WHERE id = ?', [decoded.id]);

    if(!doc[0].id) {
        return res.status(404).send('No doc found');
    }

    res.json(doc[0]);
});

router.post('/signin', (req, res) => {
Ñ
});

module.exports = router;