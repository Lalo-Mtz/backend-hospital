// Modules
const { Router, json } = require('express');
const jwt = require('jsonwebtoken');

// Our process
const pool = require('../database');
const Doctor = require('../models/doctor');
const { jsonToken } = require('../keys');
const verifyToken = require('../controllers/varifyToken');
const sendEmail = require('../controllers/sendEmail');

// Initializations
const router = Router();

router.post('/signup', async (req, res) => {
    const doctor = new Doctor(req.body);

    doctor.password = await doctor.encrypttPassword(doctor.password);

    const valid = await pool.query('SELECT * FROM doctor WHERE email = ?', [doctor.getEmail()]);

    if (valid[0]) {
        return res.status(401).json({ auth: false, message: 'The email is register' });
    }

    const result = await pool.query('INSERT INTO doctor SET ?', [doctor.getDoctor()]);

    const token = jwt.sign({ id: result.insertId, verify: doctor.getVerify() }, jsonToken.secret, {
        expiresIn: 60 * 60 * 24
    });

    const send = sendEmail(result.insertId, doctor.getEmail());

    if (send) {
        return res.json({ auth: true, token, message: 'Doctor successfully saved' });
    } else {
        return res.json({ auth: true, token, message: 'Error with email' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM doctor WHERE email = ?', [email]);

    if (!result[0]) {
        return res.status(404).json({ auth: false, message: "The email doesn't exists" });
    }

    const doctor = new Doctor(result[0]);

    const validPassword = await doctor.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json({ auth: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: doctor.getId(), verify: doctor.getVerify() }, jsonToken.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token, username: doctor.getUsername(), verify: doctor.getVerify() });
});

router.get('/', verifyToken, async (req, res) => {
    const doc = await pool.query('SELECT * FROM doctor WHERE id = ?', [req.userId]);
    if (!doc[0].id) {
        return res.status(404).send('No doc found');
    }
    doc[0].password = '';
    res.json(doc[0]);
});


router.get('/dashboard', verifyToken, async (req, res) => {
    const n_patients = await pool.query('SELECT * FROM consultation WHERE id_doc = ? GROUP BY (id_pat);', [req.userId]);
    const historial = await pool.query(`SELECT consultation.id, consultation.create_at,  patient.name, patient.surnames, consultation.reason FROM consultation INNER JOIN patient 
                                        ON patient.id = consultation.id_pat 
                                        WHERE consultation.id_doc = ? 
                                        ORDER BY create_at DESC;`,
    [req.userId]);
    const n_week = await pool.query(`SELECT count(id) AS n_week FROM consultation
                                    WHERE id_doc = 1 AND weekofyear(create_at) = weekofyear('2021-06-17');`,
    [new Date()]);
    res.json({
        success: true,
        num_p: n_patients.length,
        num_c: historial.length,
        num_w: n_week[0].n_week,
        patients: historial,
    });
});

module.exports = router;