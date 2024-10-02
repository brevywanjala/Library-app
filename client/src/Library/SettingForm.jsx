import React, { useState } from 'react';

const SettingsForm = ({ book, updateSettings, onClose }) => {
  const [name, setName] = useState(book.name);
  const [author, setAuthor] = useState(book.author);
  const [isbn, setIsbn] = useState(book.isbn);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedBook = { ...book, name, author, isbn };
    updateSettings(updatedBook);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Settings for {book.name}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">ISBN</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded-md">Cancel</button>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save</button>
      </div>
    </form>
  );
};

export default SettingsForm;
