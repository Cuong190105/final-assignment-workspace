namespace Final
{
    public class BusinessFlight : Flight
    {
        public BusinessFlight(int flightId, int airlineId, string flightCode, string origin, string destination, DateTime departureTime, int durationMinutes, int totalSeats, decimal pricePerSeat, bool loungeAccess, bool mealIncluded, decimal premiumSurcharge) : base(flightId, airlineId, flightCode, origin, destination, departureTime, durationMinutes, totalSeats, pricePerSeat)
        {
            LoungeAccess = loungeAccess;
            MealIncluded = mealIncluded;
            PremiumSurcharge = premiumSurcharge;
        }

        public bool LoungeAccess { get; set; }
        public bool MealIncluded { get; set; }
        public decimal PremiumSurcharge { get; set; }

        /// <summary>
        /// Returns a string representation of the business flight's information, including lounge access, meal inclusion, and premium surcharge.
        /// </summary>
        public override string GetInfo()
        {
            return $"{base.GetInfo()}, Lounge Access: {LoungeAccess}, Meal Included: {MealIncluded}, Premium Surcharge: {PremiumSurcharge}";
        }
        /// <summary>
        /// Returns a summary of the Business Flight.
        /// </summary>
        public override string GetSummary()
        {
            return $"Business Flight - {FlightCode} ({Origin} -> {Destination})";
        }
    }
}
