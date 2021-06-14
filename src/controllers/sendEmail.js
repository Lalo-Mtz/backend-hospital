// Modules
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Our process
const { jsonToken } = require('../keys');

const sendEmail = async (id, email) => {
    const token = jwt.sign({ id, type: 'doctor' }, jsonToken.secretEmailAuth, {
        expiresIn: 60 * 60 * 24 * 3
    });

    contentHTLM = `
        <h1> Confirm your Email </h1>
        <ul>
            <li>Confirm: http://localhost:3000/authorization/${token}</li>
        </ul>
    `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.BUSINESS_EMAIL,
            pass: process.env.PWD_EMAIL
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    const info = await transporter.sendMail({
        from: "Star App <consultationstarapp@gmail.com>",
        to: `${email}`,
        subject: 'Authentication Email',
        html: contentHTLM
    });

    return info.messageId;
}

module.exports = sendEmail;