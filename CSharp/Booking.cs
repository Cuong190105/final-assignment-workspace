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
        public decimal BookingFee => myoFlight.PricePerSeat * BookingFeePercentage;
        public override string EntityType => "Booking";
        public override string GetInfo()
        {
            return $"Booking ID: {BookingId}, Flight ID: {FlightId}, Passenger Name: {PassengerName}, Passport Number: {PassportNumber}, Seat Number: {SeatNumber}, Status: {Status}, Booking Fee: {BookingFee}";
        }
    }
}
