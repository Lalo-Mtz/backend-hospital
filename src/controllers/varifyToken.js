const jwt = require('jsonwebtoken');
const { jsonToken } = require('../keys');

function verifyToken(req, res, next) {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, jsonToken.secret);

        req.userId = decoded.id;

        next();
    } catch (err) {
        return res.status(401).json({
            auth: false,
            message: 'Token expired'
        });
    }
}

module.exports = verifyToken;