--Vu Duc Thai--
CREATE VIEW ActivePatients
AS
SELECT
    id,
    full_name,
    dob,
    gender,
    phone,
    address,
    email
FROM Patient
WHERE is_active = 1;
GO
CREATE VIEW DoctorWorkload
AS
SELECT
    d.id,
    d.full_name,
    d.specialization,
    COUNT(a.id) AS TotalAppointments
FROM Doctor d
LEFT JOIN Appointment a
ON d.id = a.doctor_id
AND a.is_active = 1
GROUP BY
    d.id,
    d.full_name,
    d.specialization;
GO