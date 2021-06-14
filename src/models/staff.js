// Modules
const bcryptjs = require('bcryptjs');

class Staff {
    constructor(req) {
        this.username = req.username;
        this.password = req.password;
        if(req.id){
            this.id = req.id;
        }
    }

    getStaff() {
        return {
            username: this.username,
            password : this.password
        };
    }

    getId(){
        return this.id;
    }

    getUsername(){
        return this.username;
    }

    encrypttPassword = async (password) => {
        const salt = await bcryptjs.genSalt(8);
        return bcryptjs.hash(password, salt);
    }

    validatePassword = async (password) => {
        return bcryptjs.compare(password, this.password);
    }
}

module.exports = Staff;