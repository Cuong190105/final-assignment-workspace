using System;

namespace Final
{
    /// <summary>
    /// Lớp Stack generic tự định nghĩa sử dụng cấu trúc mảng động.
    /// </summary>
    /// <typeparam name="T">Kiểu dữ liệu của các phần tử trong Stack.</typeparam>
    public class SkyStack<T>
    {
        // Mảng lưu trữ dữ liệu private
        private T[] myoData;
        // Số lượng phần tử hiện tại trong Stack
        private int myiSize;

        /// <summary>
        /// Khởi tạo một đối tượng <see cref="SkyStack{T}"/> mới với dung lượng ban đầu là 8.
        /// </summary>
        public SkyStack()
        {
            myoData = new T[8];
            myiSize = 0;
        }

        /// <summary>
        /// Thêm một phần tử vào đỉnh Stack.
        /// Tự động nhân đôi dung lượng mảng nếu mảng đầy.
        /// </summary>
        /// <param name="theoItem">Phần tử cần thêm vào Stack.</param>
        public void Push(T theoItem)
        {
            // Kiểm tra nếu mảng đã đầy thì nhân đôi kích thước
            if (myiSize == myoData.Length)
            {
                T[] aoNewData = new T[myoData.Length * 2];
                Array.Copy(myoData, aoNewData, myoData.Length);
                myoData = aoNewData;
            }

            // Gán phần tử vào vị trí hiện tại và tăng kích thước lên 1
            myoData[myiSize] = theoItem;
            myiSize++;
        }

        /// <summary>
        /// Lấy ra và xóa phần tử ở đỉnh Stack.
        /// Ném ra ngoại lệ InvalidOperationException nếu Stack rỗng.
        /// </summary>
        /// <returns>Phần tử ở đỉnh Stack.</returns>
        /// <exception cref="InvalidOperationException">Ném ra khi Stack không có phần tử nào.</exception>
        public T Pop()
        {
            if (IsEmpty())
            {
                throw new InvalidOperationException("Stack rỗng, không thể thực hiện Pop.");
            }

            myiSize--;
            T aoItem = myoData[myiSize];
            // Xóa tham chiếu để hỗ trợ thu gom rác (Garbage Collection)
            myoData[myiSize] = default!; 
            return aoItem;
        }

        /// <summary>
        /// Xem phần tử ở đỉnh Stack mà không xóa nó.
        /// Ném ra ngoại lệ InvalidOperationException nếu Stack rỗng.
        /// </summary>
        /// <returns>Phần tử ở đỉnh Stack.</returns>
        /// <exception cref="InvalidOperationException">Ném ra khi Stack không có phần tử nào.</exception>
        public T Peek()
        {
            if (IsEmpty())
            {
                throw new InvalidOperationException("Stack rỗng, không thể thực hiện Peek.");
            }

            return myoData[myiSize - 1];
        }

        /// <summary>
        /// Kiểm tra xem Stack có rỗng hay không.
        /// </summary>
        /// <returns>True nếu Stack rỗng, ngược lại là False.</returns>
        public bool IsEmpty()
        {
            return myiSize == 0;
        }

        /// <summary>
        /// Trả về số lượng phần tử hiện tại trong Stack.
        /// </summary>
        /// <returns>Số lượng phần tử trong Stack.</returns>
        public int Size()
        {
            return myiSize;
        }
    }
}
