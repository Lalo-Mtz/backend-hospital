// Modules
const { Router } = require('express');
const jwt = require('jsonwebtoken');

// Our procces
const pool = require('../database');
const { jsonToken } = require('../keys');
const Nurse = require('../models/nurse');
const Consultation = require('../models/consultation');
const verifyToken = require('../controllers/varifyToken');

// Initializations
const router = Router();


router.post('/signup', async (req, res) => {
    const nurse = new Nurse(req.body);
    nurse.password = await nurse.encrypttPassword(nurse.password);

    const valid = await pool.query('SELECT * FROM nurse WHERE username = ?', [nurse.getUsername()]);

    if (valid[0]) {
        return res.status(401).json({ auth: false, message: 'The email is register' });
    }

    const result = await pool.query('INSERT INTO nurse SET ?', [nurse.getNurse()]);

    const token = jwt.sign({ id: result.insertId }, jsonToken.secretNurse, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM nurse WHERE username = ?', [username]);

    if (!result[0]) {
        return res.status(404).json({auth: false, message: "The nurse doesn't exists"});
    }

    const nurse = new Nurse(result[0]);

    const validPassword = await nurse.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json({ auth: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: nurse.getId() }, jsonToken.secretNurse, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token, username: nurse.getUsername() });
});


// Intormation of Nurse
router.get('/', verifyToken, async (req, res) => {
    const nurse = await pool.query('SELECT id, username FROM nurse WHERE id = ?', [req.userId]);
    if (!nurse[0].id) {
        return res.status(404).send('No nurse found');
    }
    res.json(nurse[0]);
});

// New consultation
router.post('/newconsultation', verifyToken, async (req, res) => {
    const con = new Consultation(req.body, req.userId);
    if (await con.patientExist()) {
        const result = await pool.query('INSERT INTO consultation SET ?', [con.getConsultation()]);
        return res.json({ success: true, id_con: result.insertId });
    } else {
        return res.status(404).json({ success: false, message: "Patient not found" });
    }
});

// Add vitalsigns
router.post('/addvitalsigns/:id_con', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id_con FROM vitalsigns WHERE id_con = ?', [req.params.id_con]);
        if (!result[0]) {
            const { weight, size, temperatura, blood_pre, hearbeat } = req.body;
            const vitalsigns = { id_con: req.params.id_con, weight, size, temperatura, blood_pre, hearbeat }
            const result = await pool.query('INSERT INTO vitalsigns SET ?', [vitalsigns]);
            if (result.affectedRows) {
                return res.json({ success: true, id_con: req.params.id_con });
            } else {
                return res.status(401).json({ success: false, message: "An error has occurred" });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: 'Information already exist'
            });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: "An error has occurred" });
    }
});

module.exports = router;