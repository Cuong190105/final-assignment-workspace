USE HealTrackDB;
GO

INSERT INTO Medication (name, unit, price, stock) VALUES
('Paracetamol', 'mg', 500, 1000),
('Amoxicillin', 'mg', 1000, 500),
('Ibuprofen', 'mg', 800, 300),
('Metformin', 'mg', 1200, 200),
('Atorvastatin', 'mg', 1500, 150),
('Omeprazole', 'mg', 700, 400),
('Amlodipine', 'mg', 900, 250),
('Losartan', 'mg', 1100, 350),
('Simvastatin', 'mg', 1300, 180),
('Levothyroxine', 'mg', 1400, 220),
('Albuterol', 'mg', 600, 300),
('Gabapentin', 'mg', 1000, 200),
('Hydrochlorothiazide', 'mg', 800, 400),
('Citalopram', 'mg', 1200, 150),
('Sertraline', 'mg', 1300, 250),
('Furosemide', 'mg', 900, 350),
('Clopidogrel', 'mg', 1100, 180),
('Warfarin', 'mg', 1400, 220),
('Prednisone', 'mg', 1000, 300),
('Tramadol', 'mg', 1200, 200);

--Bui Dang Thinh

USE HealTrackDB;
GO

INSERT INTO Department (name, location, head_doctor_id, is_active)
VALUES ('Cardiology', 'Building A - Floor 3', NULL, 1);
GO

INSERT INTO Doctor (full_name, phone, email, specialization, is_active, department_id)
VALUES 
('John Smith', '0901234567', 'john.smith@healtrack.com', 'Cardiologist', 1, 1),
('Emily Johnson', '0902345678', 'emily.johnson@healtrack.com', 'Cardiac Surgeon', 1, 1),
('Bear Paul', '0915658253', 'bear.paul@healtrack.com', 'Cardiac Surgeon', 1, 1);

-- Cập nhật head_doctor_id cho Department sau khi Doctor đã tồn tại
UPDATE Department
SET head_doctor_id = 1
WHERE id = 1;

INSERT INTO Patient (full_name, dob, gender, phone, address, email, is_active)
VALUES 
('Michael Brown', '1985-04-12', 'M', '0911223344', '123 Main Street, District 1', 'michael.brown@gmail.com', 1),
('Sarah Davis', '1992-09-25', 'F', '0922334455', '456 Second Avenue, District 3', 'sarah.davis@gmail.com', 1);
GO

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id, is_active)
VALUES 
('2026-07-10 09:00:00', 'Routine heart checkup', 'upcoming', 1, 1, 1),
('2026-07-11 14:30:00', 'Chest pain evaluation', 'upcoming', 2, 2, 1),
('2026-06-20 10:00:00', 'Follow-up consultation', 'completed', 1, 2, 1);
GO

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id, is_active)
VALUES 
('Hypertension', 'Patient advised to reduce salt intake and monitor blood pressure daily.', 1, 1, 1),
('Arrhythmia', 'Irregular heartbeat detected, scheduled for further ECG testing.', 2, 2, 1),
('Mild Angina', 'Prescribed medication and recommended lifestyle changes.', 1, 2, 1);
GO

INSERT INTO Admission (room, admission_date, discharge_date, cost, is_active, patient_id, doctor_id, department_id)
VALUES 
('A-301', '2026-06-15', '2026-06-20', 5000000, 1, 1, 1, 1),
('A-302', '2026-06-18', NULL, 3000000, 1, 2, 2, 1);
GO