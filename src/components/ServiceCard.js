import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service, onBook }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  const mediaList = service.media && service.media.length > 0 
    ? service.media 
    : [{ url: service.image_url, type: 'image' }];

  const nextImage = (e) => {
    e.stopPropagation();
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
      className="service-card-custom" /* Animation class yahan add ki hai */
    >
      {/* Image/Slider Section */}
      <div style={imageContainer}>
        {mediaList[currentIdx]?.type === 'video' ? (
          <video src={mediaList[currentIdx].url} style={imageStyle} autoPlay muted loop />
        ) : (
          <img src={mediaList[currentIdx]?.url} alt={service.title} style={imageStyle} />
        )}

        {mediaList.length > 1 && (
          <>
            <button onClick={prevImage} style={arrowLeft} className="slider-arrow"><ChevronLeft size={20} /></button>
            <button onClick={nextImage} style={arrowRight} className="slider-arrow"><ChevronRight size={20} /></button>
            
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
          className="book-now-btn"
          style={buttonStyle} 
          onClick={(e) => {
            e.stopPropagation();
            onBook(service);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// --- Styles (Thori refinements ke saath) ---
const cardStyle = { 
  cursor: 'pointer', 
  background: '#fff', 
  borderRadius: '16px', 
  overflow: 'hidden', 
  display: 'flex', 
  flexDirection: 'column', 
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease-in-out' // Smoothness ke liye
};

const imageContainer = { position: 'relative', width: '100%', height: '220px', background: '#000', overflow: 'hidden' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' };
const categoryBadge = { position: 'absolute', top: '12px', right: '12px', background: '#1e40af', color: 'white', padding: '5px 14px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', zIndex: 10, textTransform: 'uppercase', letterSpacing: '0.5px' };
const contentStyle = { padding: '20px' };
const titleStyle = { fontSize: '19px', fontWeight: '700', margin: '0 0 10px 0', color: '#0f172a' };
const descStyle = { fontSize: '14px', color: '#64748b', height: '42px', overflow: 'hidden', marginBottom: '20px', lineHeight: '1.5' };
const buttonStyle = { width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' };

const arrowLeft = { position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', zIndex: 10, transition: 'all 0.2s' };
const arrowRight = { ...arrowLeft, left: 'auto', right: '8px' };
const dotsContainer = { position: 'absolute', bottom: '12px', width: '100%', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 };
const dot = { width: '7px', height: '7px', borderRadius: '50%', transition: 'all 0.3s' };

export default ServiceCard;