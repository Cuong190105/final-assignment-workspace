namespace Final
{
    public class Booking : SkyEntity
    {
        private int myiBookingId;
        private int myiFlightId;
        private string mysPassengerName;
        private string mysPassportNumber;
        private string mysSeatNumber;
        private BookingStatus myoStatus;
        private BookingStatus? myoPreviousStatus;
        private decimal mydBookingFee;
        private Flight myoFlight;
        private static readonly decimal BookingFeePercentage = 0.05m;

        public Booking(int bookingId, int flightId, string passengerName, string passportNumber, string seatNumber, BookingStatus status, Flight flight)
        {
            BookingId = bookingId;
            FlightId = flightId;
            PassengerName = passengerName;
            PassportNumber = passportNumber;
            SeatNumber = seatNumber;
            Status = status;
            myoFlight = flight;
        }

        public int BookingId
        {
            get => myiBookingId;
            set => myiBookingId = value;
        }
        public int FlightId
        {
            get => myiFlightId;
            init => myiFlightId = value;
        }
        public string PassengerName
        {
            get => mysPassengerName;
            set {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentException("Passenger name cannot be empty.");
                }
                mysPassengerName = value;
            }
        }
        public string PassportNumber
        {
            get => mysPassportNumber;
            set => mysPassportNumber = value;
        }
        public string SeatNumber
        {
            get => mysSeatNumber;
            set => mysSeatNumber = value;
        }
        public BookingStatus Status
        {
            get => myoStatus;
            set => myoStatus = value;
        }

        /// <summary>
        /// Trạng thái trước đó của booking (phục vụ tính năng Undo).
        /// </summary>
        public BookingStatus? PreviousStatus
        {
            get => myoPreviousStatus;
            set => myoPreviousStatus = value;
        }

        public decimal BookingFee => myoFlight.PricePerSeat * BookingFeePercentage;
        public override string EntityType => "Booking";

        /// <summary>
        /// Tạo bản sao sâu (deep copy) của đối tượng Booking.
        /// </summary>
        /// <returns>Bản sao mới của Booking.</returns>
        public Booking Clone()
        {
            return new Booking(BookingId, FlightId, PassengerName, PassportNumber, SeatNumber, Status, myoFlight)
            {
                PreviousStatus = this.PreviousStatus
            };
        }

        /// <summary>
        /// Returns a string representation of the booking information.
        /// </summary>
        public override string GetInfo()
        {
            return $"Booking ID: {BookingId}, Flight ID: {FlightId}, Passenger Name: {PassengerName}, Passport Number: {PassportNumber}, Seat Number: {SeatNumber}, Status: {Status}, Booking Fee: {BookingFee}";
        }

        /// <summary>
        /// Returns a summary of the booking information, including passenger name and flight ID.
        /// </summary>
        public override string GetSummary()
        {
            return $"Booking for {PassengerName} on flight {FlightId}";
        }
    }
}
