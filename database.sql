CREATE DATABASE hospital;

USE hospital;

-- Personal

CREATE TABLE doctor(
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    verify BOOL NOT NULL, -- CAMBIO
    type VARCHAR(50), -- CAMBIO
    country VARCHAR(50), -- CAMBIO
    college VARCHAR(50), -- CAMBIO
    phone VARCHAR(50), -- CAMBIO
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
    sex VARCHAR(5) NOT NULL, -- Cambio
    state VARCHAR(20) NOT NULL, -- Cambio
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
    urgency INT NOT NULL, -- Cambio
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


-- Cambio en la tabla Consultation y Doctor
drop table vitalsigns;
drop table prescription;
drop table consultation;
drop table doctor;
drop table patient;
-- Fin del cambio

update doctor set verify = true where id = 1;

select * from prescription;
delete from prescription where id_con = 1;
delete from doctor where id = 9;

select * from consultation;
update consultation set id_doc = 1 where id_pat = 2;
delete from consultation where id_pat = 1;

-- Numero de pacientes
SELECT * FROM consultation WHERE id_doc = 1 GROUP BY (id_pat);

-- Pacientes atendidos recientemente por el doctor X 
select patient.name, patient.surnames, consultation.id from consultation inner join patient 
on patient.id = consultation.id_pat 
where consultation.id_doc = 1 
order by create_at desc;

-- Seleccoina los ultimos 8 pacientes
select * from patient 
order by id desc 
limit 0, 8;

-- Historial de consultas
SELECT consultation.id, consultation.create_at, patient.name, patient.surnames, consultation.reason FROM consultation INNER JOIN patient 
ON patient.id = consultation.id_pat 
WHERE consultation.id_doc = 1 
ORDER BY create_at DESC;



select * from consultation;
select * from consultation where create_at  = dayofweek();
select dayofyear('2021-06-17') - 7 as 'Result';
select dayofweek('2021-06-17') as 'Result';
select '2021-06-17' - '2021-06-01' as 'REsult';
select weekofyear('2021-06-17');

SELECT id AS n_week FROM consultation
WHERE id_doc = 1 AND weekofyear(create_at) = weekofyear('2021-06-17');
SELECT count(id) AS n_week FROM consultation
WHERE id_doc = 1 AND weekofyear(create_at) = weekofyear('2021-06-17');

select count((create_at)) as n from consultation;