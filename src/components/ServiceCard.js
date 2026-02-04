import React from 'react';

const ServiceCard = ({ service, onBook }) => {
  // --- Naya Logic: Image nikalne ka tarika ---
  // Agar 'media' array mein data hai toh pehli image/video ka URL lo, 
  // warna purana 'image_url' check karo.
  const displayImage = (service.media && service.media.length > 0) 
    ? service.media[0].url 
    : (service.image_url || 'https://placehold.co/400x250?text=No+Image');

  return (
    <div style={cardStyle} className="service-card">
      {/* Image Section */}
      <div style={imageContainer}>
        {/* Agar media ka pehla item video hai toh video tag dikhao, warna image */}
        {service.media && service.media[0]?.type === 'video' ? (
          <video src={displayImage} style={imageStyle} muted />
        ) : (
          <img 
            src={displayImage} 
            alt={service.title} 
            style={imageStyle} 
          />
        )}
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

// --- Baki Styles Wahi Rahenge ---
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
  overflow: 'hidden',
  background: '#f1f5f9' // Background color jab tak image load ho
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
  height: '42px', 
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