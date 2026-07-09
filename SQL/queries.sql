USE HealTrackDB
GO

USE HealTrackDB;
GO

SELECT * FROM Medication;

SELECT * FROM Department;

SELECT * FROM Doctor;

SELECT * FROM Patient;

SELECT * FROM Appointment;

SELECT * FROM MedicalRecord;

SELECT * FROM Prescription;

SELECT * FROM PrescriptionItem;

SELECT * FROM Admission;

-- Q9.cc. Scalar Function — Patient Age
-- Tạo hàm nhận mã định danh bệnh nhân (patient.id) và trả về tuổi hiện tại của bệnh nhân đó theo số năm đầy đủ. 
-- Nếu bệnh nhân không tồn tại, trả về giá trị trọng điểm (ví dụ -1).

CREATE OR ALTER FUNCTION dbo.fn_GetPatientAge (@PatientID INT)
RETURNS INT
AS
BEGIN
	DECLARE @age INT;
	
	-- Kiểm tra tồn tại
	IF NOT EXISTS (SELECT 1 FROM dbo.Patient WHERE id = @PatientID) -- Không tồn tại. Trả về -1
	BEGIN
		SET @age = -1;
	END
	ELSE -- Có tồn tại. Trả về tuổi tính theo năm
	BEGIN
		SELECT @age = DATEDIFF(YEAR, dob, GETDATE())
		FROM dbo.Patient
		WHERE id = @PatientID;

	END

	RETURN @age;
END

SELECT dbo.fn_GetPatientAge(3) AS PatientAge; -- Bệnh nhân có tồn tại
SELECT dbo.fn_GetPatientAge(99) AS PatientAge; -- Bệnh nhân không tồn tại (Trả về -1)

-- Q9.dd. Table-Valued Function — Doctor Schedule
-- Tạo một hàm nhận vào mã định danh bác sĩ (Doctor.id) và phạm vi ngày (từ/đến) (DATETIME)
-- Trả về một bảng chứa tất cả các cuộc hẹn của bác sĩ đó trong phạm vi đã cho. 
-- Mỗi hàng cần hiển thị: ID cuộc hẹn, tên bệnh nhân, ngày/giờ hẹn, lý do và trạng thái.

CREATE OR ALTER FUNCTION dbo.fn_GetDoctorSchedule (
	@DoctorID INT,
	@StartDate DATETIME,
	@EndDate DATETIME
)
RETURNS TABLE
AS
RETURN (
	SELECT AP.id AS AppointmentID, P.full_name AS PatientName, AP.appointment_datetime AS Date, AP.reason AS Reason, AP.status
	FROM dbo.Appointment AP JOIN dbo.Patient P ON P.id = AP.patient_id
	WHERE AP.doctor_id = @DoctorID
		AND AP.appointment_datetime BETWEEN @StartDate AND @EndDate
		AND AP.is_active = 1
);
GO

SELECT * FROM dbo.fn_GetDoctorSchedule(3, '2026-07-01', '2026-07-31');

-- Q10.ee. SP — Book Appointment
-- Tạo một stored procedure nhận ID bệnh nhân (PatientID), ID bác sĩ (DoctorID), ngày/giờ hẹn (App_datetime) và lý do (Reason). 
-- Procedure này phải kiểm tra các điều kiện sau:
-- 1. Cả bệnh nhân và bác sĩ đều tồn tại và không bị vô hiệu hóa/xóa tạm thời.
-- 2. Ngày hẹn phải là ngày trong tương lai.
-- 3. Bác sĩ không có cuộc hẹn nào khác vào cùng ngày và giờ đó.
-- 4. Nếu bất kỳ kiểm tra nào thất bại, hãy báo lỗi với thông báo rõ ràng và mô tả chi tiết. 
-- Khi thành công, hãy thêm cuộc hẹn và trả về ID cuộc hẹn mới.

CREATE OR ALTER PROCEDURE dbo.sp_BookAppointment
	@PatientID INT,
	@DoctorID INT,
	@AppointmentDatetime DATETIME,
	@Reason VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	-- Kiểm tra bệnh nhân tồn tại
	IF NOT EXISTS (SELECT 1 FROM dbo.Patient WHERE id = @PatientID AND is_active = 1)
	BEGIN 
		RAISERROR(N'Lỗi 1: Bệnh nhân không tồn tại hoặc đã bị ngừng hoạt động.', 16, 1);
        RETURN;
	END

	-- Kiểm tra bác sĩ tồn tại
	IF NOT EXISTS (SELECT 1 FROM dbo.Doctor WHERE id = @DoctorID AND is_active = 1)
	BEGIN 
		RAISERROR(N'Lỗi 1: Bác sĩ không tồn tại hoặc đã bị ngừng hoạt động.', 16, 1);
        RETURN;
	END

	-- Kiểm tra ngày hẹn
	IF @AppointmentDatetime <= GETDATE()
	BEGIN
		RAISERROR(N'Lỗi 2: Ngày hẹn phải là ngày tương lai.', 16, 1);
        RETURN;
	END

	-- Kiểm tra lịch hẹn của bác sĩ
	IF EXISTS (SELECT 1 FROM dbo.Appointment 
				WHERE doctor_id = @DoctorID 
					AND appointment_datetime = @AppointmentDatetime
					AND status <> 'cancelled'
					AND is_active = 1
				)
	BEGIN 
		RAISERROR(N'Lỗi 3: Bác sĩ đã có hẹn trong khoảng thời gian này', 16, 1);
        RETURN;
	END

	INSERT INTO Appointment (appointment_datetime, reason, status, patient_id, doctor_id, is_active)
	VALUES (@AppointmentDatetime, @Reason, 'upcoming', @PatientID, @DoctorID, 1)

	SELECT SCOPE_IDENTITY() AS NewAppointmentID
END;
GO

EXEC dbo.sp_BookAppointment @PatientID = 1, @DoctorID = 1, @AppointmentDateTime = '2026-08-15 09:00:00', @Reason = N'Khám lại khớp gối';

-- Q10.ff. SP - Discharge Patient
-- Tạo một SP để đánh dấu một ca nhập viện là đã xuất viện, nhận mã số nhập viện (AdmissionID) và tổng chi phí (TotalCost), sau đó:
-- 1. Kiểm tra xem hồ sơ nhập viện có tồn tại hay không.
-- 2. Kiểm tra xem bệnh nhân đã xuất viện hay chưa.
-- 3. Kiểm tra xem tổng chi phí có phải là giá trị dương hay không.
-- Nếu thành công, đặt ngày xuất viện thành ngày/giờ hiện tại và ghi lại tổng chi phí.

CREATE OR ALTER PROCEDURE dbo.sp_DischargePatient
	@AdmissionID INT,
	@TotalCost BIGINT
AS
BEGIN
	SET NOCOUNT ON;

	-- Kiểm tra hồ sơ
	IF NOT EXISTS (SELECT 1 FROM dbo.Admission WHERE id = @AdmissionID)
	BEGIN
		RAISERROR (N'Lỗi: Hồ sơ nhập viện không tồn tại', 16, 1);
		RETURN;
	END

	-- Kiểm tra xuất viện
	IF EXISTS (SELECT 1 FROM dbo.Admission WHERE id = @AdmissionID AND discharge_date IS NOT NULL)
	BEGIN
		RAISERROR (N'Lỗi: Bệnh nhân trong hồ sơ đã xuất viện', 16, 1);
		RETURN;
	END

	IF @TotalCost < 0
	BEGIN 
		RAISERROR (N'Lỗi: Tổng chi phí phải là số dương (lớn hơn 0)', 16, 1);
		RETURN;
	END

	-- Cập nhật lại hồ sơ
	UPDATE Admission
	SET discharge_date = CAST(GETDATE() AS DATE),
		cost = @TotalCost
	WHERE id = @AdmissionID;

	SELECT * FROM dbo.Admission WHERE id = @AdmissionID;
END;
GO

EXEC dbo.sp_DischargePatient @AdmissionID = 4, @TotalCost = 6200000;