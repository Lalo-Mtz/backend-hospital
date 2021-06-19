class Patient {
    constructor(req) {
        this.name = req.name;
        this.surnames = req.surnames;
        this.birthdate = req.birthdate;
        this.phone = req.phone;
        this.sex = req.sex;
        this.state = req.state;
        if(req.id){
            this.id = req.id;
        }
    }

    getPatient() {
        return {
            name: this.name,
            surnames : this.surnames, 
            birthdate : this.birthdate,
            phone : this.phone,
            sex : this.sex,
            state : this.state
        };
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getFullname(){
        return this.name + ' ' + this.surnames;
    }
}

module.exports = Patient;