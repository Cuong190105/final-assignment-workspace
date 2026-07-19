namespace Final
{
    public class FlightScheduleDTO
    {
        public string FlightCode { get; init; }
        public DateTime DepartureTime { get; init; }
        public int DurationMinutes { get; init; }
        public decimal PricePerSeat { get; init; }
        public int AvailableSeats { get; init; }
    }
}