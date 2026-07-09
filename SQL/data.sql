USE HealTrackDB;
GO

-- DEFAULT DATA

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

-- THAI

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
GO

-- CUONG

INSERT INTO Patient (full_name, dob, gender, phone, address, email) VALUES
('John Doe', '1980-05-15', 'M', '555-1234', '123 Elm St', 'johndoe@example.com'),
('Jane Smith', '1990-08-22', 'F', '555-5678', '456 Oak St', 'janesmith@example.com'),
('Alice Johnson', '1975-12-05', 'F', '555-8765', '789 Pine St', 'alicejohnson@example.com'),
('Bob Brown', '1985-03-10', 'M', '555-4321', '321 Maple St', 'bobbrown@example.com'),
('Charlie Davis', '1995-07-18', 'M', '555-6789', '654 Cedar St', 'charliedavis@example.com');

INSERT INTO Department (name, location) VALUES
('Cardiology', 'Building A, Floor 2'),
('Neurology', 'Building B, Floor 3');
GO

INSERT INTO dbo.Doctor (full_name, phone, email, specialization, department_id) VALUES
('Dr. Emily Carter', '555-1111', 'emily.carter@example.com', 'Cardiologist', 2),
('Dr. Michael Thompson', '555-2222', 'michael.thompson@example.com', 'Neurologist', 3),
('Dr. Sarah Lee', '555-3333', 'sarah.lee@example.com', 'Pediatrician', 3),
('Dr. David Wilson', '555-4444', 'david.wilson@example.com', 'Orthopedic Surgeon', 2);
GO

UPDATE Department SET head_doctor_id = 3 WHERE id = 2;
UPDATE Department SET head_doctor_id = 4 WHERE id = 3;
GO

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id) VALUES
('2025-07-01 10:00:00', 'Routine Checkup', 'cancelled', 1, 3),
('2025-09-02 14:30:00', 'Follow-up Visit', 'completed', 2, 4),
('2025-11-03 09:15:00', 'Consultation', 'completed', 6, 6),
('2026-01-04 11:45:00', 'Physical Therapy', 'completed', 7, 2),
('2026-03-05 13:00:00', 'Specialist Consultation', 'cancelled', 5, 3),
('2026-05-06 15:30:00', 'Routine Checkup', 'completed', 1, 4),
('2026-07-07 10:00:00', 'Follow-up Visit', 'cancelled', 2, 3),
('2026-09-08 14:30:00', 'Consultation', 'upcoming', 3, 4),
('2026-11-09 09:15:00', 'Physical Therapy', 'upcoming', 4, 1),
('2027-01-10 11:45:00', 'Specialist Consultation', 'upcoming', 5, 2);

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id, created_at) VALUES
('Hypertension', 'Patient needs to monitor blood pressure daily.', 1, 3, '2025-06-01'),
('Diabetes Type 2', 'Patient advised to follow a strict diet and exercise regimen.', 2, 4, '2025-09-02'),
('Migraine', 'Patient prescribed medication for migraine relief.', 3, 5, '2025-11-03'),
('Asthma', 'Patient advised to use inhaler as needed.', 4, 2, '2026-01-04'),
('High Cholesterol', 'Patient recommended to reduce saturated fats in diet.', 2, 3, '2026-04-09');
GO

-- SELF HANDLE

INSERT INTO Prescription (notes, medical_record_id, created_at) VALUES
('Revisit after 1 month.', 4, '2025-06-01'),
('Eat less fatty foods.', 5, '2025-09-02'),
('Exercise regularly.', 6, '2026-01-04'),
('Take medication as prescribed.', 8, '2026-04-09');
GO

INSERT INTO PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed) VALUES
(1, 1, 'Take one tablet daily after meals.', 30, 30),
(2, 2, 'Take two tablets daily before breakfast.', 60, 120),
(3, 11, 'Use inhaler as needed for asthma symptoms.', 90, 90),
(4, 5, 'Take one tablet every night before bed.', 30, 30),
(3, 6, 'Take one capsule daily in the morning.', 30, 30),
(1, 3, 'Take one tablet every 8 hours.', 10, 30),
(2, 4, 'Take one tablet daily after meals.', 30, 30),
(3, 7, 'Take one tablet every 12 hours.', 15, 30),
(4, 8, 'Take one tablet daily before breakfast.', 60, 60),
(1, 9, 'Take one tablet every night before bed.', 30, 30),
(2, 10, 'Take one tablet daily after meals.', 30, 30),
(3, 12, 'Take one capsule every 8 hours.', 10, 30),
(4, 13, 'Take one tablet daily before breakfast.', 60, 60),
(1, 14, 'Take one tablet every night before bed.', 30, 30),
(2, 15, 'Take one tablet daily after meals.', 30, 30),
(3, 16, 'Take one capsule every 8 hours.', 10, 30),
(4, 17, 'Take one tablet daily before breakfast.', 60, 60),
(1, 18, 'Take one tablet every night before bed.', 30, 30),
(2, 19, 'Take one tablet daily after meals.', 30, 30),
(3, 20, 'Take one capsule every 8 hours.', 10, 30);

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id) VALUES
('101A', '2025-06-01', '2025-06-10', 5000, 1, 1, 1),
('202B', '2025-09-02', '2025-09-12', 7000, 2, 2, 2),
('303C', '2025-11-03', '2025-11-13', 6000, 3, 3, 2),
('404D', '2026-01-04', '2026-01-14', 8000, 4, 4, 1),
('606F', '2026-05-01', NULL, NULL, 1, 2, 2),
('102A', '2026-07-03', NULL, NULL, 2, 3, 1);
GO