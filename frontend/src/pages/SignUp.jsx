import React, { useState } from 'react'
import axios from 'axios'

function Signup() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async () => {

    // 🔴 Validation
    if (!username || !password || !confirmPassword) {
      setError("All fields are required")
      setMessage('')
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setMessage('')
      return
    }

    try {
      setError('')

      const res = await axios.post(
        "http://localhost:3000/signin",
        { username, password },
        { withCredentials: true }
      )

      if (res.data.status == "failure"){
       setError("USER ALREADY EXISTS")
      setMessage('') 
      return
      }

      setMessage("Account created successfully ✅")
      console.log(res.data.status)

      // optional: clear fields
      setUsername('')
      setPassword('')
      setConfirmPassword('')

    } catch (err) {
      setMessage('')
      setError("Signup failed ❌")
      console.log(err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Sign Up</h2>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSignup} style={styles.button}>
          Sign Up
        </button>

        {/* 🔴 Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* ✅ Success */}
        {message && <p style={styles.success}>{message}</p>}

      </div>
    </div>
  )
}

export default Signup

// 🎨 Same styling as login
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
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "14px"
  },
  success: {
    color: "green",
    textAlign: "center",
    fontSize: "14px"
  }
}