using System;
using System.Collections.Generic;
using System.Text;

namespace Final
{
	public class Q8Results
	{
		/// <summary>
		/// Stores the number of comparisons performed in Bubble Sort.
		/// </summary>
		public int myiBubbleComparisons = 0;

		/// <summary>
		/// Sorts the list of flights by PricePerSeat using Bubble Sort algorithm.
		/// </summary>
		/// <param name="theoList">The list of flights to sort.</param>
		public void BubbleSortByPrice(List<Flight> theoList)
		{
			int n = theoList.Count;
			myiBubbleComparisons = 0;

			for (int i = 0; i < n - 1; i++)
			{
				for (int j = 0; j < n - i - 1; j++)
				{
					myiBubbleComparisons++;

					if (theoList[j].PricePerSeat > theoList[j + 1].PricePerSeat)
					{
						var temp = theoList[j];
						theoList[j] = theoList[j + 1];
						theoList[j + 1] = temp;
					}
				}
			}
			Console.WriteLine("Flights after Bubble Sort (Price Ascending):");
			foreach (Flight flight in theoList)
			{
				Console.WriteLine($"{flight.FlightCode} - {flight.PricePerSeat}");
			}
		}

		/// <summary>
		/// Stores the number of comparisons performed in Merge Sort.
		/// </summary>
		public int myiMergeComparisons = 0;

		/// <summary>
		/// Sorts the list of flights by DepartureTime using Merge Sort algorithm.
		/// </summary>
		/// <param name="theoList">The list of flights to sort.</param>
		public void MergeSortByDeparture(List<Flight> theoList)
		{
			myiMergeComparisons = 0;
			MergeSort(theoList, 0, theoList.Count - 1);
			Console.WriteLine("Flights after Merge Sort (Departure Ascending):");
			foreach (Flight flight in theoList)
			{
				Console.WriteLine($"{flight.FlightCode} - {flight.DepartureTime}");
			}
		}

		/// <summary>
		/// Recursively divides the list and sorts each part.
		/// </summary>
		/// <param name="list">The list to sort.</param>
		/// <param name="left">Left index.</param>
		/// <param name="right">Right index.</param>
		private void MergeSort(List<Flight> list, int left, int right)
		{
			if (left >= right) return;

			int mid = (left + right) / 2;

			MergeSort(list, left, mid);
			MergeSort(list, mid + 1, right);

			Merge(list, left, mid, right);
		}

		/// <summary>
		/// Merges two sorted sublists into one sorted list.
		/// </summary>
		/// <param name="list">The main list.</param>
		/// <param name="left">Left index.</param>
		/// <param name="mid">Middle index.</param>
		/// <param name="right">Right index.</param>
		private void Merge(List<Flight> list, int left, int mid, int right)
		{
			int n1 = mid - left + 1;
			int n2 = right - mid;

			List<Flight> leftList = new List<Flight>();
			List<Flight> rightList = new List<Flight>();

			for (int i = 0; i < n1; i++)
				leftList.Add(list[left + i]);

			for (int j = 0; j < n2; j++)
				rightList.Add(list[mid + 1 + j]);

			int iIndex = 0, jIndex = 0, k = left;

			while (iIndex < n1 && jIndex < n2)
			{
				myiMergeComparisons++;

				if (leftList[iIndex].DepartureTime <= rightList[jIndex].DepartureTime)
				{
					list[k] = leftList[iIndex];
					iIndex++;
				}
				else
				{
					list[k] = rightList[jIndex];
					jIndex++;
				}
				k++;
			}

			while (iIndex < n1)
			{
				list[k++] = leftList[iIndex++];
			}

			while (jIndex < n2)
			{
				list[k++] = rightList[jIndex++];
			}
		}

		/// <summary>
		/// Prints the number of comparisons for both sorting algorithms.
		/// </summary>
		public void PrintComparisons()
		{
			Console.WriteLine($"Bubble Sort comparisons: {myiBubbleComparisons}");
			Console.WriteLine($"Merge Sort comparisons: {myiMergeComparisons}");
		}

		/// <summary>
		/// Searches for a flight by DepartureTime using Binary Search.
		/// </summary>
		/// <param name="theoSorted">Sorted list of flights.</param>
		/// <param name="theTarget">Target departure time.</param>
		/// <returns>Index of the found flight, or -1 if not found.</returns>
		public int BinarySearchByDeparture(List<Flight> theoSorted, DateTime theTarget)
		{
			int left = 0;
			int right = theoSorted.Count - 1;

			while (left <= right)
			{
				int mid = (left + right) / 2;

				if (theoSorted[mid].DepartureTime == theTarget)
					return mid;

				if (theoSorted[mid].DepartureTime < theTarget)
					left = mid + 1;
				else
					right = mid - 1;
			}

			return -1;
		}
	}
}