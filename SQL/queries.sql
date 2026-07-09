-- Bui Dang Thinh
-- Q4
-- p) List all patients born before 01/01/1990. Return their personal details and contact information. Order by date of birth, oldest first.

SELECT id, full_name, dob, gender, phone, address, email
    FROM Patient
    WHERE dob < '1990-01-01'
        AND is_active = 1
    ORDER BY dob ASC;

-- q) List all appointments with a &quot;scheduled/upcoming&quot; status that fall within the next 30 days from today. Show which patient and which doctor each appointment belongs to.

SELECT
    a.id AS appointment_id,
    a.appointment_datetime,
    a.reason,
    a.status,
    p.id AS patient_id,
    p.full_name AS patient_name,
    d.id AS doctor_id,
    d.full_name AS doctor_name
FROM Appointment a
JOIN Patient p ON a.patient_id = p.id
JOIN Doctor d ON a.doctor_id = d.id
WHERE a.status = 'upcoming'
    AND a.appointment_datetime >= CAST(GETDATE() AS DATETIME)
    AND a.appointment_datetime < DATEADD(DAY, 30, CAST(GETDATE() AS DATETIME))
    AND a.is_active = 1
ORDER BY a.appointment_datetime ASC;

-- r) Show all medications where current stock is below 10 units. Order by stock level ascending.

SELECT id, name, unit, price, stock
    FROM Medication
    WHERE stock <10
        AND is_active = 1
    ORDER BY stock ASC;


-- Q7
-- y) Find all doctors who have never had any appointment assigned to them. Return their names,specialisations, and departments.

SELECT
    d.id,
    d.full_name,
    d.specialization,
    dep.name AS department_name
FROM Doctor d
JOIN Department dep ON d.department_id = dep.id
WHERE d.is_active = 1
    AND NOT EXISTS (
        SELECT 1
        FROM Appointment a
        WHERE a.doctor_id = d.id
    )
ORDER BY d.full_name;
