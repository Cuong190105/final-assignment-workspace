USE HealTrackDB;
GO

-- DEFAULT DATA

INSERT INTO Medication (name, unit, price, stock) VALUES
("Paracetamol 500mg", "tablet", 1200, 5000),
("Amoxicillin 500mg", "capsule", 2500, 3000),
("Ibuprofen 400mg", "tablet", 1800, 2500),
("Panadol Extra", "tablet", 2200, 4000),
("Berberin", "tablet", 500, 10000),
("Cephalexin 500mg", "capsule", 3000, 1500),
("Augmentin 1g", "tablet", 18500, 800),
("Nexium 40mg", "tablet", 24000, 600),
("Salonpas Gel", "tube", 35000, 150),
("Voltaren Emulgel", "tube", 75000, 120),
("Gaviscon Dual Action", "sachet", 6500, 5),
("Smecta", "sachet", 4800, 2000),
("Otrivin 0.1%", "bottle", 55000, 8),
("Tobradex Eyedrops", "bottle", 58000, 300),
("Eugica Green", "capsule", 1200, 6000),
("Efferalgan Codeine", "tablet", 4500, 1800),
("Boganic", "softgel", 2800, 3500),
("Maalox", "tablet", 1500, 2200),
("Contractubex", "tube", 185000, 90),
("Natri Clorid 0.9%", "bottle", 6000, 1500);

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

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id) VALUES
('101A', '2025-06-01', '2025-06-10', 5000, 1, 1, 1),
('202B', '2025-09-02', '2025-09-12', 7000, 2, 2, 2),
('303C', '2025-11-03', '2025-11-13', 6000, 3, 3, 2),
('404D', '2026-01-04', '2026-01-14', 8000, 4, 4, 1),
('606F', '2026-05-01', NULL, NULL, 1, 2, 2),
('102A', '2026-07-03', NULL, NULL, 2, 3, 1);
GO

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
GO

--Bui Dang Thinh

USE HealTrackDB;
GO

INSERT INTO Department (name, location, head_doctor_id, is_active)
VALUES ('Cardiology 2', 'Building A - Floor 3', NULL, 1);
GO

INSERT INTO Doctor (full_name, phone, email, specialization, is_active, department_id)
VALUES 
('John Smith', '0901234567', 'john.smith@healtrack.com', 'Cardiologist', 1, 4),
('Emily Johnson', '0902345678', 'emily.johnson@healtrack.com', 'Cardiac Surgeon', 1, 4),
('Bear Paul', '0915658253', 'bear.paul@healtrack.com', 'Cardiac Surgeon', 1, 4);

-- Cập nhật head_doctor_id cho Department sau khi Doctor đã tồn tại
UPDATE Department
SET head_doctor_id = 7
WHERE id = 4;

INSERT INTO Patient (full_name, dob, gender, phone, address, email, is_active)
VALUES 
('Michael Brown', '1985-04-12', 'M', '0911223344', '123 Main Street, District 1', 'michael.brown@gmail.com', 1),
('Sarah Davis', '1992-09-25', 'F', '0922334455', '456 Second Avenue, District 3', 'sarah.davis@gmail.com', 1);
GO

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id, is_active)
VALUES 
('2026-07-10 09:00:00', 'Routine heart checkup', 'upcoming', 8, 7, 1),
('2026-07-11 14:30:00', 'Chest pain evaluation', 'upcoming', 9, 8, 1),
('2026-06-20 10:00:00', 'Follow-up consultation', 'completed', 8, 8, 1);
GO

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id, is_active)
VALUES 
('Hypertension', 'Patient advised to reduce salt intake and monitor blood pressure daily.', 8, 5, 1),
('Arrhythmia', 'Irregular heartbeat detected, scheduled for further ECG testing.', 9, 8, 1),
('Mild Angina', 'Prescribed medication and recommended lifestyle changes.', 8, 7, 1);
GO

INSERT INTO Admission (room, admission_date, discharge_date, cost, is_active, patient_id, doctor_id, department_id)
VALUES 
('A-301', '2026-06-15', '2026-06-20', 5000000, 1, 8, 5, 4),
('A-302', '2026-06-18', NULL, 3000000, 1, 9, 8, 4);

--vy
-- 1. Thêm Khoa
INSERT INTO dbo.Department (name, location) 
VALUES (N'Khoa Thần Kinh', N'Tầng 4 - Tòa nhà B');

-- 2. Thêm Bác sĩ 
INSERT INTO dbo.Doctor (full_name, phone, email, specialization, department_id)
VALUES (N'Đỗ Nhật Minh', '0912444555', 'minh.dn@hospital.com', N'Phẫu thuật não', 
       (SELECT id FROM dbo.Department WHERE name = N'Khoa Thần Kinh')),
       (N'Vũ Thị Lan Anh', '0912666777', 'lananh.vt@hospital.com', N'Điều trị rối loạn giấc ngủ', 
       (SELECT id FROM dbo.Department WHERE name = N'Khoa Thần Kinh'));

INSERT INTO dbo.Doctor (full_name, phone, email, specialization, department_id)
VALUES (N'Trần Minh Tuấn', '0988777666', 'tuan.tm@hospital.com', N'Nội thần kinh', 
       (SELECT id FROM dbo.Department WHERE name = N'Khoa Thần Kinh'));

-- 3. Cập nhật Head Doctor 
UPDATE dbo.Department 
SET head_doctor_id = (SELECT id FROM dbo.Doctor WHERE full_name = N'Đỗ Nhật Minh')
WHERE name = N'Khoa Thần Kinh';

-- 4. Thêm Bệnh nhân
INSERT INTO dbo.Patient (full_name, dob, gender, phone, address, email)
VALUES (N'Lương Thế Vinh', '1975-09-09', 'M', '0988111222', N'Bắc Giang', 'vinh.luong@gmail.com'),
       (N'Mai Thu Huyền', '1989-11-20', 'F', '0988333444', N'Ninh Bình', 'huyen.mai@outlook.com');
       
INSERT INTO dbo.Patient (full_name, dob, gender, phone, address, email)
VALUES (N'Nguyễn Văn An', '1990-05-15', 'M', '0911222333', N'Hà Nội', 'an.nguyen@gmail.com');

-- 5. Thêm Cuộc hẹn 
INSERT INTO dbo.Appointment (appointment_datetime, reason, status, patient_id, doctor_id)
VALUES ('2026-08-05 08:00:00', N'Đau nửa đầu kéo dài', 'upcoming', 
       (SELECT id FROM dbo.Patient WHERE full_name = N'Lương Thế Vinh'), 
       (SELECT id FROM dbo.Doctor WHERE full_name = N'Đỗ Nhật Minh'));

INSERT INTO dbo.Appointment (appointment_datetime, reason, status, patient_id, doctor_id)
VALUES ('2026-07-08 10:00:00', N'Kiểm tra định kỳ', 'completed', 
       (SELECT id FROM dbo.Patient WHERE full_name = N'Nguyễn Văn An'), 
       (SELECT id FROM dbo.Doctor WHERE full_name = N'Trần Minh Tuấn'));

INSERT INTO dbo.Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id)
VALUES (
    'A101', 
    GETDATE(),            -- Lấy ngày hôm nay (09/07/2026)
    NULL,                 -- Bệnh nhân đang nằm viện nên chưa có ngày xuất viện
    1500000, 
    (SELECT TOP 1 id FROM dbo.Patient), 
    (SELECT TOP 1 id FROM dbo.Doctor), 
    (SELECT TOP 1 id FROM dbo.Department)
);
INSERT INTO dbo.MedicalRecord (patient_id, doctor_id, diagnosis, note)
VALUES 
(
    (SELECT id FROM dbo.Patient WHERE full_name = N'Nguyễn Văn An'),
    (SELECT id FROM dbo.Doctor WHERE full_name = N'Trần Minh Tuấn'),
    N'Viêm họng cấp',
    N'Đau họng, sốt nhẹ, soi họng thấy sưng đỏ.'
),
(
    (SELECT id FROM dbo.Patient WHERE full_name = N'Mai Thu Huyền'),
    (SELECT id FROM dbo.Doctor WHERE full_name = N'Vũ Thị Lan Anh'),
    N'Mất ngủ mãn tính',
    N'Bệnh nhân không ngủ được quá 4 tiếng/đêm.'
);
INSERT INTO dbo.Prescription (medical_record_id, notes, created_at)
VALUES (
    (SELECT TOP 1 id FROM dbo.MedicalRecord ORDER BY created_at DESC), 
    N'Đơn thuốc điều trị đau đầu', 
    SYSDATETIME()
);

INSERT INTO dbo.PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed)
VALUES (
    (SELECT TOP 1 id FROM dbo.Prescription ORDER BY created_at DESC), 
    1, 
    N'Uống 1 viên sau ăn, 2 lần/ngày', 
    7, 
    14
);

-- Nam
INSERT INTO Department (name, location, head_doctor_id, is_active) VALUES
(N'Rehabilitation 3', N'Building C - Floor 1', NULL, 1),
(N'Cardiology 3', N'Building A - Floor 2', NULL, 1),
(N'Neurology 3', N'Building B - Floor 3', NULL, 1),
(N'Orthopedics 3', N'Building F - Floor 1', NULL, 1),
(N'Oncology 3', N'Building E - Floor 4', NULL, 1);
GO

INSERT INTO Doctor (full_name, phone, email, specialization, department_id, is_active) VALUES
(N'Phạm Minh Khang', '0908111222', 'khang.pm@hospital.com', N'Physical Rehabilitation', 6, 1),
(N'Hoàng Gia Bảo', '0908333444', 'bao.hg@hospital.com', N'Sports Medicine', 6, 1),
(N'Dr. Emily Carter', '555-1111', 'emily.carter@example.com', 'Cardiologist', 7, 1),
(N'John Smith', '0901234567', 'john.smith@healtrack.com', 'Cardiac Surgeon', 7, 1),
(N'Dr. Michael Thompson', '555-2222', 'michael.thompson@example.com', 'Neurologist', 8, 1),
(N'Dr. Sarah Lee', '555-3333', 'sarah.lee@example.com', 'Pediatric Neurologist', 8, 1),
(N'Hà Triệu Hoan', '0955333444', 'hoan.ht@healtrack.com', N'Orthopedic Surgeon', 9, 1),
(N'Vũ Hoàng Long', '0955777888', 'long.vh@healtrack.com', N'Orthopedic Specialist', 9, 1),
(N'Lưu Tiến Dũng', '0955111222', 'dung.lt@healtrack.com', N'Oncologist', 10, 1),
(N'Nguyễn Xuân Sơn', '0955222333', 'son.nx@healtrack.com', N'Surgical Oncologist', 10, 1);
GO

UPDATE Department SET head_doctor_id = 13 WHERE id = 6; 
UPDATE Department SET head_doctor_id = 15 WHERE id = 7; 
UPDATE Department SET head_doctor_id = 17 WHERE id = 8; 
UPDATE Department SET head_doctor_id = 19 WHERE id = 9; 
UPDATE Department SET head_doctor_id = 21 WHERE id = 10; 
GO

INSERT INTO Patient (full_name, dob, gender, phone, address, email, is_active) VALUES
(N'Bùi Ngọc Anh', '1998-04-18', 'F', '0911222333', N'Hai Phong', 'ngocanh98@gmail.com', 1),
(N'Đặng Quốc Huy', '2000-09-25', 'M', '0911444555', N'Quang Ninh', 'quochuy00@gmail.com', 1),
(N'John Doe', '1980-05-15', 'M', '555-1234', N'123 Elm St', 'johndoe@example.com', 1),
(N'Jane Smith', '1988-08-22', 'F', '555-5678', N'456 Oak St', 'janesmith@example.com', 1), 
(N'Michael Brown', '1985-04-12', 'M', '0911223344', N'123 Main Street', 'michael.brown@gmail.com', 1),
(N'Sarah Davis', '1992-09-25', 'F', '0922334455', N'456 Second Ave', 'sarah.davis@gmail.com', 1),
(N'Nguyễn Bá Tùng', '1975-04-12', 'M', '0977000001', N'Đống Đa, Hà Nội', 'tung.nb75@gmail.com', 1),
(N'Lê Minh Châu', '1982-08-24', 'F', '0977000002', N'Cầu Giấy, Hà Nội', 'chau.lm82@gmail.com', 1),
(N'Trần Văn Hùng', '1965-03-14', 'M', '0977000003', N'Ba Đình, Hà Nội', 'hung.tv65@gmail.com', 1),
(N'Phạm Hải Yến', '2005-11-12', 'F', '0977000004', N'Hai Bà Trưng, Hà Nội', 'yen.ph05@gmail.com', 1),
(N'Đỗ Hoàng Long', '2015-06-20', 'M', '0977000005', N'Tây Hồ, Hà Nội', 'long.dh15@gmail.com', 1),
(N'Vũ Phương Thảo', '1993-01-30', 'O', '0977000006', N'Thanh Xuân, Hà Nội', 'thao.vp93@gmail.com', 1);
GO

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id, is_active) VALUES
-- Đã hoàn thành
('2026-07-01 08:30:00', N'Knee injury consultation', 'completed', 13, 13, 1),
('2026-07-02 10:00:00', N'Shoulder pain examination', 'completed', 14, 14, 1),
('2026-07-03 09:00:00', N'Routine heart checkup', 'completed', 15, 15, 1),
('2026-07-04 14:00:00', N'Chronic headache evaluation', 'completed', 16, 17, 1),
('2026-07-05 10:30:00', N'Bone fracture follow-up', 'completed', 19, 19, 1),
('2026-07-06 11:00:00', N'Chemotherapy session 1', 'completed', 20, 21, 1),
-- Sắp tới
('2026-07-15 14:00:00', N'Physical therapy follow-up', 'upcoming', 13, 14, 1),
('2026-07-18 09:30:00', N'Cardiology Echo check', 'upcoming', 18, 15, 1),
('2026-07-20 10:00:00', N'Pediatric Neuro assessment', 'upcoming', 23, 17, 1),
('2026-07-22 15:00:00', N'Spine alignment check', 'upcoming', 21, 20, 1),
('2026-07-25 09:00:00', N'Oncology blood test review', 'upcoming', 20, 21, 1),
('2026-07-28 13:30:00', N'General checkup after discharge', 'upcoming', 15, 13, 1),
-- Hủy
('2026-06-20 11:00:00', N'Severe chest pain crisis', 'cancelled', 17, 15, 1),
('2026-06-25 15:30:00', N'Routine Checkup', 'cancelled', 18, 17, 1),
('2026-07-02 16:00:00', N'Joint stiffness consultation', 'cancelled', 24, 17, 1),
('2026-07-03 10:00:00', N'Post-op vision evaluation', 'cancelled', 10, 1, 1);
GO

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id, is_active) VALUES
(N'Knee ligament strain', N'Physical therapy recommended', 13, 13, 1),
(N'Rotator cuff inflammation', N'Medication and exercise prescribed', 14, 14, 1),
(N'Hypertension Stage 1', N'Patient needs to monitor blood pressure daily.', 15, 15, 1),
(N'Migraine with aura', N'Prescribed specialist painkillers and dim room rest.', 16, 17, 1),
(N'Femur Fracture (Left side)', N'Keep cast for 6 weeks, no heavy lifting.', 19, 19, 1),
(N'Lung Cancer Stage II', N'Admitted for intensive chemotherapy plan.', 20, 21, 1),
(N'Mild Arrhythmia', N'Avoid caffeine, monitor heart rate using smartwatch.', 17, 15, 1),
(N'Gastritis Acute', N'Take anti-acid medications 30 minutes before meals.', 18, 17, 1);
GO

INSERT INTO Prescription (notes, medical_record_id, is_active) VALUES
(N'Take strictly after food.', 15, 1),
(N'Use pain reliever only when necessary.', 17, 1),
(N'Do not skip doses.', 20, 1),
(N'Rest in a quiet room.', 16, 1),
(N'High cost specialist therapy items included.', 18, 1)
GO

INSERT INTO PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed, is_active) VALUES
(6, 16, N'Take 1 tablet every 8 hours.', 10, 30, 1),
(7, 19, N'Take 1 capsule daily in the morning.', 30, 30, 1),
(8, 14, N'Take 1 tablet after meals.', 30, 30, 1),
(9, 18, N'Take 1 pill before bedtime.', 14, 14, 1),
(10, 15, N'Take 2 capsules after lunch and dinner.', 10, 400, 1),
(10, 17, N'Take 1 tablet in the morning.', 10, 200, 1);

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id, is_active) VALUES
('R201', '2026-07-01', '2026-07-04', 4500000, 13, 13, 6, 1),
('Room F102', '2026-07-01', '2026-07-08', 14500000, 14, 14, 9, 1),
('Room F103', '2026-07-02', '2026-07-07', 9000000, 21, 20, 7, 1),
('101A', '2026-06-01', NULL, NULL, 17, 15, 4, 1),
('Room E401', '2026-07-05', NULL, NULL, 20, 21, 10, 1);