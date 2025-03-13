// src/SignupPage.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // import useNavigate
import './SignupPage.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // initialize navigate

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/notes'); // Redirect to the notes page after successful signup
    } catch (error) {
      console.error("Error signing up:", error);
      // Display an error message accordingly
    }
  };

  return (
    <div className="signup-container">
      <h2>🌸 Create Your Account 🌸</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
  );
};

export default SignupPage;