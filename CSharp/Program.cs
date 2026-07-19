namespace Final
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Crreate an instance of SkyLinkManager
            SkyLinkManager aoManager = SkyLinkManager.Instance;

            // Add sample data for airlines, flights, and bookings
            aoManager.AddAirline("Vietnam Airlines", "VN", "Vietnam", 1956);
            aoManager.AddAirline("Vietjet Air", "VJ", "Vietnam", 2011);
            aoManager.AddAirline("Bamboo Airways", "QH", "Vietnam", 2017);

            aoManager.AddFlight(1, "HAN", "SGN", DateTime.Now + TimeSpan.FromDays(1), 120, 180, 1_500_000);
            aoManager.AddFlight(2, "SGN", "DAN", DateTime.Now + TimeSpan.FromDays(2), 150, 200, 700_000);
            aoManager.AddFlight(3, "DAN", "HAN", DateTime.Now + TimeSpan.FromDays(3), 140, 190, 1_100_000);
            aoManager.AddFlight(1, "HAN", "DAN", DateTime.Now + TimeSpan.FromDays(4), 130, 170, 1_200_000);
            aoManager.AddFlight(2, "SGN", "HAN", DateTime.Now + TimeSpan.FromDays(5), 160, 210, 1_000_000);
            aoManager.AddFlight(3, "DAN", "SGN", DateTime.Now + TimeSpan.FromDays(6), 110, 2, 50_000_000);

            aoManager.AddBooking(1, "Passenger 1", "P000001", "1A", BookingStatus.Confirmed);
            aoManager.AddBooking(2, "Passenger 2", "P000002", "2B", BookingStatus.Pending);
            aoManager.AddBooking(3, "Passenger 3", "P000003", "3C", BookingStatus.Cancelled);
            aoManager.AddBooking(4, "Passenger 4", "P000004", "4D", BookingStatus.Confirmed);
            aoManager.AddBooking(5, "Passenger 5", "P000005", "5E", BookingStatus.Pending);
            aoManager.AddBooking(6, "Passenger 6", "P000006", "6F", BookingStatus.Confirmed);
            aoManager.AddBooking(1, "Passenger 7", "P000007", "7G", BookingStatus.Pending);
            aoManager.AddBooking(2, "Passenger 8", "P000008", "8H", BookingStatus.Confirmed);
            aoManager.AddBooking(3, "Passenger 9", "P000009", "9I", BookingStatus.Confirmed);
            aoManager.AddBooking(4, "Passenger 10", "P000010", "10J", BookingStatus.Pending);
            aoManager.AddBooking(5, "Passenger 11", "P000011", "11K", BookingStatus.Pending);
            aoManager.AddBooking(6, "Passenger 12", "P000012", "12L", BookingStatus.Confirmed);

            // Demonstrate Exception
            try // Duplicate airline name
            {
                var aoDuplicateNameAirline = aoManager.AddAirline("Vietnam Airlines", "VQ", "Vietnam", 1956);
                Console.WriteLine("Duplicate name airline added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            try // Duplicate IATA code
            {
                var aoDuplicateIATACodeAirline = aoManager.AddAirline("New Airline", "VN", "Vietnam", 2021);
                Console.WriteLine("Duplicate IATA airline added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            try // Duplicate Passport number
            {
                var aoDuplicatePassportBooking = aoManager.AddBooking(1, "Passenger 13", "P000001", "13M", BookingStatus.Confirmed);
                Console.WriteLine("Duplicate passport booking added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            try // Duplicate Seat number
            {
                var aoDuplicateSeatBooking = aoManager.AddBooking(1, "Passenger 14", "P000014", "1A", BookingStatus.Confirmed);
                Console.WriteLine("Duplicate seat booking added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            try // Full flight
            {
                var aoFullFlightBooking = aoManager.AddBooking(6, "Passenger 15", "P000015", "15N", BookingStatus.Confirmed);
                Console.WriteLine("Full flight booking added successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }

            // Demonstrate adding 2 flights with the same origin for the same airline
            var aoFlightSame1 = aoManager.AddFlight(1, "HAN", "DAD", DateTime.Now + TimeSpan.FromDays(7), 120, 180, 1_500_000);
            var aoFlightSame2 = aoManager.AddFlight(1, "HAN", "DAD", DateTime.Now + TimeSpan.FromDays(14), 120, 180, 1_500_000);
            Console.WriteLine($"Flight 1: {aoFlightSame1.FlightCode}");
            Console.WriteLine($"Flight 2: {aoFlightSame2.FlightCode}");




            // =============================== Q6Results ================================
            Console.WriteLine();
            Console.WriteLine("===== Q6.v - Busiest Day Of Week =====");
            var aoBusiest = aoManager.GetBusiestDayOfWeek();
            if (aoBusiest != null)
            {
                Console.WriteLine($"{aoBusiest.DayName}: {aoBusiest.DepartureCount} departures");
            }

            Console.WriteLine();
            Console.WriteLine("===== Q6.w - Average Load Factor Per Airline =====");
            foreach (var aoItem in aoManager.GetAverageLoadFactorPerAirline())
            {
                Console.WriteLine($"{aoItem.AirlineName}: {aoItem.AvgLoadFactor}%");
            }

            Console.WriteLine();
            Console.WriteLine("===== Q6.x - Route Statistics =====");
            foreach (var aoItem in aoManager.GetRouteStatistics())
            {
                Console.WriteLine($"{aoItem.Route} | Flights: {aoItem.FlightCount} | Cheapest: {aoItem.CheapestPrice} | Most Expensive: {aoItem.MostExpensivePrice} | Avg: {aoItem.AveragePrice}");
            }

            Console.WriteLine();
            Console.WriteLine("===== Q6.y - Fully Cancelled Passengers =====");
            foreach (var aoItem in aoManager.GetFullyCancelledPassengers())
            {
                Console.WriteLine($"{aoItem.PassengerName} ({aoItem.PassportNumber}): {aoItem.CancelledCount} cancelled");
            }
            //========================= Q9 =========================

            Console.WriteLine();
            Console.WriteLine("========== Q9 Demonstration ==========");

            // Flight 6 đã đầy (2/2 ghế)

            Console.WriteLine("Adding standby passengers...");

            aoManager.AddStandbyPassenger(
                6,
                "Charlie",
                "P100001",
                3);

            aoManager.AddStandbyPassenger(
                6,
                "David",
                "P100002",
                1);

            aoManager.AddStandbyPassenger(
                6,
                "Emma",
                "P100003",
                2);

            Console.WriteLine();

            Console.WriteLine("Cancelling Booking ID = 6...");
            aoManager.CancelBooking(6);

            Console.WriteLine();

            Console.WriteLine("Promoting highest-priority standby passenger...");

            Booking? aoPromoted =
                aoManager.PromoteFromStandby(6);

            Console.WriteLine();

            if (aoPromoted != null)
            {
                Console.WriteLine("Promotion successful!");
                Console.WriteLine($"Passenger : {aoPromoted.PassengerName}");
                Console.WriteLine($"Passport  : {aoPromoted.PassportNumber}");
                Console.WriteLine($"Status    : {aoPromoted.Status}");
            }

            Console.WriteLine("======================================");
        }
    }
}