class Medicine {
    constructor(name, dose, specification) {
        this.name = name;
        this.dose = dose;
        this.specification = specification;
    }

    getMedicine() {
        return {
            name: this.name,
            dose : this.dose,
            specification : this.specification
        };
    }
}

module.exports = Medicine;