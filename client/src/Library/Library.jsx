import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddBookForm from './AddBookForm';
import EditBookForm from './EditBookForm';
import BorrowBook from './BorrowBook';
import { FaPlus, FaBook, FaArrowCircleDown, FaSyncAlt, FaEdit, FaHome, FaSignOutAlt, FaUserAltSlash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { FHOST } from '../App';

const Library = ({ addBook, updateBook }) => {
  const userInfo = useSelector((state) => state.user.user); // Get user info from the state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Dummy statistics for demonstration
  const stats = {
    totalUsers: 120,
    increment: 10,
    amountSpent: 3000,
    earnings: 5000,
    profitLossPercentage: 15
  };

  const handleRefreshClick = () => {
    setIsFetching(true);
    fetchBooks();
    setTimeout(() => {
      setIsFetching(false);
    }, 4000); // Adjust the timeout duration as needed
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setBooks([]);
    try {
      const response = await axios.get(`${FHOST}/books/api/books/0`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (book) => {
    setEditBook(book);
    setIsEditing(true);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white min-h-screen p-4">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img 
          src={'/tom.jpg'} // Add your default profile picture path
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-white"
        />
        <div className="ml-2">
          <p className="text-lg font-semibold">Tom Bryant</p>
        </div>
      </div>
      
      
      <ul>
        <li className="mb-2">
          <a 
            href="#new-student" 
            className="flex items-center p-2 bg-blue-800 hover:bg-blue-700 rounded transition duration-200"
          >
            <FaPlus className="mr-2" /> New Student
          </a>
        </li>
        <li className="mb-2">
          <a 
            href="#my-account" 
            className="flex items-center p-2 bg-blue-800 hover:bg-blue-700 rounded transition duration-200"
          >
            <FaUserAltSlash className="mr-2" /> My Account
          </a>
        </li>
        <li className="mb-2">
          <a 
            href="#earnings" 
            className="flex items-center p-2 bg-blue-800 hover:bg-blue-700 rounded transition duration-200"
          >
            <FaArrowCircleDown className="mr-2" /> Earnings
          </a>
        </li>
      </ul>
    </div>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-blue-50">
        {/* Navbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md mb-4">
          <h1 className="text-2xl font-bold">Library App</h1>
          <div className="flex space-x-4">
            <button className="p-2">
              <FaHome />
            </button>
            <button className="p-2 flex items-center space-x-3 bg-blue-500 text-white rounded transition duration-200 hover:bg-blue-600">
              <a href="http://127.0.0.1:5001" className="flex items-center">
                <span>Logout</span> 
                <FaSignOutAlt className='ml-3'/>
              </a>
            </button>


            

          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl">{stats.totalUsers}</p>
            <p className={`text-green-600`}>{stats.increment}% increase</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Amount Spent on Books</h3>
            <p className="text-2xl">${stats.amountSpent}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Earnings</h3>
            <p className="text-2xl">${stats.earnings}</p>
            <p className={`text-red-600`}>{stats.profitLossPercentage}% profit</p>
          </div>
        </div>

        {/* Books Section */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg">Total Registered Books: {books.length}</p>
          <input
            type="text"
            placeholder="Search for books"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-4 mb-4">
          <button
            className={`text-2xl ${isFetching ? 'animate-spin' : ''} focus:outline-none`}
            onClick={handleRefreshClick}
          >
            <FaSyncAlt />
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md flex items-center"
            onClick={() => setIsAdding(true)}
          >
            <FaPlus className="mr-2" /> Add Book
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded-md flex items-center"
            onClick={() => setIsBorrowing(true)}
          >
            <FaBook className="mr-2" /> Borrow Book
          </button>
        </div>

        {isAdding && (
          <AddBookForm addBook={addBook} fetchBooks={fetchBooks} onClose={() => setIsAdding(false)} />
        )}
        {isEditing && editBook && (
          <EditBookForm book={editBook} fetchBooks={fetchBooks} updateBook={updateBook} onClose={() => setIsEditing(false)} />
        )}
        {isBorrowing && (
          <BorrowBook books={books} onClose={() => setIsBorrowing(false)} />
        )}

        {!isAdding && !isEditing && !isBorrowing && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Books List</h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">Author</th>
                  <th className="border border-gray-300 p-2">ISBN</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Due Days</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="border border-gray-300 p-2">{book.title}</td>
                    <td className="border border-gray-300 p-2">{book.author}</td>
                    <td className="border border-gray-300 p-2">{book.ISBN_no}</td>
                    <td className="border border-gray-300 p-2">{book.quantity}</td>
                    <td className="border border-gray-300 p-2">{book.due_days}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-blue-500 text-white p-1 rounded-md"
                        onClick={() => handleEdit(book)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
