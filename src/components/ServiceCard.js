import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service, onBook }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  // Media list handle karne ka logic
  const mediaList = service.media && service.media.length > 0 
    ? service.media 
    : [{ url: service.image_url, type: 'image' }];

  const nextImage = (e) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    setCurrentIdx((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  return (
    <div 
      style={cardStyle} 
      onClick={() => navigate(`/service/${service.id}`)}
      className="clickable-card"
    >
      {/* Image/Slider Section */}
      <div style={imageContainer}>
        {mediaList[currentIdx]?.type === 'video' ? (
          <video src={mediaList[currentIdx].url} style={imageStyle} />
        ) : (
          <img src={mediaList[currentIdx]?.url} alt={service.title} style={imageStyle} />
        )}

        {/* Agar 1 se zyada images hain toh Arrows dikhao */}
        {mediaList.length > 1 && (
          <>
            <button onClick={prevImage} style={arrowLeft}><ChevronLeft size={20} /></button>
            <button onClick={nextImage} style={arrowRight}><ChevronRight size={20} /></button>
            
            {/* Dots indicator */}
            <div style={dotsContainer}>
              {mediaList.map((_, i) => (
                <div key={i} style={{...dot, backgroundColor: i === currentIdx ? 'white' : 'rgba(255,255,255,0.5)'}} />
              ))}
            </div>
          </>
        )}
        
        <div style={categoryBadge}>{service.category}</div>
      </div>

      <div style={contentStyle}>
        <h3 style={titleStyle}>{service.title}</h3>
        <p style={descStyle}>{service.description}</p>
        <button 
          style={buttonStyle} 
          onClick={(e) => {
            e.stopPropagation(); // Card click se bachne ke liye
            onBook(service);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// --- Styles ---
const cardStyle = { cursor: 'pointer', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', transition: 'transform 0.2s' };
const imageContainer = { position: 'relative', width: '100%', height: '220px', background: '#000' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const categoryBadge = { position: 'absolute', top: '10px', right: '10px', background: 'rgba(30, 64, 175, 0.9)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', zIndex: 10 };
const contentStyle = { padding: '15px' };
const titleStyle = { fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' };
const descStyle = { fontSize: '14px', color: '#64748b', height: '40px', overflow: 'hidden', marginBottom: '15px' };
const buttonStyle = { width: '100%', padding: '10px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

const arrowLeft = { position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', zIndex: 10 };
const arrowRight = { ...arrowLeft, left: 'auto', right: '5px' };
const dotsContainer = { position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 10 };
const dot = { width: '6px', height: '6px', borderRadius: '50%', transition: 'all 0.3s' };

export default ServiceCard;