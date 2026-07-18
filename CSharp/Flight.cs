namespace Final
{
    public class Flight : SkyEntity
    {
        private int myiFlightId;
        private int myiAirlineId;
        private string mysFlightCode;
        private string mysOrigin;
        private string mysDestination;
        private DateTime myoDepartureTime;
        private int myiDurationMinutes;
        private int myiTotalSeats;
        private decimal mydPricePerSeat;

        public Flight(int flightId, int airlineId, string flightCode, string origin, string destination, DateTime departureTime, int durationMinutes, int totalSeats, decimal pricePerSeat)
        {
            FlightId = flightId;
            AirlineId = airlineId;
            FlightCode = flightCode;
            Origin = origin;
            Destination = destination;
            DepartureTime = departureTime;
            DurationMinutes = durationMinutes;
            TotalSeats = totalSeats;
            PricePerSeat = pricePerSeat;
        }

        public int FlightId
        {
            get => myiFlightId;
            set => myiFlightId = value;
        }
        public int AirlineId
        {
            get => myiAirlineId;
            init => myiAirlineId = value;
        }
        public string FlightCode
        {
            get => mysFlightCode;
            init => mysFlightCode = value;
        }
        public string Origin
        {
            get => mysOrigin;
            set
            {
                if (value.Length != 3 || !value.All(acChar => char.IsLetter(acChar) && char.IsUpper(acChar)))
                {
                    throw new ArgumentException("Invalid origin airport code.");
                }
                else if (value == Destination)
                {
                    throw new ArgumentException("Origin and destination cannot be the same.");
                }
                mysOrigin = value;
            }
        }
        public string Destination
        {
            get => mysDestination;
            set
            {
                if (value.Length != 3 || !value.All(acChar => char.IsLetter(acChar) && char.IsUpper(acChar)))
                {
                    throw new ArgumentException("Invalid destination airport code.");
                }
                else if (value == Origin)
                {
                    throw new ArgumentException("Origin and destination cannot be the same.");
                }
                mysDestination = value;
            }
        }
        public DateTime DepartureTime
        {
            get => myoDepartureTime;
            set
            {
                if (value <= DateTime.Now)
                {
                    throw new ArgumentException("Departure time must be in the future.");
                }
                myoDepartureTime = value;
            }
        }
        public int DurationMinutes
        {
            get => myiDurationMinutes;
            set
            {
                if (value <= 0)
                {
                    throw new ArgumentException("Duration must be greater than zero.");
                }
                myiDurationMinutes = value;
            }
        }
        public int TotalSeats
        {
            get => myiTotalSeats;
            set
            {
                if (value <= 0)
                {
                    throw new ArgumentException("Total seats must be greater than zero.");
                }
                myiTotalSeats = value;
            }
        }
        public decimal PricePerSeat
        {
            get => mydPricePerSeat;
            set
            {
                if (value <= 0)
                {
                    throw new ArgumentException("Price per seat must be greater than zero.");
                }
                mydPricePerSeat = value;
            }
        }
        public override string EntityType => "Flight";

        /// <summary>
        /// Returns a string representation of the flight's information, including flight ID, airline ID, flight code, origin, destination, departure time, duration, total seats, and price per seat.
        /// </summary>
        public override string GetInfo()
        {
            return $"Flight ID: {FlightId}, Airline ID: {AirlineId}, Flight Code: {FlightCode}, Origin: {Origin}, Destination: {Destination}, Departure Time: {DepartureTime}, Duration: {DurationMinutes} minutes, Total Seats: {TotalSeats}, Price Per Seat: {PricePerSeat}";
        }
    }
}
