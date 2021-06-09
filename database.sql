CREATE DATABASE hospital;

USE hospital;

-- Personal

CREATE TABLE doctor(
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
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
    id_doc INT NOT NULL,
    id_nur INT NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    reason VARCHAR(200) NOT NULL,
    results VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
)engine="InnoDB" default charset=latin1;

-- Tablas dependientes

CREATE TABLE vitalsigns(
	id_con INT NOT NULL,
    weight DOUBLE NOT NULL,
    size DOUBLE NOT NULL,
    temperatura DOUBLE NOT NULL,
    blood_pre VARCHAR(15),
    hearbeat INT NOT NULL
)engine="InnoDB" default charset=latin1;

CREATE TABLE prescription(
	id_con INT NOT NULL,
    id_doc INT NOT NULL,
    list VARCHAR(300),
    create_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_consultation FOREIGN KEY (id_con) REFERENCES consultation(id)
)engine="InnoDB" default charset=latin1;

-- Pruebas
select * from doctor;