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
VALUES (N'Khoa Thần Kinh', N'Tầng 4 - Tòa nhà B');

INSERT INTO Doctor (full_name, phone, email, specialization, department_id)
VALUES
(N'Đỗ Nhật Minh', '0912444555', 'minh.dn@hospital.com', N'Phẫu thuật não', 5), -- ID 5 giả định
(N'Vũ Thị Lan Anh', '0912666777', 'lananh.vt@hospital.com', N'Điều trị rối loạn giấc ngủ', 5);

UPDATE Department 
SET head_doctor_id = (SELECT id FROM Doctor WHERE full_name = N'Đỗ Nhật Minh')
WHERE name = N'Khoa Thần Kinh';

INSERT INTO Patient (full_name, dob, gender, phone, address, email)
VALUES
(N'Lương Thế Vinh', '1975-09-09', 'M', '0988111222', N'Bắc Giang', 'vinh.luong@gmail.com'),
(N'Mai Thu Huyền', '1989-11-20', 'F', '0988333444', N'Ninh Bình', 'huyen.mai@outlook.com');

INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id)
VALUES
('2026-08-05 08:00:00', N'Đau nửa đầu kéo dài', 'upcoming', 5, 5), -- ID bệnh nhân/bác sĩ thay đổi tương ứng
('2026-08-06 09:30:00', N'Kiểm tra sau chấn động não', 'completed', 6, 6),
('2026-08-07 14:00:00', N'Tư vấn mất ngủ mãn tính', 'scheduled', 5, 6);

INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id)
VALUES
(N'Thiếu máu não cục bộ', N'Yêu cầu chụp cộng hưởng từ (MRI)', 5, 5),
(N'Hội chứng căng thẳng thần kinh', N'Cần nghỉ ngơi và tập thiền', 6, 6),
(N'Chấn thương vùng đầu', N'Theo dõi phản xạ đồng tử', 5, 6);

INSERT INTO Admission (room, admission_date, discharge_date, cost, patient_id, doctor_id, department_id)
VALUES
('B401', '2026-08-05', '2026-08-10', 8500000, 5, 5, 5),
('B408', '2026-08-06', NULL, NULL, 6, 6, 5);