namespace Final
{
    //Q9 - jj)
    public class StandbyQueue
    {
        private List<StandbyPassenger> myoHeap;

        public StandbyQueue()
        {
            myoHeap = new List<StandbyPassenger>();
        }

        public int Count()
        {
            return myoHeap.Count;
        }

        public StandbyPassenger Peek()
        {
            if (myoHeap.Count == 0)
                throw new InvalidOperationException("Standby queue is empty.");

            return myoHeap[0];
        }

        public void Enqueue(StandbyPassenger theoPassenger)
        {
            myoHeap.Add(theoPassenger);

            int aiIndex = myoHeap.Count - 1;

            while (aiIndex > 0)
            {
                int aiParent = (aiIndex - 1) / 2;

                if (Compare(myoHeap[aiIndex], myoHeap[aiParent]) < 0)
                {
                    Swap(aiIndex, aiParent);
                    aiIndex = aiParent;
                }
                else
                {
                    break;
                }
            }
        }

        public StandbyPassenger Dequeue()
        {
            if (myoHeap.Count == 0)
                throw new InvalidOperationException("Standby queue is empty.");

            StandbyPassenger aoResult = myoHeap[0];

            myoHeap[0] = myoHeap[myoHeap.Count - 1];

            myoHeap.RemoveAt(myoHeap.Count - 1);

            if (myoHeap.Count > 0)
            {
                HeapifyDown(0);
            }

            return aoResult;
        }

        private void HeapifyDown(int theiIndex)
        {
            while (true)
            {
                int aiLeft = theiIndex * 2 + 1;
                int aiRight = theiIndex * 2 + 2;
                int aiSmallest = theiIndex;

                if (aiLeft < myoHeap.Count &&
                    Compare(myoHeap[aiLeft], myoHeap[aiSmallest]) < 0)
                {
                    aiSmallest = aiLeft;
                }

                if (aiRight < myoHeap.Count &&
                    Compare(myoHeap[aiRight], myoHeap[aiSmallest]) < 0)
                {
                    aiSmallest = aiRight;
                }

                if (aiSmallest == theiIndex)
                    break;

                Swap(theiIndex, aiSmallest);

                theiIndex = aiSmallest;
            }
        }

        /// <summary>
        /// Compares two standby passengers.
        /// Lower Priority value comes first.
        /// If Priority is equal, earlier RegistrationTime comes first.
        /// </summary>
        private int Compare(
            StandbyPassenger theoA,
            StandbyPassenger theoB)
        {
            // Compare Priority first
            if (theoA.Priority < theoB.Priority)
            {
                return -1;
            }

            if (theoA.Priority > theoB.Priority)
            {
                return 1;
            }

            // Same Priority -> Compare RegistrationTime
            if (theoA.RegistrationTime < theoB.RegistrationTime)
            {
                return -1;
            }

            if (theoA.RegistrationTime > theoB.RegistrationTime)
            {
                return 1;
            }

            return 0;
        }
        private void Swap(int theiIndex1, int theiIndex2)
        {
            StandbyPassenger aoTemp = myoHeap[theiIndex1];
            myoHeap[theiIndex1] = myoHeap[theiIndex2];
            myoHeap[theiIndex2] = aoTemp;
        }
    }
}