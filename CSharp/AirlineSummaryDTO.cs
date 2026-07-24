namespace Final
{
    public class AirlineSummaryDTO
    {
        public string AirlineName { get; init; }
        public int TotalFlights { get; init; }
        public int TotalBookings { get; init; }
        public int ConfirmedBookings { get; init; }
        public decimal TotalRevenue { get; init; }
    }
}
