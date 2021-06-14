// Modules
const { Router } = require('express');
const pool = require('../database');

// Our process
const Medicine = require('../models/medicine');

// Initializaions
const router = Router();

router.post('/new', (req, res) => {
    // const result = pool.query('INSERT INTO prescription SET ?', [req.body]);
    // if(result.insertId){

    // }
    // var list=[];
    // const medicines = req.body.list.split(',');
    // medicines.forEach(m => {
    //     const nds = m.split('*');
    //     list.push(new Medicine(nds[0], nds[1], nds[2]));
    // });
    // console.log(list);
    res.json({new: 'press'});
});


module.exports = router;