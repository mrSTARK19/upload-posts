import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Add this state at the top with your other useState hooks
  const [showModal, setShowModal] = useState(false);

  // Fetch all images
  const fetchData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/my-images',
        { withCredentials: true }
      );
      setData(res.data);
    } catch (error) {
      console.log('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Store selected image
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload image
  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      // Must match upload.single('img') in backend
      formData.append('img', image);

      const res = await axios.post(
        'http://localhost:3000/send',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(res.data.message);

      // Add newly uploaded image at the top
      setData((prevData) => [res.data.data, ...prevData]);

      // Clear selected image
      setImage(null);

      // Clear file input
      document.getElementById('imageInput').value = '';
    } catch (error) {
      console.error(
        'Upload failed:',
        error.response?.data?.error || error.message
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/delete-image/${id}`,
        { withCredentials: true }
      );

      console.log(res.data.message);

      // Remove deleted image from UI
      setData((prevData) =>
        prevData.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(
        'Error deleting image:',
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f8fafc, #e2e8f0)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
           
{/* Header */}
<div
  style={{
    maxWidth: '900px',
    margin: '0 auto 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <h1
    style={{
      color: '#1e293b',
      fontSize: '36px',
      fontWeight: 'bold',
      margin: 0,
    }}
  >
    My Images Dashboard
  </h1>

  <button
    onClick={() => setShowModal(true)}
    style={{
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '999px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    }}
  >
    Post Image
  </button>
</div>

{/* Upload Modal */}
{showModal && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        width: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h2
        style={{
          margin: 0,
          textAlign: 'center',
          color: '#1e293b',
        }}
      >
        Upload Image
      </h2>

      {/* Hidden File Input */}
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Choose File Button */}
      <label
        htmlFor="imageInput"
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '999px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Choose File
      </label>

      {/* Selected File Name */}
      <p
        style={{
          margin: 0,
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          wordBreak: 'break-word',
        }}
      >
        {image ? image.name : 'No file chosen'}
      </p>

      {/* Upload Button */}
      <button
        onClick={async () => {
          await handleUpload();
          setShowModal(false);
        }}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? '#94a3b8' : '#10b981',
          color: '#ffffff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '999px',
          fontWeight: 'bold',
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => setShowModal(false)}
        style={{
          backgroundColor: '#e2e8f0',
          color: '#1e293b',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '999px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* Images List */}
      {data.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '18px',
          }}
        >
          No images found.
        </p>
      ) : (
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {data.map((item) => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Image */}
              <img
                src={item.url}
                alt="Uploaded"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                }}
              />

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;