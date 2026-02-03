import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '15px 30px', 
      background: '#1e40af', 
      color: 'white' 
    }}>
      <h3 style={{ margin: 0 }}>TECH PRO SERVICES</h3>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin Panel</Link>
      </div>
    </nav>
  );
}