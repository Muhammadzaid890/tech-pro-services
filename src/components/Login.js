import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("Login Successful!");
      navigate('/');
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input style={inputStyle} type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button style={btnStyle} type="submit">Login</button>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Don't have an account? <a href="/signup">Sign up Here</a>
        </p>
      </form>
    </div>
  );
}

// --- YE SECTION MISSING THA, ISAY LAZMI COPY KAREIN ---
const containerStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '80vh' 
};

const formStyle = { 
  width: '100%', 
  maxWidth: '400px', 
  padding: '30px', 
  border: '1px solid #ddd', 
  borderRadius: '12px', 
  background: '#ffffff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
};

const inputStyle = { 
  width: '100%', 
  padding: '12px', 
  marginBottom: '15px', 
  borderRadius: '6px', 
  border: '1px solid #ccc',
  boxSizing: 'border-box' 
};

const btnStyle = { 
  width: '100%', 
  padding: '12px', 
  background: '#2563eb', 
  color: 'white', 
  border: 'none', 
  borderRadius: '6px', 
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};