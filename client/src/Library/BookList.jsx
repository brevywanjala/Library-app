import React from 'react';
import { FaEdit, FaCog } from 'react-icons/fa';

const BookList = ({ books, onEdit, onSettings }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Book List</h2>
      <ul>
        {books.map(book => (
          <li key={book.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p><strong>Name:</strong> {book.name}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => onEdit(book)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => onSettings(book)} className="text-gray-500">
                <FaCog />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
