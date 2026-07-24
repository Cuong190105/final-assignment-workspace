namespace Final
{
    public class FlightWithAirlineNameDTO
    {
        public string AirlineName { get; init; }
        public string FlightCode { get; init; }
        public string Origin { get; init; }
        public string Destination { get; init; }
        public decimal PricePerSeat { get; init; }
        public int AvailableSeats { get; init; }
    }
}
