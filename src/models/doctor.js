const bcryptjs = require('bcryptjs');

class Doctor {
    constructor(req) {
        this.username = req.username;
        this.email = req.email;
        this.password = req.password;
    }

    getDoctor() {
        return {
            username: this.username,
            email : this.email, 
            password : this.password
        };
    }

    encrypttPassword = async (password) => {
        const salt = await bcryptjs.genSalt(10);
        return bcryptjs.hash(password, salt);
    }

}

module.exports = Doctor;