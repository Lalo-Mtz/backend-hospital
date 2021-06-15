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

    const token = jwt.sign({ id: result.insertId, verify: doctor.getVerify()}, jsonToken.secret, {
        expiresIn: 60 * 60 * 24
    });

    const send = sendEmail(result.insertId, doctor.getEmail());

    if(send){
        return res.json({ auth: true, token, message: 'Doctor successfully saved' });
    }else{
        return res.json({ auth: true, token, message: 'Error with email' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM doctor WHERE email = ?', [email]);

    if (!result[0]) {
        return res.status(404).json({ auth: false, message: "The email doesn't exists"});
    }

    const doctor = new Doctor(result[0]);

    const validPassword = await doctor.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json({ auth: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: doctor.getId(), verify: doctor.getVerify() }, jsonToken.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token, username: doctor.getUsername() });
});

router.get('/', verifyToken, async (req, res) => {
    const doc = await pool.query('SELECT id, username, email FROM doctor WHERE id = ?', [req.userId]);
     if (!doc[0].id) {
         return res.status(404).send('No doc found');
     }
    res.json(doc[0]);
});

module.exports = router;