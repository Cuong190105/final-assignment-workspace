-- linh

USE HealTrackDB;
GO

-- Q6
-- v
SELECT 
    d.full_name AS doctor_name,
    dep.name AS department_name,
    COUNT(a.id) AS completed_appointments
FROM Doctor d
JOIN Department dep ON d.department_id = dep.id
LEFT JOIN Appointment a 
    ON a.doctor_id = d.id 
    AND a.status = 'completed'
GROUP BY d.id, d.full_name, dep.name
ORDER BY completed_appointments DESC;

-- w
SELECT TOP 3
    dep.name AS department_name,
    COUNT(ad.id) AS total_admissions
FROM Department dep
JOIN Admission ad ON ad.department_id = dep.id
GROUP BY dep.id, dep.name
HAVING COUNT(ad.id) >= 2
ORDER BY total_admissions DESC;

-- x
SELECT 
    dep.name AS department_name,
    ROUND(AVG(DATEDIFF(DAY, ad.admission_date, ad.discharge_date) * 1.0), 1) AS avg_stay_days
FROM Department dep
JOIN Admission ad ON ad.department_id = dep.id
WHERE ad.discharge_date IS NOT NULL
GROUP BY dep.id, dep.name
HAVING AVG(DATEDIFF(DAY, ad.admission_date, ad.discharge_date)) > 2;

-- Q7 z
SELECT 
    t.patient_name,
    t.total_cost
FROM (
    SELECT 
        p.id,
        p.full_name AS patient_name,
        SUM(pi.quantity_dispensed * m.price) AS total_cost
    FROM Patient p
    JOIN MedicalRecord mr ON mr.patient_id = p.id
    JOIN Prescription pr ON pr.medical_record_id = mr.id
    JOIN PrescriptionItem pi ON pi.prescription_id = pr.id
    JOIN Medication m ON m.id = pi.medication_id
    GROUP BY p.id, p.full_name
) t
WHERE t.total_cost > 500000
ORDER BY t.total_cost DESC;