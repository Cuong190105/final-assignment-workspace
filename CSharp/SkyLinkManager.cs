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

        /// <summary>
        /// Gets the singleton instance of the SkyLinkManager class.
        /// </summary>
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

        /// <summary>
        /// Adds a new airline to the system. Throws an InvalidOperationException if the airline name or IATA code already exists.
        /// </summary>
        /// <param name="thesAirlineName">The name of the airline to add.</param>
        /// <param name="thesIATACode">The IATA code of the airline to add.</param>
        /// <param name="thesCountry">The country of the airline to add.</param>
        /// <param name="theiFoundedYear">The year the airline was founded.</param>
        /// <returns>The newly created <see cref="Airline"/></returns>
        /// <exception cref="InvalidOperationException"></exception>
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

        /// <summary>
        /// Adds a new flight to the system. Throws an InvalidOperationException if the airline does not exist.
        /// </summary>
        /// <param name="theiAirlineId">The ID of the airline to which the flight belongs.</param>
        /// <param name="thesOrigin">The origin airport of the flight.</param>
        /// <param name="thesDestination">The destination airport of the flight.</param>
        /// <param name="theoDepartureTime">The departure time of the flight.</param>
        /// <param name="theiDurationMinutes">The duration of the flight in minutes.</param>
        /// <param name="theiTotalSeats">The total number of seats on the flight.</param>
        /// <param name="thedPricePerSeat">The price per seat on the flight.</param>
        /// <returns>The newly created <see cref="Flight"/></returns>
        /// <exception cref="InvalidOperationException"></exception>
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

        /// <summary>
        /// Adds a new booking to the system. Throws an InvalidOperationException if the flight does not exist, if the passenger already has a booking, if the seat is already booked, or if the flight is full.
        /// </summary>
        /// <param name="theiFlightId">The ID of the flight for which to create a booking.</param>
        /// <param name="thesPassengerName">The name of the passenger.</param>
        /// <param name="thesPassportNumber">The passport number of the passenger.</param>
        /// <param name="thesSeatNumber">The seat number to book.</param>
        /// <param name="status">The status of the booking.</param>
        /// <returns>The newly created <see cref="Booking"/></returns>
        /// <exception cref="InvalidOperationException"></exception>
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
            if (myoBookings.Count(aoBooking => aoBooking.FlightId == theiFlightId && aoBooking.Status == BookingStatus.Confirmed) >= aoFlight.TotalSeats)
            {
                throw new InvalidOperationException($"Flight {theiFlightId} is full");
            }
            int aiBookingId = myoBookings.Count + 1;
            var aoNewBooking = new Booking(aiBookingId, theiFlightId, thesPassengerName, thesPassportNumber, thesSeatNumber, status, aoFlight);
            myoBookings.Add(aoNewBooking);
            return aoNewBooking;
        }

        /// <summary>
        /// Generates a unique flight code based on the airline's IATA code, the origin airport, and the flight ID. If there are existing flights with the same prefix, a count is appended to ensure uniqueness.
        /// </summary>
        /// <param name="thesIATACode">The IATA code of the airline.</param>
        /// <param name="thesOrigin">The origin city.</param>
        /// <param name="theiFlightId">The ID of the flight.</param>
        /// <returns>The unique flight code.</returns>
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

        /// <summary>
        /// Gets a list of confirmed bookings for a specific flight, ordered by seat number.
        /// </summary>
        /// <param name="theiFlightId">The ID of the flight.</param>
        /// <returns>A list of confirmed bookings for the specified flight.</returns>
        public List<Booking> GetConfirmedBookingsForFlight(int theiFlightId)
        {
            return myoBookings
                .Where(aoBooking => aoBooking.FlightId == theiFlightId && aoBooking.Status == BookingStatus.Confirmed)
                .OrderBy(aoBooking => aoBooking.SeatNumber)
                .ToList();
        }

        /// <summary>
        /// Gets the top 5 most expensive flights that have available seats, along with their airline names and other relevant details.
        /// </summary>
        /// <returns>A list of the top 5 most expensive flights with available seats.</returns>
        public List<FlightWithAirlineNameDTO> GetTop5MostExpensiveFlightsWithAvailableSeats()
        {
            return myoFlights
                .GroupJoin(
                    myoBookings.Where(aoBooking => aoBooking.Status == BookingStatus.Confirmed),
                    aoFlight => aoFlight.FlightId,
                    aoBooking => aoBooking.FlightId,
                    (aoFlight, aoBookingGroup) => new { Flight = aoFlight, BookingCount = aoBookingGroup.Count() }
                )
                .Where(aoObj => aoObj.BookingCount < aoObj.Flight.TotalSeats)
                .OrderByDescending(aoObj => aoObj.Flight.PricePerSeat)
                .Take(5)
                .Join(
                    myoAirlines,
                    aoObj => aoObj.Flight.AirlineId,
                    aoAirline => aoAirline.AirlineId,
                    (aoObj, aoAirline) => new FlightWithAirlineNameDTO
                    {
                        AirlineName = aoAirline.AirlineName,
                        FlightCode = aoObj.Flight.FlightCode,
                        Origin = aoObj.Flight.Origin,
                        Destination = aoObj.Flight.Destination,
                        PricePerSeat = aoObj.Flight.PricePerSeat,
                        AvailableSeats = aoObj.Flight.TotalSeats - aoObj.BookingCount
                    }
                )
                .ToList();
        }

        /// <summary>
        /// Calculates and returns a summary of all airlines, including total flights, total bookings, confirmed bookings, and total revenue, ordered by total revenue in descending order.
        /// </summary>
        /// <returns>A list of airline summaries.</returns>
        public List<AirlineSummaryDTO> GetAirlinesSummary()
        {
            var aoFlights = myoFlights
                .GroupJoin(
                    myoBookings,
                    aoFlight => aoFlight.FlightId,
                    aoBooking => aoBooking.FlightId,
                    (aoFlight, aoBookingGroup) => new
                    {
                        Flight = aoFlight,
                        BookingCount = aoBookingGroup.Count(),
                        ConfirmedBookingCount = aoBookingGroup.Count(aoBooking => aoBooking.Status == BookingStatus.Confirmed),
                        Revenue = aoBookingGroup.Sum(aoBooking => aoBooking.Status == BookingStatus.Confirmed ? aoBooking.BookingFee : 0)
                    }
                );
            var aoAirlines = myoAirlines
                .GroupJoin(
                    aoFlights,
                    aoAirline => aoAirline.AirlineId,
                    aoFlightGroup => aoFlightGroup.Flight.AirlineId,
                    (aoAirline, aoFlightGroup) => new AirlineSummaryDTO
                    {
                        AirlineName = aoAirline.AirlineName,
                        TotalFlights = aoFlightGroup.Count(),
                        TotalBookings = aoFlightGroup.Sum(aoFlight => aoFlight.BookingCount),
                        ConfirmedBookings = aoFlightGroup.Sum(aoFlight => aoFlight.ConfirmedBookingCount),
                        TotalRevenue = aoFlightGroup.Sum(aoFlight => aoFlight.Revenue)
                    }
                )
                .OrderByDescending(aoSummary => aoSummary.TotalRevenue);
            return aoAirlines.ToList();
        }

        /// <summary>
        /// Gets a list of passengers who have made more than one confirmed booking, along with their names, passport numbers, and the count of their confirmed bookings.
        /// </summary>
        /// <returns>A list of passengers with multiple confirmed bookings.</returns>
        public List<PassengerDTO> GetPassengersBookingMoreThanOnce()
        {
            var aoBookings = myoBookings
                .Where(aoBooking => aoBooking.Status == BookingStatus.Confirmed)
                .GroupBy(aoBooking => aoBooking.PassportNumber)
                .Where(aoGroup => aoGroup.Count() > 1)
                .Select(aoGroup => aoGroup.First());
            return aoBookings.Select(aoBooking => new PassengerDTO
            {
                PassengerName = aoBooking.PassengerName,
                PassportNumber = aoBooking.PassportNumber,
                FlightCount = myoBookings.Count(ao => ao.PassportNumber == aoBooking.PassportNumber && ao.Status == BookingStatus.Confirmed)
            }).ToList();
        }

        /// <summary>
        /// Gets a list of flight schedules for flights between the specified origin and destination, including flight code, departure time, duration, price per seat, and available seats, ordered by departure time.
        /// </summary>
        /// <param name="thesOrigin">The origin city.</param>
        /// <param name="thesDestination">The destination city.</param>
        /// <returns>A list of flight schedules.</returns>
        public List<FlightScheduleDTO> GetFlightScheduleWithRoute(string thesOrigin, string thesDestination)
        {
            return myoFlights
                .Where(aoFlight => aoFlight.Origin == thesOrigin && aoFlight.Destination == thesDestination)
                .GroupJoin(
                    myoBookings,
                    aoFlight => aoFlight.FlightId,
                    aoBooking => aoBooking.FlightId,
                    (aoFlight, aoBookingGroup) => new FlightScheduleDTO
                    {
                        FlightCode = aoFlight.FlightCode,
                        DepartureTime = aoFlight.DepartureTime,
                        DurationMinutes = aoFlight.DurationMinutes,
                        PricePerSeat = aoFlight.PricePerSeat,
                        AvailableSeats = aoFlight.TotalSeats - aoBookingGroup.Count(aoBooking => aoBooking.Status == BookingStatus.Confirmed)
                    }
                )
                .OrderBy(aoObj => aoObj.DepartureTime)
                .ToList();
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
