using System.Text;

namespace Final
{
    public class SkyLinkManager
    {
        private List<Airline> myoAirlines;
        private List<Flight> myoFlights;
        private List<Booking> myoBookings;

        private static SkyLinkManager? myoInstance;
        private SkyLinkManager()
        {
            myoAirlines = new List<Airline>();
            myoFlights = new List<Flight>();
            myoBookings = new List<Booking>();
        }

        public static SkyLinkManager Instance
        {
            get
            {
                if (myoInstance == null)
                {
                    myoInstance = new SkyLinkManager();
                }
                return myoInstance;
            }
        }

        public Airline AddAirline(string thesAirlineName, string thesIATACode, string thesCountry, int theiFoundedYear)
        {
            if (myoAirlines.Where(aoAirline => aoAirline.AirlineName == thesAirlineName || aoAirline.IATACode == thesIATACode).Any())
            {
                throw new InvalidOperationException("Airline Name or IATA Code already exists");
            }
            int aiAirlineId = myoAirlines.Count + 1;
            var aoNewAirline = new Airline(aiAirlineId, thesAirlineName, thesIATACode, thesCountry, theiFoundedYear);
            myoAirlines.Add(aoNewAirline);
            return aoNewAirline;
        }
        public Flight AddFlight(int theiAirlineId, string thesOrigin, string thesDestination, DateTime theoDepartureTime, int theiDurationMinutes, int theiTotalSeats, decimal thedPricePerSeat)
        {
            var aoAirline = myoAirlines.Where(aoAirline => aoAirline.AirlineId == theiAirlineId);
            if (!aoAirline.Any())
            {
                throw new InvalidOperationException($"Airline with ID {theiAirlineId} does not exist");
            }
            int aiFlightId = myoFlights.Count + 1;
            string asFlightCode = GenerateFlightCode(aoAirline.First().IATACode, thesOrigin, aiFlightId);
            var aoNewFlight = new Flight(aiFlightId, theiAirlineId, asFlightCode, thesOrigin, thesDestination, theoDepartureTime, theiDurationMinutes, theiTotalSeats, thedPricePerSeat);
            myoFlights.Add(aoNewFlight);
            return aoNewFlight;
        }
        public Booking AddBooking(int theiFlightId, string thesPassengerName, string thesPassportNumber, string thesSeatNumber, BookingStatus status)
        {
            var aoFlightQuery = myoFlights.Where(aoFlight => aoFlight.FlightId == theiFlightId);
            if (!aoFlightQuery.Any())
            {
                throw new InvalidOperationException($"Flight {theiFlightId} does not exist");
            }
            var aoFlight = aoFlightQuery.First();
            if (myoBookings.Where(aoBooking => aoBooking.PassportNumber == thesPassportNumber).Any())
            {
                throw new InvalidOperationException("Passenger already has a booking");
            }
            if (myoBookings.Where(aoBooking => aoBooking.FlightId == theiFlightId && aoBooking.SeatNumber == thesSeatNumber).Any())
            {
                throw new InvalidOperationException($"Seat {thesSeatNumber} on flight {theiFlightId} is already booked");
            }
            if (myoBookings.Count(aoBooking => aoBooking.FlightId == theiFlightId && aoBooking.Status != BookingStatus.Cancelled) >= aoFlight.TotalSeats)
            {
                throw new InvalidOperationException($"Flight {theiFlightId} is full");
            }
            int aiBookingId = myoBookings.Count + 1;
            var aoNewBooking = new Booking(aiBookingId, theiFlightId, thesPassengerName, thesPassportNumber, thesSeatNumber, status, aoFlight);
            myoBookings.Add(aoNewBooking);
            return aoNewBooking;
        }
        public string GenerateFlightCode(string thesIATACode, string thesOrigin, int theiFlightId)
        {
            var aoFlightsWithSamePrefix = myoFlights.Where(aoFlight => aoFlight.FlightCode.StartsWith(thesIATACode + thesOrigin + theiFlightId.ToString())).ToList();
            if (aoFlightsWithSamePrefix.Count == 0)
            {
                return thesIATACode + thesOrigin + theiFlightId.ToString().PadLeft(3, '0');
            }
            else
            {
                return thesIATACode + thesOrigin + theiFlightId.ToString().PadLeft(3, '0') + aoFlightsWithSamePrefix.Count.ToString();
            }
        }

        /// =======================Q6==============================

        /// <summary>
        /// Q6.v - Finds the day of the week with the highest number of flight departures.
        /// Returns null if there are no flights at all.
        /// </summary>
        public BusiestDayResult? GetBusiestDayOfWeek()
        {
            var aoBusiestDay = myoFlights
                .GroupBy(aoFlight => aoFlight.DepartureTime.DayOfWeek)
                .Select(aoGroup => new BusiestDayResult
                {
                    DayName = aoGroup.Key.ToString(),
                    DepartureCount = aoGroup.Count()
                })
                .OrderByDescending(aoResult => aoResult.DepartureCount)
                .FirstOrDefault();

            return aoBusiestDay;
        }

        /// <summary>
        /// Q6.w - Calculates the average load factor (ConfirmedBookings / TotalSeats x 100)
        /// per airline, averaged across all of that airline's flights. Airlines with zero
        /// flights are excluded. Result is rounded to 2 decimal places.
        /// </summary>
        public List<AirlineLoadFactorResult> GetAverageLoadFactorPerAirline()
        {
            var aoResults = myoAirlines
                .Select(aoAirline => new
                {
                    aoAirline.AirlineName,
                    aoAirlineFlights = myoFlights.Where(aoFlight => aoFlight.AirlineId == aoAirline.AirlineId).ToList()
                })
                .Where(aoItem => aoItem.aoAirlineFlights.Count > 0)
                .Select(aoItem => new AirlineLoadFactorResult
                {
                    AirlineName = aoItem.AirlineName,
                    AvgLoadFactor = Math.Round(
                        aoItem.aoAirlineFlights.Average(aoFlight =>
                            (decimal)myoBookings.Count(aoBooking =>
                                aoBooking.FlightId == aoFlight.FlightId
                                && aoBooking.Status == BookingStatus.Confirmed)
                            / aoFlight.TotalSeats * 100m),
                        2)
                })
                .ToList();

            return aoResults;
        }

        /// <summary>
        /// Q6.x - Groups flights by route (Origin + Destination pair) and computes
        /// flight count, cheapest, most expensive and average price per route.
        /// Sorted by flight count descending.
        /// </summary>
        public List<RouteStatisticsResult> GetRouteStatistics()
        {
            var aoResults = myoFlights
                .GroupBy(aoFlight => new { aoFlight.Origin, aoFlight.Destination })
                .Select(aoGroup => new RouteStatisticsResult
                {
                    Route = $"{aoGroup.Key.Origin} -> {aoGroup.Key.Destination}",
                    FlightCount = aoGroup.Count(),
                    CheapestPrice = aoGroup.Min(aoFlight => aoFlight.PricePerSeat),
                    MostExpensivePrice = aoGroup.Max(aoFlight => aoFlight.PricePerSeat),
                    AveragePrice = aoGroup.Average(aoFlight => aoFlight.PricePerSeat)
                })
                .OrderByDescending(aoResult => aoResult.FlightCount)
                .ToList();

            return aoResults;
        }

        /// <summary>
        /// Q6.y - Finds passengers (grouped by PassportNumber) whose bookings are
        /// ALL Cancelled (i.e. they have zero non-cancelled bookings).
        /// </summary>
        public List<CancelledPassengerResult> GetFullyCancelledPassengers()
        {
            var aoResults = myoBookings
                .GroupBy(aoBooking => aoBooking.PassportNumber)
                .Where(aoGroup => aoGroup.All(aoBooking => aoBooking.Status == BookingStatus.Cancelled))
                .Select(aoGroup => new CancelledPassengerResult
                {
                    PassengerName = aoGroup.First().PassengerName,
                    PassportNumber = aoGroup.Key,
                    CancelledCount = aoGroup.Count()
                })
                .ToList();

            return aoResults;
        }
    }



}
