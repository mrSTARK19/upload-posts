import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
useEffect(() => {

  const init = async () => {
    try {
      // ✅ Step 1: Verify user
      const authRes = await axios.get("http://localhost:3000/verify", {
        withCredentials: true
      })
        console.log(authRes)
      if (authRes.data.status !== "success") {
        navigate("/")
        return   // ❗ stop everything
      }

      // ✅ Step 2: Fetch data only if authorized
      const res = await axios.get("http://localhost:3000/images", {
        withCredentials: true
      })

      setData(res.data)

    } catch (err) {
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  init()

}, [])

  return (
    <div style={styles.container}>

      {/* 🔥 Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>PixeL NeST</h2>
        <button style={styles.dashboardBtn} onClick={()=>{navigate("/dashboard")}}>Dashboard</button>
      </div>

      {/* 🔽 Content */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No images found</p>
      ) : (
        <div style={styles.grid}>
          {data.map((item, index) => (
            <div key={index} style={styles.card}>
              <img
                src={item.url}
                alt="uploaded"
                style={styles.image}
              />
              <p style={styles.username}>{item.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home

const styles = {
  container: {
    padding: "20px",
    background: "#f5f5f5",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0
  },

  dashboardBtn: {
    background: "black",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover"
  },

  username: {
    padding: "10px",
    fontWeight: "bold"
  }
}