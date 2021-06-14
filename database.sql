CREATE DATABASE hospital;

USE hospital;

-- Personal

CREATE TABLE doctor(
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    verify BOOL NOT NULL, -- CAMBIO
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

CREATE TABLE nurse(
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

CREATE TABLE staff(
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

CREATE TABLE patient(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surnames VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

-- Consultas
CREATE TABLE consultation(
	id INT NOT NULL AUTO_INCREMENT,
    id_pat INT NOT NULL,
    id_doc INT,  -- Cambio
    id_nur INT NOT NULL,
    reason VARCHAR(200) NOT NULL,
    results VARCHAR(200), -- Cambio
    create_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_patient_con FOREIGN KEY (id_pat) REFERENCES patient(id),
    CONSTRAINT fk_doctor_con FOREIGN KEY (id_doc) REFERENCES doctor(id),
    CONSTRAINT fk_nurse_con FOREIGN KEY (id_nur) REFERENCES nurse(id),
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

-- Tablas dependientes

CREATE TABLE vitalsigns(
	id_con INT NOT NULL,
    weight DOUBLE NOT NULL,
    size DOUBLE NOT NULL,
    temperatura DOUBLE NOT NULL,
    blood_pre VARCHAR(15),
    hearbeat INT NOT NULL,
    CONSTRAINT fk_consultation_vital FOREIGN KEY (id_con) REFERENCES consultation(id)
)engine="InnoDB" default charset=latin1;

CREATE TABLE prescription(
	id_con INT NOT NULL,
    id_doc INT NOT NULL,
    list TEXT,
    create_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_consultation_pres FOREIGN KEY (id_con) REFERENCES consultation(id),
    CONSTRAINT fk_doctor_pres FOREIGN KEY (id_doc) REFERENCES doctor(id)
)engine="InnoDB" default charset=latin1;

-- Pruebas
select * from doctor;
SELECT concat(name, ' ', surnames) AS fullname FROM patient;
SELECT concat(name, ' ', surnames) AS fullname FROM patient WHERE name = 'Gerardo';
select * from nurse;
select * from staff;
select * from patient;

select id from patient where name = 'Gerardo' and surnames = 'Martinez';
select id from patient where concat(name, ' ', surnames) = 'Gerardo Martinez';


select * from consultation;

-- Cambio en la tabla Consultation y Doctor
drop table vitalsigns;
drop table prescription;
drop table consultation;
drop table doctor;
-- Fin del cambio

update doctor set verify = true where id = 1;