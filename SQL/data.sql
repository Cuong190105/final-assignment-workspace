USE HealTrackDB;
GO

-- ===================================================================
-- 1. NGẮT TẠM THỜI CÁC RÀNG BUỘC KHÓA NGOẠI VÀ RÀNG BUỘC KIỂM TRA
-- ===================================================================
ALTER TABLE Department NOCHECK CONSTRAINT CHK_HeadDoctor;
ALTER TABLE Department NOCHECK CONSTRAINT FK_Department_HeadDoctor;
ALTER TABLE Doctor NOCHECK CONSTRAINT FK_Doctor_Department;
ALTER TABLE Appointment NOCHECK CONSTRAINT FK_Appointment_Doctor;
ALTER TABLE Admission NOCHECK CONSTRAINT FK_Admission_Doctor;
ALTER TABLE Admission NOCHECK CONSTRAINT FK_Admission_Department;
GO

-- ===================================================================
-- 2. XÓA SẠCH DỮ LIỆU CŨ THEO THỨ TỰ AN TOÀN
-- ===================================================================
DELETE FROM PrescriptionItem;
DELETE FROM Prescription;
DELETE FROM MedicalRecord;
DELETE FROM Admission;
DELETE FROM Appointment;

UPDATE Department SET head_doctor_id = NULL;

DELETE FROM Doctor;
DELETE FROM Department;
DELETE FROM Patient;
DELETE FROM Medication;
GO

-- ===================================================================
-- 3. RESET ĐỂ CỘT TỰ TĂNG (IDENTITY) QUAY VỀ BAN ĐẦU
-- ===================================================================
DBCC CHECKIDENT ('Department', RESEED, 0);
DBCC CHECKIDENT ('Doctor', RESEED, 0);
DBCC CHECKIDENT ('Patient', RESEED, 0);
DBCC CHECKIDENT ('Medication', RESEED, 0);
DBCC CHECKIDENT ('Appointment', RESEED, 0);
DBCC CHECKIDENT ('MedicalRecord', RESEED, 0);
DBCC CHECKIDENT ('Prescription', RESEED, 0);
DBCC CHECKIDENT ('Admission', RESEED, 0);
GO

-- ===================================================================
-- 4. BẬT LẠI CÁC RÀNG BUỘC KHÓA NGOẠI HỆ THỐNG
-- ===================================================================
ALTER TABLE Department CHECK CONSTRAINT FK_Department_HeadDoctor;
ALTER TABLE Doctor CHECK CONSTRAINT FK_Doctor_Department;
ALTER TABLE Appointment CHECK CONSTRAINT FK_Appointment_Doctor;
ALTER TABLE Admission CHECK CONSTRAINT FK_Admission_Doctor;
ALTER TABLE Admission CHECK CONSTRAINT FK_Admission_Department;
GO

-- Thuốc
INSERT INTO Medication (name, unit, price, stock) VALUES
('Paracetamol', 'mg', 500, 2000),
('Amoxicillin', 'mg', 1000, 1200),
('Ibuprofen', 'mg', 800, 1500),
('Metformin', 'mg', 1200, 800),
('Atorvastatin', 'mg', 1500, 600),
('Omeprazole', 'mg', 700, 1000),
('Amlodipine', 'mg', 900, 500),
('Losartan', 'mg', 1100, 400),
('Rotunda (Low Stock)', 'tablets', 3000, 4),
('Tamoxifen (Critical)', 'mg', 25000, 5);
GO

-- Khoa
INSERT INTO Department (name, location, head_doctor_id, is_active) VALUES
(N'Rehabilitation', N'Building C - Floor 1', NULL, 1),
(N'Cardiology', N'Building A - Floor 2', NULL, 1),
(N'Neurology', N'Building B - Floor 3', NULL, 1),
(N'Orthopedics', N'Building F - Floor 1', NULL, 1),
(N'Oncology', N'Building E - Floor 4', NULL, 1);
GO

-- Bác sĩ
INSERT INTO Doctor (full_name, phone, email, specialization, department_id, is_active) VALUES
(N'Phạm Minh Khang', '0908111222', 'khang.pm@hospital.com', N'Physical Rehabilitation', 1, 1),
(N'Hoàng Gia Bảo', '0908333444', 'bao.hg@hospital.com', N'Sports Medicine', 1, 1),
(N'Dr. Emily Carter', '555-1111', 'emily.carter@example.com', 'Cardiologist', 2, 1),
(N'John Smith', '0901234567', 'john.smith@healtrack.com', 'Cardiac Surgeon', 2, 1),
(N'Dr. Michael Thompson', '555-2222', 'michael.thompson@example.com', 'Neurologist', 3, 1),
(N'Dr. Sarah Lee', '555-3333', 'sarah.lee@example.com', 'Pediatric Neurologist', 3, 1),
(N'Hà Triệu Hoan', '0955333444', 'hoan.ht@healtrack.com', N'Orthopedic Surgeon', 4, 1),
(N'Vũ Hoàng Long', '0955777888', 'long.vh@healtrack.com', N'Orthopedic Specialist', 4, 1),
(N'Lưu Tiến Dũng', '0955111222', 'dung.lt@healtrack.com', N'Oncologist', 5, 1),
(N'Nguyễn Xuân Sơn', '0955222333', 'son.nx@healtrack.com', N'Surgical Oncologist', 5, 1);
GO

-- Cập nhật trưởng khoa
UPDATE Department SET head_doctor_id = 1 WHERE id = 1; 
UPDATE Department SET head_doctor_id = 3 WHERE id = 2; 
UPDATE Department SET head_doctor_id = 5 WHERE id = 3; 
UPDATE Department SET head_doctor_id = 7 WHERE id = 4; 
UPDATE Department SET head_doctor_id = 9 WHERE id = 5; 

ALTER TABLE Department CHECK CONSTRAINT CHK_HeadDoctor;
GO

-- Bệnh nhân
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

-- Lịch hẹn
INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id, is_active) VALUES
-- Đã hoàn thành
('2026-07-01 08:30:00', N'Knee injury consultation', 'completed', 1, 1, 1),
('2026-07-02 10:00:00', N'Shoulder pain examination', 'completed', 2, 2, 1),
('2026-07-03 09:00:00', N'Routine heart checkup', 'completed', 3, 3, 1),
('2026-07-04 14:00:00', N'Chronic headache evaluation', 'completed', 4, 5, 1),
('2026-07-05 10:30:00', N'Bone fracture follow-up', 'completed', 7, 7, 1),
('2026-07-06 11:00:00', N'Chemotherapy session 1', 'completed', 8, 9, 1),
-- Sắp tới
('2026-07-15 14:00:00', N'Physical therapy follow-up', 'upcoming', 1, 2, 1),
('2026-07-18 09:30:00', N'Cardiology Echo check', 'upcoming', 5, 3, 1),
('2026-07-20 10:00:00', N'Pediatric Neuro assessment', 'upcoming', 11, 6, 1),
('2026-07-22 15:00:00', N'Spine alignment check', 'upcoming', 9, 8, 1),
('2026-07-25 09:00:00', N'Oncology blood test review', 'upcoming', 8, 9, 1),
('2026-07-28 13:30:00', N'General checkup after discharge', 'upcoming', 3, 1, 1),
-- Hủy
('2026-06-20 11:00:00', N'Severe chest pain crisis', 'cancelled', 5, 3, 1),
('2026-06-25 15:30:00', N'Routine Checkup', 'cancelled', 6, 5, 1),
('2026-07-02 16:00:00', N'Joint stiffness consultation', 'cancelled', 12, 7, 1),
('2026-07-03 10:00:00', N'Post-op vision evaluation', 'cancelled', 10, 8, 1);
GO

-- Bệnh án
INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id, is_active) VALUES
(N'Knee ligament strain', N'Physical therapy recommended', 1, 1, 1),
(N'Rotator cuff inflammation', N'Medication and exercise prescribed', 2, 2, 1),
(N'Hypertension Stage 1', N'Patient needs to monitor blood pressure daily.', 3, 3, 1),
(N'Migraine with aura', N'Prescribed specialist painkillers and dim room rest.', 4, 5, 1),
(N'Femur Fracture (Left side)', N'Keep cast for 6 weeks, no heavy lifting.', 7, 7, 1),
(N'Lung Cancer Stage II', N'Admitted for intensive chemotherapy plan.', 8, 9, 1),
(N'Mild Arrhythmia', N'Avoid caffeine, monitor heart rate using smartwatch.', 5, 3, 1),
(N'Gastritis Acute', N'Take anti-acid medications 30 minutes before meals.', 6, 5, 1);
GO

-- Đơn thuốc
INSERT INTO Prescription (notes, medical_record_id, is_active) VALUES
(N'Take strictly after food.', 1, 1),
(N'Use pain reliever only when necessary.', 2, 1),
(N'Do not skip doses.', 3, 1),
(N'Rest in a quiet room.', 4, 1),
(N'High cost specialist therapy items included.', 6, 1)

INSERT INTO PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed, is_active) VALUES
(1, 3, N'Take 1 tablet every 8 hours.', 10, 30, 1),
(2, 6, N'Take 1 capsule daily in the morning.', 30, 30, 1),
(3, 1, N'Take 1 tablet after meals.', 30, 30, 1),
(4, 5, N'Take 1 pill before bedtime.', 14, 14, 1),
(5, 2, N'Take 2 capsules after lunch and dinner.', 10, 400, 1),
(5, 4, N'Take 1 tablet in the morning.', 10, 200, 1);
GO

-- Nhập viện
INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id, is_active) VALUES
('R201', '2026-07-01', '2026-07-04', 4500000, 1, 1, 1, 1),
('Room F102', '2026-07-01', '2026-07-08', 14500000, 7, 7, 4, 1),
('Room F103', '2026-07-02', '2026-07-07', 9000000, 9, 8, 4, 1),
('101A', '2026-06-01', NULL, NULL, 3, 3, 2, 1),
('Room E401', '2026-07-05', NULL, NULL, 8, 9, 5, 1);
GO