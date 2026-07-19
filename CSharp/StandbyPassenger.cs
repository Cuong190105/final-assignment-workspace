namespace Final
{
    //Q9 - ii)
    public class StandbyPassenger
    {
        private string mysPassengerName;
        private string mysPassportNumber;
        private int myiPriority;
        private DateTime myoRegistrationTime;

        public StandbyPassenger(string thesPassengerName,
                                string thesPassportNumber,
                                int theiPriority)
        {
            PassengerName = thesPassengerName;
            PassportNumber = thesPassportNumber;
            Priority = theiPriority;
            RegistrationTime = DateTime.Now;
        }

        public string PassengerName
        {
            get => mysPassengerName;
            set => mysPassengerName = value;
        }

        public string PassportNumber
        {
            get => mysPassportNumber;
            set => mysPassportNumber = value;
        }

        public int Priority
        {
            get => myiPriority;
            set
            {
                if (value < 1 || value > 3)
                    throw new ArgumentException("Priority must be between 1 and 3.");

                myiPriority = value;
            }
        }

        public DateTime RegistrationTime
        {
            get => myoRegistrationTime;
            set => myoRegistrationTime = value;
        }
    }
}