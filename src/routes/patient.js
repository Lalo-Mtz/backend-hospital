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

router.post('/', verifyToken, async (req, res) => {
    const patient = new Patient(req.body);
    const result = await pool.query('UPDATE patient SET ? WHERE id = ?', [patient.getPatientEdit(), patient.getId()]);
    if (!result.affectedRows) {
        return res.status(400).json({ success: false, message: 'Some error has ocurred' });
    }
    res.json({ success: true, message: 'Changes mede succesfuly' });
})

router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const patient = await pool.query(`SELECT id, name, surnames, date_format(birthdate, "%Y-%m-%d") as birthdate, phone, sex, 
                                      FORMAT(datediff('2021/06/20',birthdate)/365, 0) as age FROM patient WHERE id = ?`,
    [id]);
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

router.get('/doctor/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await pool.query(`SELECT patient.id, patient.name, patient.surnames FROM consultation INNER JOIN patient 
                                     ON patient.id = consultation.id_pat 
                                     WHERE consultation.id_doc = ? 
                                     GROUP BY id_pat;`,
        [id]);
    res.json({ success: true, patients: result });
});

router.get('/history/:id',verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await pool.query(`SELECT vitalsigns.*, consultation.reason, date_format(consultation.create_at, "%d-%m-%Y") as create_at
                                    FROM consultation INNER JOIN vitalsigns
                                    ON vitalsigns.id_con = consultation.id WHERE id_pat = ?`,
    [id]);
    if(result){
        return res.json({ success: true, history: result});
    }
    res.status(404).json({success: false, message: "Information doesn't exist"});
});

router.get('/prescription/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await pool.query(`SELECT id_con, id_doc, list, date_format(create_at, "%d-%m-%Y") as create_at 
                                     FROM prescription WHERE id_con = ?`, 
    [id]);
    const infoDoc = await pool.query(`SELECT username, type, email FROM doctor WHERE id = ?`, [result[0].id_doc]);
    if(result[0] && infoDoc[0]){
        return res.json({success: true, prescription: result[0], infoDoc: infoDoc[0]});
    }
    res.status(404).json({success: false, message: "Info not found"});
});

router.get('/results/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await pool.query(`SELECT * 
                                     FROM resultlab WHERE id_con = ?`, 
    [id]);
    if(result[0]){
        return res.json({success: true, prescription: result[0]});
    }
    res.status(404).json({success: false, message: "Info not found"});
});

module.exports = router;