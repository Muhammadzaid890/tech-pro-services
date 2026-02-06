import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // Dono imports lazmi hain

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
        }
      }
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Account created. You can now log in.");
      navigate('/login');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3a8a' }}>Register Your Account</h2>
        
        <form onSubmit={handleSignup}>
          <div style={inputGroup}>
            <label>Full Name</label>
            <input style={inputStyle} type="text" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div style={inputGroup}>
            <label>Phone Number</label>
            <input style={inputStyle} type="text" placeholder="03xx-xxxxxxx" onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div style={inputGroup}>
            <label>Email Address</label>
            <input style={inputStyle} type="email" placeholder="example@mail.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div style={inputGroup}>
            <label>Password</label>
            <input style={inputStyle} type="password" placeholder="Min 6 characters" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button style={btnStyle} type="submit">Sign Up</button>
        </form>

        <p style={footerTextStyle}>
          Do you have an account already?{' '}
          <Link to="/login" style={linkStyle}>Login Here</Link>
        </p>
      </div>
    </div>
  );
}

// --- Mukammal Styling ---
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '90vh',
  backgroundColor: '#f3f4f6'
};

const formCardStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
};

const inputGroup = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '5px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  boxSizing: 'border-box',
  fontSize: '14px'
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '10px'
};

const footerTextStyle = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#4b5563'
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 'bold'
};