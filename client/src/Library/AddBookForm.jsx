import React, { useState } from 'react';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { FHOST } from '../App';

const AddBookForm = ({ addBook,fetchBooks, onClose }) => {
  const userInfo = useSelector((state) => state.user.user); // Get user info from the state
  const [formData, setFormData] = useState({
    title: '',
    ISBN_no: '',
    author: '',
    description: '',
    quantity: 1,
    out_of_stock: 0, // Minimum quantity threshold
    due_days: 14,
  });
  const [error, setError] = useState('');

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

    try {
        const response = await axios.post(`${FHOST}/books/api/add-book/0`, formData);

        if (response.status === 201) { // Check for success status code
            console.log(response.data);
            
            onClose(); // Close the form after submission
            resetForm(); // Reset the form fields
            fetchBooks(); 
        } else {
            setError('Unexpected response status: ' + response.status);
        }
    } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while adding the book.');
    }
};

  const resetForm = () => {
    setFormData({
      title: '',
      ISBN_no: '',
      author: '',
      description: '',
      quantity: 1,
      out_of_stock: 0, // Reset to default minimum quantity
      due_days: 14,
    });
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Book</h2>
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
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Add Book</button>
          <button type="button" onClick={() => { resetForm(); onClose(); }} className="bg-gray-300 text-black p-2 rounded-md ml-2">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;