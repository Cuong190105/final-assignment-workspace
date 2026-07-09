-- linh

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


INSERT INTO Department (name, location)
VALUES (N'Cardiology', N'Floor 2');

INSERT INTO Doctor (full_name, phone, email, specialization, department_id)
VALUES 
(N'Văn Hồng Hải', '0978567458', 'hai@hospital.com', N'Cardiologist', 1),
(N'Đoàn Thị Mậu', '0976562571', 'mau@hospital.com', N'Cardiologist', 1);

-- Set head doctor
UPDATE Department
SET head_doctor_id = 1
WHERE id = 1;

INSERT INTO Patient (full_name, dob, gender, phone, address, email)
VALUES 
(N'Lê Văn Nam', '1990-01-01', 'M', '0987267185', N'Hanoi', 'nam1123@gmail.com'),
(N'Phạm Thị Dung', '1995-05-05', 'F', '0378912904', N'HCM', 'dung98@gmail.com');

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id)
VALUES
('2026-01-01 08:00', N'Checkup', 'upcoming', 1, 1),
('2026-01-03 09:00', N'Chest pain', 'completed', 2, 1),
('2026-01-05 10:00', N'Follow-up', 'upcoming', 1, 2);

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id)
VALUES
(N'Flu', N'Mild symptoms', 1, 1),
(N'Heart issue', N'Needs monitoring', 2, 1),
(N'Checkup normal', N'All good', 1, 2);

INSERT INTO Prescription (notes, medical_record_id)
VALUES
(N'Take after meal', 1),
(N'Use for 5 days', 2);


INSERT INTO PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed)
VALUES
(1, 1, N'2 tablets/day', 5, 10),
(1, 2, N'1 tablet/day', 5, 5),
(2, 3, N'3 capsules/day', 7, 21);

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id)
VALUES
('A101', '2026-01-02', NULL, 5000000, 1, 1, 1),
('A102', '2026-01-03', '2026-01-10', 8000000, 2, 2, 1);

GO