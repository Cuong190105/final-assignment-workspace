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
VALUES
(N'Rehabilitation', N'Da Nang');

INSERT INTO Doctor (full_name, phone, email, specialization, department_id)
VALUES
(N'Pham Minh Khang', '0908111222', 'khang.pm@hospital.com', N'Physical Rehabilitation', 1),
(N'Hoang Gia Bao', '0908333444', 'bao.hg@hospital.com', N'Sports Medicine', 1);

UPDATE Department
SET head_doctor_id = 1
WHERE id = 1;

INSERT INTO Patient (full_name, dob, gender, phone, address, email)
VALUES
(N'Bui Ngoc Anh', '1998-04-18', 'F', '0911222333', N'Hai Phong', 'ngocanh98@gmail.com'),
(N'Dang Quoc Huy', '2000-09-25', 'M', '0911444555', N'Quang Ninh', 'quochuy00@gmail.com');

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id)
VALUES
('2026-07-15 08:30:00', N'Knee injury consultation', 'completed', 1, 1),
('2026-07-15 10:00:00', N'Shoulder pain examination', 'completed', 2, 2),
('2026-07-16 14:00:00', N'Physical therapy follow-up', 'upcoming', 1, 2);

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id)
VALUES
(N'Knee ligament strain', N'Physical therapy recommended', 1, 1),
(N'Rotator cuff inflammation', N'Medication and exercise prescribed', 2, 2),
(N'Improved mobility', N'Continue rehabilitation program', 1, 2);

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id)
VALUES
('R201', '2026-07-15', '2026-07-18', 4500000, 1, 1, 1),
('R205', '2026-07-16', NULL, NULL, 2, 2, 1);