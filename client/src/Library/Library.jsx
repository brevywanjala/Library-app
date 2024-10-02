import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddBookForm from './AddBookForm';
import EditBookForm from './EditBookForm';
import BorrowBook from './BorrowBook';
import { FaPlus, FaBook, FaArrowCircleDown, FaSync, FaSyncAlt, FaEdit } from 'react-icons/fa';


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

  const handleRefreshClick = () => {
    setIsFetching(true);
    fetchBooks()

    // Simulate fetching data
    setTimeout(() => {
      setIsFetching(false);
    }, 4000); // Adjust the timeout duration as needed
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setBooks([])
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
    <div className="max-w-6xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Library App</h1>
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
          onClick={handleRefreshClick }
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
                      <FaEdit/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Library;