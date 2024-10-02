import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { FHOST } from '../App';

const BorrowBook = ({ onClose, books }) => {
  const userInfo = useSelector((state) => state.user.user); // Get user info from the state
  const [isbn, setIsbn] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [userType, setUserType] = useState('student');
  const [bookDetails, setBookDetails] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, bookId: null });
  const [isReturning, setIsReturning] = useState(false); // Track return status
  const [successMessage, setSuccessMessage] = useState(''); // Added state for success message
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submit status

  const fetchBorrowedBooks = async (studentNo) => {
    try {
      const response = await axios.get(`${FHOST}/books/api/borrowed-books/0?studentNo=${studentNo}`);
      setBorrowedBooks(response.data.unreturned_books); // Use 'unreturned_books' from the response data
      console.log(response.data)
    } catch (error) {
      setError('Error fetching borrowed books.');
      setBorrowedBooks([]);
    }
  };
  const handleReturnBook = async (bookId) => {
    // Prevent multiple submissions
    if (isReturning) return;

    setIsReturning(true); // Set the status to returning
    try {
      await axios.post(`${FHOST}/books/api/return/${bookId}/0`, {
        user_no: studentNo,
        user_type: userType
      });
      
      setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId)); // Update local state
      setDialog({ open: false, bookId: null }); // Close dialog
      setSuccessMessage('Book returned successfully!');
    } catch (error) {
      setError('Error returning the book.');
    } finally {
      setIsReturning(false); // Reset the status
    }
  };
  

  useEffect(() => {
    let timeoutId;
  
    if (error || successMessage) {
      timeoutId = setTimeout(() => {
        setError(''); // Clear the error message after 5 seconds
        setSuccessMessage(''); // Clear the success message after 5 seconds
      }, 5000); // 5 seconds
  
      // Cleanup function to clear timeout if the component unmounts or error/successMessage changes
      return () => clearTimeout(timeoutId);
    }
  }, [error, successMessage]);
  
  // Debounce logic
  useEffect(() => {
    if (studentNo.length >= 3) { // Only start fetching if the student number is at least 3 characters
      const debounceTimeout = setTimeout(() => {
        fetchBorrowedBooks(studentNo);
      }, 3000); // Wait for 3 seconds

      // Cleanup function to clear timeout if the component unmounts or the studentNo changes
      return () => clearTimeout(debounceTimeout);
    }
  }, [studentNo]); // Effect will rerun every time studentNo changes

  const handleIsbnChange = (e) => {
    const enteredIsbn = e.target.value;
    setIsbn(enteredIsbn);

    // Find book details from the passed books prop
    const foundBook = books.find((book) => book.ISBN_no === enteredIsbn);

    if (foundBook) {
      setBookDetails(foundBook);
      setError(''); // Clear any previous error
    } else {
      setBookDetails(null); // Clear book details if not found
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message
    setSuccessMessage(''); // Reset success message

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate input
    if (!isbn || !studentNo) {
      setError('ISBN and student number are required.');
      return;
    }

    setIsSubmitting(true); // Set the status to submitting

    // Submit borrowing request
    try {
      const response = await axios.post(`${FHOST}/books/api/borrow/0`, {
        isbn,
        user_no: studentNo,
        usertype: userType,
      });

      console.log(response.data);

      if (response.data.success) {
        // Handle success
        setSuccessMessage('Book borrowed successfully!'); // Set success message
        onClose(); // Close the form after successful submission
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while borrowing the book.');
    } finally {
      setIsSubmitting(false); // Reset the status
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Borrow/Return  Book</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">ISBN Number</label>
          <input
            type="text"
            value={isbn}
            onChange={handleIsbnChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        {bookDetails && (
          <div className="mb-4 p-4 border border-gray-300 rounded-md">
            <h3 className="font-bold">Book Details:</h3>
            <p>
              <strong>Title:</strong> {bookDetails.title}
            </p>
            <p>
              <strong>Author:</strong> {bookDetails.author}
            </p>
            <p>
              <strong>Quantity:</strong> {bookDetails.quantity}
            </p>
            <p>
              <strong>Genre:</strong> {bookDetails.genre}
            </p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Student Number</label>
          <input
            type="text"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">User Type</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {borrowedBooks.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-bold">Books Borrowed by {studentNo}:</h3>
            <ul className="list-disc pl-5 ">
              {borrowedBooks.map((book) => (
                <li key={book.id} className="flex mb-2 items-center justify-between">
                  {book.title} (Borrowed on: {book.borrowed_on})
                  <button
                    type="button"
                    onClick={() => setDialog({ open: true, bookId: book.id })}
                    className="ml-2 bg-red-500 text-white p-1 rounded-md"
                  >
                    Return
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ):(<>
        <p>No books borrowed by student no {studentNo}</p>
        </>)}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Borrow Book
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded-md ml-2">
            Cancel
          </button>
        </div>
      </form>
      {dialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Return Book</h3>
            <p>Are you sure you want to return this book?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleReturnBook(dialog.bookId)}
                className="bg-blue-500 text-white p-2 rounded-md mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setDialog({ open: false, bookId: null })}
                className="bg-gray-300 text-black p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowBook;
