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
-- ==== Cuong
-- Q11
-- PREPARE PROCEDURE
CREATE OR ALTER PROCEDURE InsertMedicalRecordWithPrescription
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO MedicalRecord (diagnosis, note, patient_id, doctor_id) VALUES
        ('Hypertension', 'Patient shows elevated blood pressure.', 1, 1);
        DECLARE @record_id INT;
        SELECT TOP 1 @record_id = id FROM MedicalRecord ORDER BY id DESC;
        -- Hoac dung: DECLARE @record_id INT = SCOPE_IDENTITY();

        INSERT INTO Prescription (notes, medical_record_id) VALUES
        ('Take medication as prescribed.', @record_id);
        DECLARE @prescription_id INT;
        SELECT TOP 1 @prescription_id = id FROM Prescription ORDER BY id DESC;

        INSERT INTO PrescriptionItem (prescription_id, medication_id, dosage_instruction, duration_days, quantity_dispensed) VALUES
        (@prescription_id, 1, 'Take one tablet daily after meals.', 30, 30),
        (@prescription_id, 2, 'Take two capsules daily before bedtime.', 15, 30);

        UPDATE Medication SET stock = stock - 30 WHERE id = 1;
        UPDATE Medication SET stock = stock - 30 WHERE id = 2;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW 50001, 'Stock levels are insufficient.', 1;
    END CATCH;
END;

-- SETUP SUCCESS RUN
UPDATE Medication SET stock = 1000 WHERE id IN (1, 2);
EXEC InsertMedicalRecordWithPrescription;

-- SETUP FAILURE RUN
UPDATE Medication SET stock = 20 WHERE id = 2;
EXEC InsertMedicalRecordWithPrescription;
