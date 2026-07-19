namespace Final
{
    public abstract class SkyEntity
    {
        private int myiId;
        public int Id => myiId;

        /// <summary>
        /// Returns information about the SkyEntity instance.
        /// </summary>
        public abstract string GetInfo();
        public abstract string EntityType { get; }

        /// <summary>
        /// Returns a summary of the SkyEntity instance.
        /// </summary>
        public virtual string GetSummary()
        {
            return $"This is an instance of SkyEntity";
        }
    }
}
