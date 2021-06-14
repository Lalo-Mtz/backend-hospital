// Modules
const { Router } = require('express');

// Our process
const pool = require('../database');
const Patient = require('../models/patient');
const verifyToken = require('../controllers/varifyToken');

// Initializations
const router = Router();


router.get('/', verifyToken, async (req, res) => {
    const patients = await pool.query('SELECT * FROM patient');
    res.json(patients);
});

router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const patient = await pool.query('SELECT * FROM patient WHERE id = ?', [id]);
    if (patient[0]) {
        res.json(patient[0]);
    } else {
        res.status(404).json({ success: false, message: "Patient not found" });
    }
});

router.post('/add', verifyToken, async (req, res) => {
    const patient = new Patient(req.body);
    const exists = await pool.query("SELECT concat(name, ' ', surnames) AS fullname FROM patient WHERE concat(name, ' ', surnames) = ?", [patient.getFullname()]);
    if (exists[0]) {
        res.status(401).json({ success: false, message: "Patient already exist" });
    } else {
        const result = await pool.query('INSERT INTO patient SET ?', [patient.getPatient()]);
        if (result) {
            res.json({ success: true, id: result.insertId });
        } else {
            res.status(403).json({ success: false, message: "No save user" });
        }
    }
});

module.exports = router;