// Modules
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
        return res.status(404).json({ auth: false, message: "The nurse doesn't exists" });
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
            const { weight, size, temperatura, blood_pre, hearbeat } = req.body.vitalsings;
            const { color, aspecto, sedimento, gravedad, ph, electrolitos, leucocitos, bacterias, celulas } = req.body.resultlab;
            const vitalsigns = { id_con: req.params.id_con, weight, size, temperatura, blood_pre, hearbeat }
            const resultlab = { id_con: req.params.id_con, color, aspecto, sedimento, gravedad, ph, electrolitos, leucocitos, bacterias, celulas };
            const result = await pool.query('INSERT INTO vitalsigns SET ?', [vitalsigns]);
            const result2 = await pool.query('INSERT INTO resultlab SET ?', [resultlab]);
            console.log(result, result2)
            if (result.affectedRows && result2.affectedRows) {
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

router.get('/joindoctor/:id_con', verifyToken, async (req, res) => {
    const id_con = req.params.id_con;
    const result = await pool.query('SELECT * FROM inline WHERE state = 1');
    if (result.length != 0) {
        const r = await pool.query('UPDATE consultation SET id_doc = ? WHERE id = ?', [result[0].id_doc, id_con]);
        if (r.affectedRows == 1) {
            return res.json({ success: true, id_doc: result[0].id_doc, url: uuidv4() });
        } else {
            return res.status(404).json({ success: false, message: "Has occurred some error" });
        }

    } else {
        return res.status(404).json({ success: false, message: "Evrey doctors are busy" });
    }
})

router.get('/verifyDoctors', verifyToken, async (req, res) => {
    const result = await pool.query('SELECT * FROM inline WHERE state = 1');
    if (result.length != 0) {
        return res.json({ success: true, message: "Some doctor are available" });
    } else {
        return res.json({ success: false, message: "Evrey doctors are busy" });
    }
})

module.exports = router;