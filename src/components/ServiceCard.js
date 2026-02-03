import React from 'react';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div style={cardStyle}>
      {/* Image Section */}
      <div style={imageContainer}>
        <img 
          src={service.image_url || 'https://placehold.co/400x250?text=No+Image'} 
          alt={service.title} 
          style={imageStyle} 
        />
        <div style={categoryBadge}>{service.category}</div>
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{service.title}</h3>
        <p style={descStyle}>{service.description}</p>
        
        <button 
          style={buttonStyle} 
          onClick={() => onBook(service)}
          onMouseOver={(e) => e.target.style.background = '#1e3a8a'}
          onMouseOut={(e) => e.target.style.background = '#1e40af'}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// --- Modern Glassmorphism & Shadow Styles ---
const cardStyle = {
  background: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f0f0f0'
};

const imageContainer = {
  position: 'relative',
  width: '100%',
  height: '200px',
  overflow: 'hidden'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease'
};

const categoryBadge = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'rgba(30, 64, 175, 0.9)',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  backdropFilter: 'blur(5px)'
};

const contentStyle = {
  padding: '20px',
  textAlign: 'left'
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0 0 10px 0',
  textTransform: 'capitalize'
};

const descStyle = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 20px 0',
  lineHeight: '1.5',
  height: '42px', // Sirf 2 lines dikhayega
  overflow: 'hidden'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#1e40af',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
  fontSize: '14px'
};

export default ServiceCard;