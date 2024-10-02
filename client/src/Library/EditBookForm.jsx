import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { FHOST } from '../App';

const EditBookForm = ({ book,fetchBooks, onClose }) => {
  const userInfo = useSelector((state) => state.user.user); // Get user info from the state
  const [formData, setFormData] = useState({
    book_id: book?.id || '',
    title: '',
    ISBN_no: '',
    author: '',
    description: '',
    genre: '',
    quantity: 1,
    out_of_stock: 0,
    due_days: 14,
  });
  const [error, setError] = useState('');

  // Populate the form fields with the current book details when the component mounts
  useEffect(() => {
    if (book) {
      setFormData({
        book_id: book.id,
        title: book.title,
        ISBN_no: book.ISBN_no,
        author: book.author,
        description: book.description,
        genre: book.genre,
        quantity: book.quantity,
        out_of_stock: book.out_of_stock,
        due_days: book.due_days,
      });
    }
    console.log(formData,"this si the form daat")
  }, [book]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    // Validate required fields
    if (!formData.title || !formData.author || !formData.genre) {
      setError('Title, author, and genre are required fields.');
      return;
    }

    console.log(formData,"this sis the form daat")

    try {
      const response = await axios.post(`${FHOST}/books/api/update-book/0`, formData);
      console.log(response.data);
      if (response.data.message) {
        // Optionally, you can handle success feedback here
        onClose(); // Close the form after submission
        fetchBooks()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while updating the book.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Book</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Book Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ISBN Number</label>
          <input
            type="text"
            name="ISBN_no"
            value={formData.ISBN_no}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Minimum Quantity (Out of Stock Threshold)</label>
          <input
            type="number"
            name="out_of_stock"
            value={formData.out_of_stock}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            min="0"
          />
          <span className="text-gray-500">Set the minimum quantity before the book is considered out of stock.</span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Days</label>
          <input
            type="number"
            name="due_days"
            value={formData.due_days}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-full"
            min="1"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Update Book</button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded-md ml-2">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;