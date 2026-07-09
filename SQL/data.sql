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