namespace Final
{
    public class Airline : SkyEntity
    {
        private int myiAirlineId;
        private string mysAirlineName;
        private string mysIATACode;
        private string mysCountry;
        private int myiFoundedYear;

        public Airline(int airlineId, string airlineName, string iATACode, string country, int foundedYear)
        {
            AirlineId = airlineId;
            AirlineName = airlineName;
            IATACode = iATACode;
            Country = country;
            FoundedYear = foundedYear;
        }

        public int AirlineId
        {
            get => myiAirlineId;
            set => myiAirlineId = value;
        }
        public string AirlineName
        {
            get => mysAirlineName;
            set => mysAirlineName = value;
        }
        public string IATACode
        {
            get => mysIATACode;
            set
            {
                if (value.Length != 2 || !value.All(acChar => char.IsLetter(acChar) && char.IsUpper(acChar)))
                {
                    throw new ArgumentException("Invalid IATA code.");
                }
                mysIATACode = value;
            }
        }
        public string Country
        {
            get => mysCountry;
            set => mysCountry = value;
        }
        public int FoundedYear
        {
            get => myiFoundedYear;
            set => myiFoundedYear = value;
        }
        public override string EntityType => "Airline";

        /// <summary>
        /// Returns a string representation of the airline's information.
        /// </summary>
        public override string GetInfo()
        {
            return $"Airline ID: {AirlineId}, Name: {AirlineName}, IATA Code: {IATACode}, Country: {Country}, Founded Year: {FoundedYear}";
        }
    }
}
