DROP DATABASE IF EXISTS HealTrackDB;
GO

CREATE DATABASE HealTrackDB;
GO

USE HealTrackDB;
GO

CREATE TABLE Department (
	id INT IDENTITY(1, 1),
	name NVARCHAR(50) NOT NULL,
	location NVARCHAR(255) NOT NULL,
	head_doctor_id INT,
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_Department PRIMARY KEY (id),
	CONSTRAINT UQ_Department_Name UNIQUE (name),
);
CREATE TABLE Doctor (
	id INT IDENTITY(1, 1),
	full_name NVARCHAR(50) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	email VARCHAR(255) NOT NULL,
	specialization NVARCHAR(100) NOT NULL,
	is_active BIT NOT NULL DEFAULT 1,
	department_id INT NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (id),
	CONSTRAINT FK_Doctor_Department FOREIGN KEY (department_id) REFERENCES Department(id),
);
CREATE TABLE Patient (
	id INT IDENTITY(1, 1),
	full_name NVARCHAR(50) NOT NULL,
	dob DATE NOT NULL,
	gender CHAR(1) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	address NVARCHAR(255) NOT NULL,
	email VARCHAR(255),
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_Patient PRIMARY KEY (id),
	CONSTRAINT CHK_Gender CHECK (gender IN ('M', 'F', 'O')),
);
CREATE TABLE Appointment (
	id INT IDENTITY(1, 1),
	appointment_datetime DATETIME NOT NULL,
	reason NVARCHAR(255) NOT NULL,
	status VARCHAR(20) NOT NULL,
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_Appointment PRIMARY KEY (id),
	CONSTRAINT FK_Appointment_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
	CONSTRAINT CHK_status CHECK (status IN ('upcoming', 'completed', 'cancelled')),
	CONSTRAINT UQ_appointment_datetime UNIQUE (doctor_id, appointment_datetime),
);
CREATE TABLE MedicalRecord (
	id INT IDENTITY(1, 1),
	diagnosis NVARCHAR(MAX) NOT NULL,
	note NVARCHAR(MAX),
	created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_MedicalRecord PRIMARY KEY (id),
	CONSTRAINT FK_MedicalRecord_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_MedicalRecord_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
);
CREATE TABLE Prescription (
	id INT IDENTITY(1, 1),
	notes NVARCHAR(MAX),
	created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
	is_active BIT NOT NULL DEFAULT 1,
	medical_record_id INT NOT NULL,

	CONSTRAINT PK_Prescription PRIMARY KEY (id),
	CONSTRAINT FK_Prescription_MedicalRecord FOREIGN KEY (medical_record_id) REFERENCES MedicalRecord(id),
);
CREATE TABLE Admission (
	id INT IDENTITY(1, 1),
	room VARCHAR(10) NOT NULL,
	admission_date DATE NOT NULL DEFAULT GETDATE(),
	discharge_date DATE,
	cost BIGINT,
	is_active BIT NOT NULL DEFAULT 1,
	patient_id INT NOT NULL,
	doctor_id INT NOT NULL,
	department_id INT NOT NULL,

	CONSTRAINT PK_Admission PRIMARY KEY (id),
	CONSTRAINT FK_Admission_Patient FOREIGN KEY (patient_id) REFERENCES Patient(id),
	CONSTRAINT FK_Admission_Doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
	CONSTRAINT FK_Admission_Department FOREIGN KEY (department_id) REFERENCES Department(id),
);
CREATE TABLE Medication (
	id INT NOT NULL,
	name VARCHAR(50) NOT NULL,
	unit VARCHAR(10) NOT NULL,
	price INT NOT NULL,
	stock INT NOT NULL,
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_Medication PRIMARY KEY (id),
	CONSTRAINT CHK_Stock CHECK (stock >= 0),
);
CREATE TABLE PrescriptionItem (
	prescription_id INT NOT NULL,
	medication_id INT NOT NULL,
	dosage_instruction NVARCHAR(255) NOT NULL,
	duration_days INT NOT NULL,
	quantity_dispensed INT NOT NULL,
	is_active BIT NOT NULL DEFAULT 1,

	CONSTRAINT PK_PrescriptionItem PRIMARY KEY (prescription_id, medication_id),
	CONSTRAINT FK_PrescriptionItem_Prescription FOREIGN KEY (prescription_id) REFERENCES Prescription(id),
	CONSTRAINT FK_PrescriptionItem_Medication FOREIGN KEY (medication_id) REFERENCES Medication(id),
);
GO

ALTER TABLE Department
ADD CONSTRAINT FK_Department_HeadDoctor FOREIGN KEY (head_doctor_id) REFERENCES Doctor(id);
GO

CREATE OR ALTER FUNCTION dbo.fn_IsHeadDoctorInDepartment(@head_doctor_id INT, @department_id INT)
RETURNS BIT
AS
BEGIN
    DECLARE @Result BIT = 0;

    IF EXISTS (
        SELECT 1
        FROM Doctor d
        WHERE d.id = @head_doctor_id AND d.is_active = 1 AND d.department_id = @department_id
    )
    BEGIN
        SET @Result = 1;
    END

    RETURN @Result;
END;
GO

ALTER TABLE Department
ADD CONSTRAINT CHK_HeadDoctor CHECK (
	head_doctor_id IS NULL OR dbo.fn_IsHeadDoctorInDepartment(head_doctor_id, id) = 1
);

-- Needs a trigger to handle a case when a head doctor moves to another department without updating the department's head_doctor_id.

GO
-- Insert sample data below