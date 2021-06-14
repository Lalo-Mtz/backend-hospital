module.exports = {
    database: {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE_DB
    },

    jsonToken: {
        secret: process.env.SECRET_JWT,
        secretNurse: process.env.SECRET_NURSE_JWT,
        secretStaff: process.env.SECRET_STAFF_JWT,
        secretEmailAuth: process.env.SECRET_EMAIL_JWT
    }
}