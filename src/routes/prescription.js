// Modules
const { Router } = require('express');
const pool = require('../database');

// Our process
const Medicine = require('../models/medicine');

// Initializaions
const router = Router();

router.post('/new', async (req, res) => {
    const result = await pool.query('INSERT INTO prescription SET ?', [req.body]);
    if (result.affectedRows) {
        var list = [];
        const medicines = req.body.list.split(',');
        medicines.forEach(m => {
            const nds = m.split('*');
            list.push(new Medicine(nds[0], nds[1], nds[2]));
        });
        return res.json({success: true, id_con: req.body.id_con});
    }else{
        return res.status(401).json({success: false, message: 'An error has ocurred'});
    }
});


module.exports = router;