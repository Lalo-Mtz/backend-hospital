const pool = require('../database');

class Consultation {
    constructor(req, id_nur) {
        this.fullname = req.fullname;
        this.id_pat = 0;
        this.id_doc = req.id_doc || 0;
        this.id_nur = id_nur;
        this.reason = req.reason;
        this.results = '';
    }

    getConsultation() {
        return {
            id_pat: this.id_pat,
            id_nur : this.id_nur, 
            reason : this.reason
        };
    }

    patientExist = async () => {
        const result = await pool.query('SELECT id FROM patient WHERE CONCAT(name, " ", surnames) = ?', [this.fullname]);
        if(result[0]){
            this.id_pat = result[0].id;
            return true;
        }
        return false;
    }

    getId_Pat(){
        return this.id_pat;
    }
}

module.exports = Consultation;