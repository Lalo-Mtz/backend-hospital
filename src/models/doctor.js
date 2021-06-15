// Modules
const bcryptjs = require('bcryptjs');

class Doctor {
    constructor(req) {
        this.username = req.username;
        this.email = req.email;
        this.password = req.password;
        this.verify = req.verify || false;
        if (req.id) {
            this.id = req.id;
        }
    }

    getDoctor() {
        return {
            username: this.username,
            email: this.email,
            password: this.password,
            verify: this.verify
        };
    }

    getId() {
        return this.id;
    }

    getVerify(){
        return this.verify;
    }

    getEmail() {
        return this.email;
    }

    getUsername(){
        return this.username;
    }

    encrypttPassword = async (password) => {
        const salt = await bcryptjs.genSalt(10);
        return bcryptjs.hash(password, salt);
    }

    validatePassword = async (password) => {
        return bcryptjs.compare(password, this.password);
    }

}

module.exports = Doctor;