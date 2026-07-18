using System;
using System.Collections.Generic;
using System.Text;

namespace Final
{
    /// <summary>
    /// Result of the busiest-day-of-week query (Q6.v).
    /// </summary>
    public class BusiestDayResult
    {
        public string DayName { get; set; }
        public int DepartureCount { get; set; }
    }

    /// <summary>
    /// Result of the average load factor per airline query (Q6.w).
    /// </summary>
    public class AirlineLoadFactorResult
    {
        public string AirlineName { get; set; }
        public decimal AvgLoadFactor { get; set; }
    }

    /// <summary>
    /// Result of the route statistics query (Q6.x).
    /// </summary>
    public class RouteStatisticsResult
    {
        public string Route { get; set; }
        public int FlightCount { get; set; }
        public decimal CheapestPrice { get; set; }
        public decimal MostExpensivePrice { get; set; }
        public decimal AveragePrice { get; set; }
    }

    /// <summary>
    /// Result of the fully-cancelled-passengers query (Q6.y).
    /// </summary>
    public class CancelledPassengerResult
    {
        public string PassengerName { get; set; }
        public string PassportNumber { get; set; }
        public int CancelledCount { get; set; }
    }
}