// Modules
const jwt = require('jsonwebtoken');
const { jsonToken } = require('../keys');

const verifyToken = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            });
        }

        var decoded;

        switch (req.headers.typeuser.split(' ')[1]) {
            case 'doctor':
                decoded = jwt.verify(token, jsonToken.secret);
                if (!decoded.verify) {
                    return res.status(401).json({
                        auth: false,
                        message: 'Email not verified'
                    });
                }
            break;
            case 'nurse':
                decoded = jwt.verify(token, jsonToken.secretNurse);
            break;
            case 'staff':
                decoded = jwt.verify(token, jsonToken.secretStaff);
            break;
        }

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