CREATE DATABASE HealthTrack;

USE HealthTrack;

CREATE TABLE Department (
	id INT IDENTITY(1, 1),
	name NVARCHAR(50) NOT NULL,
	location NVARCHAR(255) NOT NULL,
	head_doctor_id INT NOT NULL,

	CONSTRAINT PK_Department PRIMARY KEY (id),
	-- CONSTRAINT FK_HeadDoctor FOREIGN KEY (head_doctor_id) REFERENCES Doctor(id),
);
CREATE TABLE Doctor (
	id INT IDENTITY(1, 1),
	-- ...
	department_id INT NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (id),
	CONSTRAINT FK_Department FOREIGN KEY (department_id) REFERENCES Department(id),
);
CREATE TABLE Patient (
	id INT IDENTITY(1, 1),
	-- ...

	CONSTRAINT PK_Patient PRIMARY KEY (id),
);
CREATE TABLE Appointment (
	id INT IDENTITY(1, 1),
	-- ...
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,

	CONSTRAINT PK_Appointment PRIMARY KEY (id),
	CONSTRAINT FK_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
);
CREATE TABLE MedicalRecord (
	id INT IDENTITY(1, 1),
	-- ...
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,

	CONSTRAINT PK_MedicalRecord PRIMARY KEY (id),
	CONSTRAINT FK_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
);
CREATE TABLE Prescription (
	id INT IDENTITY(1, 1),
	-- ...
	medical_record_id INT NOT NULL,

	CONSTRAINT PK_Prescription PRIMARY KEY (id),
	CONSTRAINT FK_MedicalRecord FOREIGN KEY (medical_record_id) REFERENCES MedicalRecord(id),
);
CREATE TABLE Admission (
	id INT IDENTITY(1, 1),
	-- ...
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,
	department_id INT NOT NULL,

	CONSTRAINT PK_Admission PRIMARY KEY (id),
	CONSTRAINT FK_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
	CONSTRAINT FK_Department FOREIGN KEY (department_id) REFERENCES Department(id),
);
CREATE TABLE Medication (
	id INT NOT NULL,
	-- ...

	CONSTRAINT PK_Medication PRIMARY KEY (id),
);
CREATE TABLE PrescriptionMedication (
	prescription_id INT NOT NULL,
	medication_id INT NOT NULL,
	-- ...

	CONSTRAINT PK_PrescriptionMedication PRIMARY KEY (prescription_id, medication_id),
	CONSTRAINT FK_Prescription FOREIGN KEY (prescription_id) REFERENCES Prescription(id),
	CONSTRAINT FK_Medication FOREIGN KEY (medication_id) REFERENCES Medication(id),
);
