import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

const handleDelete = async (id) => {
  try {
    // Call backend delete API
    const res = await axios.delete(
      `http://localhost:3000/delete-image/${id}`,
      { withCredentials: true }
    );

    console.log(res.data.message);

    // Update UI immediately without refreshing the page
    setData((prevData) =>
      prevData.filter((item) => item._id !== id)
    );
  } catch (error) {
    console.error(
      "Error deleting image:",
      error.response?.data?.message || error.message
    );
  }
};

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#1e293b',
          fontSize: '32px',
        }}
      >
        My Images Dashboard
      </h1>

      {/* No Data */}
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
                  transition: '0.3s',
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = '#dc2626')
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = '#ef4444')
                }
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