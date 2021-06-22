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
        const inline = { id_doc: result.insertId, state: false };
        const r = await pool.query('INSERT INTO inline SET ?', [inline]);
        if (r.affectedRows) {
            return res.json({ auth: true, token, message: 'Doctor saved successfully' });
        } else {
            return res.status(401).json({ auth: false, message: 'Has occurred some error' });
        }
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
    const r = await pool.query('UPDATE inline SET state = true WHERE id_doc = ?', [doctor.getId()]);
    if (r.affectedRows) {
        return res.json({ auth: true, token, username: doctor.getUsername(), verify: doctor.getVerify() });
    } else {
        return res.status(401).json({ auth: false, message: "Has ocurred some error" });
    }
});

router.get('/offline', verifyToken, async (req, res) => {
    const r = await pool.query('UPDATE inline SET state = false WHERE id_doc = ?', [req.userId]);
    if (r.affectedRows) {
        return res.json({ success: true, message: 'Offline successfully' });
    } else {
        return res.status(401).json({ succes: false, message: "Has ocurred some error" });
    }
});

router.get('/inline', verifyToken, async (req, res) => {
    const r = await pool.query('UPDATE inline SET state = true WHERE id_doc = ?', [req.userId]);
    if (r.affectedRows) {
        return res.json({ success: true, message: 'Inline successfully' });
    } else {
        return res.status(401).json({ succes: false, message: "Has ocurred some error" });
    }
});

router.get('/', verifyToken, async (req, res) => {
    const doc = await pool.query(`SELECT id, username, email, type, country, college, phone, verify
                                  FROM doctor WHERE id = ?`,
        [req.userId]);
    if (!doc[0].id) {
        return res.status(404).send('No doc found');
    }
    res.json(doc[0]);
});

router.post('/', verifyToken, async (req, res) => {
    const doctor = new Doctor(req.body);
    const result = await pool.query('UPDATE doctor SET ? WHERE id = ?', [doctor.getDoctorSecurity(), doctor.getId()]);
    if (!result.affectedRows) {
        return res.status(400).json({ success: false, message: 'Some error has ocurred' });
    }
    res.json({ success: true, message: 'Changes mede succesfuly' });
})

router.get('/dashboard', verifyToken, async (req, res) => {
    const n_patients = await pool.query('SELECT * FROM consultation WHERE id_doc = ? GROUP BY (id_pat);', [req.userId]);
    const historial = await pool.query(`SELECT consultation.id, date_format(consultation.create_at, "%d-%m-%Y") as create_at,  patient.name, patient.surnames, consultation.reason, consultation.urgency FROM consultation INNER JOIN patient 
                                        ON patient.id = consultation.id_pat 
                                        WHERE consultation.id_doc = ? 
                                        ORDER BY create_at DESC;`,
        [req.userId]);
    const n_week = await pool.query(`SELECT count(id) AS n_week FROM consultation
                                    WHERE id_doc = ? AND weekofyear(create_at) = weekofyear(?);`,
        [req.userId, new Date()]);
    res.json({
        success: true,
        num_p: n_patients.length,
        num_c: historial.length,
        num_w: n_week[0].n_week,
        patients: historial,
    });
});

router.get('/patient/:id_con', verifyToken, async (req, res) => {

    const pat = await pool.query(`SELECT patient.name, patient.surnames, consultation.reason 
                                  FROM consultation INNER JOIN patient ON consultation.id_pat = patient.id
                                  WHERE consultation.id = ?`,
        [req.params.id_con]);

    if (!pat[0].name) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, patient: pat[0]});
});

router.get('/estadisticos', verifyToken, async (req, res) => {
    const r1 = await pool.query(`select count(id) as cuantity, sex from patient group by sex order by sex`);
    const r2 = await pool.query(`select count(id) as cuantity, reason from consultation group by reason order by cuantity desc;`);
    const r3 = await pool.query(`SELECT patient.id, FORMAT(datediff('2021/06/20',birthdate)/365, 0) as age, consultation.*, count(patient.id) as num FROM patient inner join consultation on 
                                 patient.id = consultation.id_pat group by age order by num desc;`);
    const r4 = await pool.query(`select count(id) as cuantity, urgency from consultation group by urgency;`);

    var h = Number.parseInt(r1[0].cuantity);
    var m = Number.parseInt(r1[1].cuantity);
    var t = h + m;
    h = ((h*100)/t).toFixed(2);
    m = ((m*100)/t).toFixed(2);
    mas = r2[0].reason;
    edad = r3[0].age;
    var me = Number.parseInt(r4[0].cuantity);
    var ba = Number.parseInt(r4[1].cuantity);
    var al = Number.parseInt(r4[2].cuantity);
    var to = me + ba + al;
    me = ((me*100)/to).toFixed(2);
    ba = ((ba*100)/to).toFixed(2);
    al = ((al*100)/to).toFixed(2);
    
    res.json({success: true, esta: {h, m, mas, edad, me, ba, al}});
});

module.exports = router;