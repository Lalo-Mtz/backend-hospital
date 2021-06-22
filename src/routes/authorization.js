// Modules
const { Router } = require('express');
const pool = require('../database');
const jwt = require('jsonwebtoken');

// Our process
const { jsonToken } = require('../keys');

// Initializations
const router = Router();

router.get('/:auth', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.auth, jsonToken.secretEmailAuth);
        const { id, type } = decoded;
        const result = await pool.query(`UPDATE ${type} SET verify = true WHERE id = ?`, [id]);

        if (result.affectedRows) {
            return res.redirect('/html/index.html')
            // return res.json({ success: true, message: 'Email verified' });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
});

module.exports = router;