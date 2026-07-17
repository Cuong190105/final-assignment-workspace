namespace Final
{
    public abstract class SkyEntity
    {
        private int myiId;
        public int Id => myiId;
        public abstract string GetInfo();
        public abstract string EntityType { get; }
        public virtual string GetSummary()
        {
            return $"This is an instance of SkyEntity";
        }
    }
}
