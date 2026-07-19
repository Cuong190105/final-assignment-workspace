using System.Text;
namespace Final
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Set console encoding to UTF-8 to support Vietnamese characters
            Console.OutputEncoding = Encoding.UTF8;
            Console.InputEncoding = Encoding.UTF8;

            // ===================Part A==========================
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


            // =============================== Q5Results ================================
            Console.WriteLine("=== Q5 Demonstration ===");
            Console.WriteLine("q, Confirmed bookings for flight 1:");
            var aoConfirmedBookings1 = aoManager.GetConfirmedBookingsForFlight(1);
            foreach (var aoBooking in aoConfirmedBookings1)
            {
                Console.WriteLine($" - Name: {aoBooking.PassengerName}, Passport: {aoBooking.PassportNumber}, Seat: {aoBooking.SeatNumber}, Fee: {aoBooking.BookingFee}");
            }

            Console.WriteLine("r, Top 5 most expensive flights:");
            var aoTop5ExpensiveFlights = aoManager.GetTop5MostExpensiveFlightsWithAvailableSeats();
            foreach (var aoFlight in aoTop5ExpensiveFlights)
            {
                Console.WriteLine($" - Airline: {aoFlight.AirlineName}, Flight Code: {aoFlight.FlightCode}, Origin: {aoFlight.Origin}, Destination: {aoFlight.Destination}, Price: {aoFlight.PricePerSeat:C}, Available Seats: {aoFlight.AvailableSeats}");
            }

            Console.WriteLine("s, Summary for each airline:");
            var aoAirlineSummary = aoManager.GetAirlinesSummary();
            foreach (var aoSummary in aoAirlineSummary)
            {
                Console.WriteLine($" - Airline: {aoSummary.AirlineName}, Total flights: {aoSummary.TotalFlights}, Total Bookings: {aoSummary.TotalBookings}, Confirmed Bookings: {aoSummary.ConfirmedBookings}, Total Revenue: {aoSummary.TotalRevenue:C}");
            }

            Console.WriteLine("t, Passengers with more than one booking:");
            var aoPassengersWithMultipleBookings = aoManager.GetPassengersBookingMoreThanOnce();
            foreach (var aoPassenger in aoPassengersWithMultipleBookings)
            {
                Console.WriteLine($" - Name: {aoPassenger.PassengerName}, Passport: {aoPassenger.PassportNumber}, Flight Count: {aoPassenger.FlightCount}");
            }

            Console.WriteLine("u, Flights schedule for route HAN-DAD:");
            var aoFlightsSchedule = aoManager.GetFlightScheduleWithRoute("HAN", "DAD");
            foreach (var aoFlight in aoFlightsSchedule)
            {
                Console.WriteLine($" - Flight Code: {aoFlight.FlightCode}, Departure: {aoFlight.DepartureTime}, Duration: {aoFlight.DurationMinutes} minutes, Price: {aoFlight.PricePerSeat:C}, Available Seats: {aoFlight.AvailableSeats}");
            }

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

            // Q7 Demo
            Console.WriteLine("\n===== Q7 Demonstration =====");
            Console.WriteLine("Thực hiện thêm 3 bookings");
            Booking aoB1 = aoManager.AddBooking(1, "Nguyen Van A", "P000101", "15A", BookingStatus.Confirmed);
            Booking aoB2 = aoManager.AddBooking(1, "Tran Thi B", "P000102", "15B", BookingStatus.Pending);
            Booking aoB3 = aoManager.AddBooking(1, "Le Van C", "P000103", "15C", BookingStatus.Confirmed);
            
            Console.WriteLine($"Đã thêm: {aoB1.PassengerName} (ID: {aoB1.BookingId}, Trạng thái: {aoB1.Status})");
            Console.WriteLine($"Đã thêm: {aoB2.PassengerName} (ID: {aoB2.BookingId}, Trạng thái: {aoB2.Status})");
            Console.WriteLine($"Đã thêm: {aoB3.PassengerName} (ID: {aoB3.BookingId}, Trạng thái: {aoB3.Status})");

            // Hủy booking 3
            Console.WriteLine($"Thực hiện hủy booking vừa thêm (ID: {aoB3.BookingId})");
            aoManager.CancelBooking(aoB3.BookingId);
            Console.WriteLine($"Trạng thái Booking {aoB3.BookingId} sau khi hủy: {aoB3.Status}");

            // Thực hiện Undo lần 1 (Hoàn tác việc Hủy booking 3 -> Khôi phục lại trạng thái Confirmed)
            Console.WriteLine("Thực hiện Undo lần 1 (Hoàn tác việc hủy)");
            aoManager.UndoLastBookingAction();
            Console.WriteLine($"Trạng thái Booking {aoB3.BookingId} sau khi Undo hủy: {aoB3.Status} (Mong đợi: Confirmed)");

            // Thực hiện Undo lần 2 (Hoàn tác việc Thêm booking 3 -> Xóa booking 3 khỏi hệ thống)
            Console.WriteLine("Thực hiện Undo lần 2 (Hoàn tác việc thêm Booking 3)");
            aoManager.UndoLastBookingAction();
            // Thử tìm lại xem còn tồn tại không
            bool abExistsB3 = aoManager.GetConfirmedBookingsForFlight(1).Any(b => b.BookingId == aoB3.BookingId);
            Console.WriteLine($"Booking {aoB3.BookingId} còn tồn tại trong hệ thống không? {abExistsB3} (Mong đợi: False)");

            // Thực hiện Undo lần 3 (Hoàn tác việc Thêm booking 2 -> Xóa booking 2)
            Console.WriteLine("Thực hiện Undo lần 3 (Hoàn tác việc thêm Booking 2)");
            aoManager.UndoLastBookingAction();

            // Thực hiện Undo lần 4 (Hoàn tác việc Thêm booking 1 -> Xóa booking 1)
            Console.WriteLine("Thực hiện Undo lần 4 (Hoàn tác việc thêm Booking 1)");
            aoManager.UndoLastBookingAction();
            Console.WriteLine("Undo hoàn thành thành công tất cả các bước.");

            // Q8 Demo
            Console.WriteLine();
            Console.WriteLine("===== Q8 - Sorting Algorithms on Flights =====");
            // Create a list with 10 flights with different departure times and prices
            List<Flight> flights = new List<Flight>()
            {
                new Flight(1, 1, "F1", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(10), 100, 150, 300),
                new Flight(2, 1, "F2", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(8), 100, 150, 200),
                new Flight(3, 1, "F3", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(12), 100, 150, 500),
                new Flight(4, 1, "F4", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(6), 100, 150, 100),
                new Flight(5, 1, "F5", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(14), 100, 150, 450),
                new Flight(6, 1, "F6", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(9), 100, 150, 250),
                new Flight(7, 1, "F7", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(11), 100, 150, 350),
                new Flight(8, 1, "F8", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(7), 100, 150, 150),
                new Flight(9, 1, "F9", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(13), 100, 150, 400),
                new Flight(10, 1, "F10", "HAN", "SGN", DateTime.Now.AddDays(1).AddHours(5), 100, 150, 50)
            };

            // Create copies of the list for sorting
            List<Flight> listBubble = new List<Flight>(flights);
            List<Flight> listMerge = new List<Flight>(flights);

            Q8Results sorter = new Q8Results();

            // Sort using Bubble Sort
            sorter.BubbleSortByPrice(listBubble);

            // Sort using Merge Sort
            sorter.MergeSortByDeparture(listMerge);

            // Comparing the number of comparisons
            Console.WriteLine("Comparisions:");
            Console.WriteLine($"Bubble Sort: {sorter.myiBubbleComparisons}");
            Console.WriteLine($"Merge Sort:  {sorter.myiMergeComparisons}");

            // Search for a flight by DepartureTime using Binary Search
            DateTime target = new DateTime(2025, 1, 1, 10, 0, 0);
            int index = sorter.BinarySearchByDeparture(listMerge, target);

            Console.WriteLine("Binary Search:");
            if (index != -1)
            {
                Console.WriteLine("Tìm thấy chuyến bay:");
                Console.WriteLine($"{listMerge[index].FlightCode} - {listMerge[index].DepartureTime:HH:mm}");
            }
            else
            {
                Console.WriteLine("Không tìm thấy chuyến bay");
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
            
            // ======================= Q10 ===============================
            Console.WriteLine();
            Console.WriteLine("========== Q10 Demonstration ==========");
            
            // Thêm Business Flight
            BusinessFlight aoBusinessFlight =
                aoManager.AddBusinessFlight(
                    1,
                    "HAN",
                    "SIN",
                    DateTime.Now.AddDays(10),
                    180,
                    50,
                    5000000,
                    true,
                    true,
                    1500000);
            BusinessFlight aoBusinessFlight2 =
                aoManager.AddBusinessFlight(
                    2,
                    "SGN",
                    "BKK",
                    DateTime.Now.AddDays(12),
                    120,
                    40,
                    4500000,
                    true,
                    false,
                    1000000);

            Console.WriteLine();
            Console.WriteLine("Business Flight 2 Created:");
            Console.WriteLine(aoBusinessFlight2.GetInfo());
            Console.WriteLine(aoBusinessFlight2.GetSummary());
            Console.WriteLine("Business Flight Created:");
            Console.WriteLine(aoBusinessFlight.GetInfo());
            
            Console.WriteLine();
            Console.WriteLine($"Total Revenue: {aoManager.GetTotalRevenue():C}");
            
            Console.WriteLine();
            Console.WriteLine($"Standby passengers of Airline 3: {aoManager.GetStandbyCount(3)}");
            
            Console.WriteLine();
            Console.WriteLine("All SkyEntity objects:");
            
            foreach (SkyEntity aoEntity in aoManager.GetAllEntities())
            {
                Console.WriteLine("--------------------------------");
                Console.WriteLine($"Type: {aoEntity.EntityType}");
                Console.WriteLine(aoEntity.GetInfo());
                Console.WriteLine(aoEntity.GetSummary());
            }
            
            Console.WriteLine("Standby Queue Flight 6");
            // Temp list to hold the dequeued passengers for display
            List<StandbyPassenger> aoStandbyList = new List<StandbyPassenger>();
            var aoStandbyQueue = aoManager.Flights.First(f => f.FlightId == 6).StandbyQueue;
            while (aoStandbyQueue.Count() > 0)
            {
                var aoStandbyPassenger = aoStandbyQueue.Dequeue();
                Console.WriteLine(
                    $"{aoStandbyPassenger.PassengerName} - Priority {aoStandbyPassenger.Priority}");
                aoStandbyList.Add(aoStandbyPassenger);
            }
            // Re-enqueue the passengers back to the standby queue
            foreach (var aoStandbyPassenger in aoStandbyList)
            {
                aoStandbyQueue.Enqueue(aoStandbyPassenger);
            }
            // ==========================================================
            // Group Summary by EntityType (tt)
            // ==========================================================
            Console.WriteLine();
            Console.WriteLine("===== Grouped Summary By Entity Type =====");
            
            var aoGroups = aoManager.GetAllEntities()
                .GroupBy(e => e.EntityType);
            
            foreach (var aoGroup in aoGroups)
            {
                Console.WriteLine($"{aoGroup.Key}: {aoGroup.Count()} objects");
            }
            
            // ==========================================================
            // System-wide Summary Table (uu)
            // ==========================================================
            Console.WriteLine();
            Console.WriteLine("============= SYSTEM SUMMARY =============");
            
            Console.WriteLine(
                $"{"Airline",-20} {"Flights",8} {"Bookings",10} {"Revenue",15} {"Standby",10}");
            
            foreach (var aoAirline in aoManager.Airlines)
            {
                int aiFlights =
                    aoManager.Flights.Count(f =>
                        f.AirlineId == aoAirline.AirlineId);
            
                int aiBookings =
                    aoManager.Bookings.Count(b =>
                    {
                        Flight? aoFlight =
                            aoManager.Flights.FirstOrDefault(f =>
                                f.FlightId == b.FlightId);
            
                        return aoFlight != null &&
                               aoFlight.AirlineId == aoAirline.AirlineId;
                    });
            
                decimal adRevenue =
                    aoManager.Bookings
                        .Where(b => b.Status == BookingStatus.Confirmed)
                        .Where(b =>
                        {
                            Flight? aoFlight =
                                aoManager.Flights.FirstOrDefault(f =>
                                    f.FlightId == b.FlightId);
            
                            return aoFlight != null &&
                                   aoFlight.AirlineId == aoAirline.AirlineId;
                        })
                        .Sum(b => b.BookingFee);
            
                int aiStandby =
                    aoManager.GetStandbyCount(aoAirline.AirlineId);
            
                Console.WriteLine(
                    $"{aoAirline.AirlineName,-20} " +
                    $"{aiFlights,8} " +
                    $"{aiBookings,10} " +
                    $"{adRevenue,15:C} " +
                    $"{aiStandby,10}");
            }
            
            Console.WriteLine("==========================================");
        }
    }
}
