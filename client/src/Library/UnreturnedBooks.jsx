import React, { useState } from 'react';

const UnreturnedBooksForm = ({ unreturnedBooks, markAsReturned }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = unreturnedBooks.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Unreturned Books</h1>
      <input
        type="text"
        placeholder="Search for books"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded-md w-full mb-4"
      />
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p><strong>Name:</strong> {book.name}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
            </div>
            <button
              onClick={() => markAsReturned(book.id)}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Mark as Returned
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnreturnedBooksForm;
