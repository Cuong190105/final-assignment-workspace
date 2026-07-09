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