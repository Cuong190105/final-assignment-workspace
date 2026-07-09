
-- s) Danh sách các cuộc hẹn đã hoàn thành
SELECT 
    p.full_name AS PatientName, 
    d.full_name AS DoctorName, 
    d.specialization, 
    a.appointment_datetime AS AppointmentDate, 
    a.reason
FROM dbo.Appointment a
JOIN dbo.Patient p ON a.patient_id = p.id
JOIN dbo.Doctor d ON a.doctor_id = d.id
WHERE a.status = 'completed'
ORDER BY a.appointment_datetime DESC;

-- t) Danh sách bệnh nhân đã nhập viện (bao gồm cả trường hợp chưa xuất viện)
SELECT 
    p.full_name AS PatientName, 
    dept.name AS DepartmentName, 
    d.full_name AS DoctorName, 
    adm.admission_date, 
    adm.discharge_date
FROM dbo.Admission adm
JOIN dbo.Patient p ON adm.patient_id = p.id
JOIN dbo.Doctor d ON adm.doctor_id = d.id
JOIN dbo.Department dept ON adm.department_id = dept.id
ORDER BY adm.admission_date DESC;

-- u) Chi tiết hồ sơ bệnh án và đơn thuốc (một hàng cho mỗi loại thuốc trong đơn)
SELECT 
    p.full_name AS PatientName, 
    d.full_name AS DoctorName, 
    mr.created_at AS RecordDate, 
    mr.diagnosis, 
    m.name AS MedicationName, 
    pi.dosage_instruction
FROM dbo.MedicalRecord mr
JOIN dbo.Patient p ON mr.patient_id = p.id
JOIN dbo.Doctor d ON mr.doctor_id = d.id
JOIN dbo.Prescription pres ON mr.id = pres.medical_record_id
JOIN dbo.PrescriptionItem pi ON pres.id = pi.prescription_id
JOIN dbo.Medication m ON pi.medication_id = m.id;
