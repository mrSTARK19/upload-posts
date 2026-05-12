import React, { useState ,useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function Login() {
    const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/verify", {
        withCredentials: true
      })

      if (res.data.status === "success") {
       navigate("/home")
      }
      

    } catch (err) {
      navigate("/")
    }
  }

  checkAuth()
}, [])

  const handleLogin = async () => {

    // 🔴 Validation
    if (!username || !password) {
      setError("All fields are required")
      setMessage('')
      return
    }

    try {
      setError('')

      const res = await axios.post(
        "http://localhost:3000/login",
        { username, password },   // ✅ send data
        { withCredentials: true } // ✅ allow cookies
      )
      

      if (res.status === 200) {
        
        setMessage(res.data.message)
        navigate("/home")
      } else {
        setError(res.data.message)
      }

    } catch (err) {
      setError("Server error ❌")
      setMessage('')
      console.log(err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Login</h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button 
          onClick={handleLogin}
          disabled={!username || !password}
          style={styles.button}
        >
          Login
        </button>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

      </div>
    </div>
  )
}

export default Login

// 🎨 Styling
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2"
  },
  card: {
    width: "320px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  title: {
    textAlign: "center"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    textAlign: "center"
  },
  success: {
    color: "green",
    textAlign: "center"
  }
}