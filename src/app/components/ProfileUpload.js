// components/ProfileUpload.js
'use client';
import { toast } from 'react-toastify';
import userContext from '@/context/userDetails/UserContext';
import { useContext, useState } from 'react';

export default function ProfileUpload() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const context = useContext(userContext);
  const { user } = context;

  const myID = user?._id;
  
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name) {
      setMessage('Please select an image and enter your name.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', myID); // Replace with the actual user ID
    formData.append('image', image);
    formData.append('name', name);

    const response = await fetch('/api/profilePic', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      setMessage('profilePic updated successfully!');

    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="file"
        onChange={handleImageChange}
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Upload Profile
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
