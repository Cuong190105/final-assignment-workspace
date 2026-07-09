CREATE PROCEDURE BookAppointment
    @AppointmentDateTime DATETIME,
    @Reason NVARCHAR(255),
    @PatientID INT,
    @DoctorID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM Patient
        WHERE id = @PatientID
        AND is_active = 1
    )
    BEGIN
        RAISERROR('Patient does not exist or is inactive.',16,1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 FROM Doctor
        WHERE id = @DoctorID
        AND is_active = 1
    )
    BEGIN
        RAISERROR('Doctor does not exist or is inactive.',16,1);
        RETURN;
    END

    IF @AppointmentDateTime <= GETDATE()
    BEGIN
        RAISERROR('Appointment must be in the future.',16,1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM Appointment
        WHERE doctor_id=@DoctorID
        AND appointment_datetime=@AppointmentDateTime
        AND is_active=1
    )
    BEGIN
        RAISERROR('Doctor already has an appointment at this time.',16,1);
        RETURN;
    END

    INSERT INTO Appointment
    (
        appointment_datetime,
        reason,
        status,
        patient_id,
        doctor_id
    )
    VALUES
    (
        @AppointmentDateTime,
        @Reason,
        'upcoming',
        @PatientID,
        @DoctorID
    );

    PRINT 'Appointment booked successfully.';
END;
GO
CREATE PROCEDURE DischargePatient
    @AdmissionID INT,
    @TotalCost BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM Admission
        WHERE id=@AdmissionID
    )
    BEGIN
        RAISERROR('Admission does not exist.',16,1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM Admission
        WHERE id=@AdmissionID
        AND discharge_date IS NOT NULL
    )
    BEGIN
        RAISERROR('Patient has already been discharged.',16,1);
        RETURN;
    END

    IF @TotalCost <= 0
    BEGIN
        RAISERROR('Total cost must be greater than 0.',16,1);
        RETURN;
    END

    UPDATE Admission
    SET
        discharge_date = GETDATE(),
        cost = @TotalCost
    WHERE id=@AdmissionID;

    PRINT 'Patient discharged successfully.';
END;
GO