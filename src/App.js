import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './components/Home';
import Admin from './components/Admin';
import Signup from './components/Signup';
import Login from './components/Login';
// App.js ke upar ye lazmi likhein
import ServiceDetails from './components/ServiceDetails';


function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin email check
  const ADMIN_EMAIL = "admin@gmail.com"; 

  useEffect(() => {
    // --- 1. LIVE CHAT (Tawk.to) INTEGRATION ---
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6981a4035a765b1c399b1b6d/1jgh6hccd';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // --- 2. AUTHENTICATION LOGIC ---
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logged out successfully!");
  };

  return (
    <Router>
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>DHA VILLAS & BUNGALOWS</div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user && <Link to="/home" style={linkStyle}>Home</Link>}
          
          {/* Admin link sirf tab dikhega jab aap admin email se login honge */}
          {isAdmin && <Link to="/admin" style={adminLinkStyle}>Admin Panel</Link>}
          
          {user ? (
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/signup" style={linkStyle}>Signup</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={isAdmin ? <Admin /> : <Navigate to="/home" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// --- Styles ---
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px 30px',
  background: '#1e40af',
  color: 'white',
  alignItems: 'center'
};

const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '14px' };

const adminLinkStyle = {
  ...linkStyle,
  background: '#dc2626',
  padding: '5px 12px',
  borderRadius: '5px',
  fontWeight: 'bold'
};

const logoutBtnStyle = {
  background: 'transparent',
  border: '1px solid white',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default App;