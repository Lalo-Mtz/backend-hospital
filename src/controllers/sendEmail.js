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
        <body style="justify-content: center;text-align: center;align-items: center; padding: 0;margin: 0;">
            <div style="padding: 20px;width: 70%;height: 80%;margin: 10% 15%;">
                <div style="background: linear-gradient(to left, rgb(119, 0, 255),rgb(0, 174, 255));width: 100%;height: 50px;margin-bottom: 100px;"></div>
                <img style="width: 100px;height: 100px;background: chartreuse;border-radius: 50%;margin-top: -70px;" src="">
                <div>
                    <h2 style="font-size: 2.5rem;padding-bottom: 50px;">Clinica Star</h2>
                    <h2 style="font-size: 2.5rem;padding-bottom: 50px;">Confirma Tu Correo electronico</h2>
                </div>
                <div class="infor">
                    <p style="font-size: 1.2rem;text-align: justify;padding-bottom: 50px;">Gracias por elegir a nuestra Clinica Star, comprometidos con tu salud.Star te ofrece una plataforma para que
                        atiendas de una manera facil y organizada a tus pacientes </p>
                    <p style="font-size: 1.2rem;text-align: justify;padding-bottom: 50px;">Para acceder a tu cuenta, y ver todo lo relacionado con nuestra clinica, haz clic en el boton morado grande (Confirmar) para confirmar tu correo electronico</p>
                </div>
                <div style="margin-bottom: 50px;">
                    <a tanget="_blank" style="background: linear-gradient(to left, rgb(119, 0, 255),rgb(0, 255, 115));padding: 20px 80px;text-decoration: none;color: white;" href="http://localhost:3000/authorization/${token}">CONFIRMAR</a>
                </div>
                <div style="background: linear-gradient(to left, rgb(119, 0, 255),rgb(0, 174, 255));width: 100%;height: 50px;margin-bottom: 100px;"></div>
            </div>
        </body>
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