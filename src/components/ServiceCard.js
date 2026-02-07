import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
    <>
      {/* --- MAIN CARD --- */}
      <div 
        style={cardStyle} 
        onClick={() => setShowDetail(true)}
        className="service-card-custom"
      >
        <div style={imageContainer}>
          {mediaList[currentIdx]?.type === 'video' ? (
            <video src={mediaList[currentIdx].url} style={imageStyle} autoPlay muted loop />
          ) : (
            <img src={mediaList[currentIdx]?.url} alt={service.title} style={imageStyle} />
          )}
          <div style={categoryBadge}>{service.category}</div>
          <div style={priceBadge}>PKR {service.price?.toLocaleString()}</div>
        </div>

        <div style={contentStyle}>
          <h3 style={titleStyle}>{service.title}</h3>
          <p style={cardDescStyle}>{service.description}</p>
          <div style={{color: '#1e40af', fontWeight: 'bold', fontSize: '14px'}}>View Details →</div>
        </div>
      </div>

      {/* --- VIP DETAIL MODAL --- */}
      {showDetail && (
        <div style={overlayStyle} onClick={() => setShowDetail(false)}>
          <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
            {/* Close Icon */}
            <button onClick={() => setShowDetail(false)} style={closeBtn}><X size={24}/></button>

            {/* Slider Section */}
            <div style={detailSlider} onClick={() => setIsGalleryOpen(true)}>
              {mediaList[currentIdx]?.type === 'video' ? (
                <video src={mediaList[currentIdx].url} style={detailImage} autoPlay muted loop />
              ) : (
                <img src={mediaList[currentIdx]?.url} alt="detail" style={detailImage} />
              )}
              
              {mediaList.length > 1 && (
                <>
                  <button onClick={prevImage} style={arrowLeft}><ChevronLeft size={24}/></button>
                  <button onClick={nextImage} style={arrowRight}><ChevronRight size={24}/></button>
                  <div style={imgCounter}>{currentIdx + 1} / {mediaList.length}</div>
                </>
              )}
            </div>

            {/* Content Section */}
            <div style={detailContent}>
              <h2 style={detailTitle}>{service.title}</h2>
              <div style={detailPrice}>PKR {service.price?.toLocaleString()}</div>
              
              <div style={divider}></div>

              <div style={descBox}>
                <h4 style={{marginBottom: '8px', color: '#1e293b'}}>Description</h4>
                <p style={isExpanded ? fullDesc : shortDesc}>
                  {service.description}
                </p>
                <button onClick={() => setIsExpanded(!isExpanded)} style={readMoreBtn}>
                  {isExpanded ? <>Show Less <ChevronUp size={18}/></> : <>Read More <ChevronDown size={18}/></>}
                </button>
              </div>
            </div>

            {/* Bottom Contact Buttons */}
            <div style={actionButtons}>
              <a href="tel:+923162802558" style={callBtn}>
                <Phone size={20} fill="currentColor"/> Call Now
              </a>
              <a href={`https://wa.me/923162802558?text=Interested in ${service.title}`} target="_blank" rel="noreferrer" style={waBtn}>
                <MessageCircle size={20} fill="currentColor"/> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- FULLSCREEN GALLERY --- */}
      {isGalleryOpen && (
        <div style={galleryOverlay} onClick={() => setIsGalleryOpen(false)}>
          <button style={closeGallery}><X size={35} color="white"/></button>
          <img src={mediaList[currentIdx]?.url} alt="full screen" style={fullScreenImg} />
        </div>
      )}
    </>
  );
};

// --- STYLES ---
const cardStyle = { cursor: 'pointer', background: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' };
const imageContainer = { position: 'relative', width: '100%', height: '200px', background: '#000' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const categoryBadge = { position: 'absolute', top: '10px', right: '10px', background: '#1e40af', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 };
const priceBadge = { position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' };
const contentStyle = { padding: '15px' };
const titleStyle = { fontSize: '17px', fontWeight: '700', margin: '0 0 8px 0', color: '#0f172a' };
const cardDescStyle = { fontSize: '13px', color: '#64748b', height: '40px', overflow: 'hidden', marginBottom: '10px' };

// Detail Modal Styles
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' };
const modalContainer = { background: 'white', width: '100%', maxWidth: '500px', height: '90vh', borderTopLeftRadius: '25px', borderTopRightRadius: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' };
const closeBtn = { position: 'absolute', top: '15px', right: '15px', zIndex: 100, background: 'white', border: 'none', borderRadius: '50%', padding: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' };
const detailSlider = { position: 'relative', width: '100%', minHeight: '300px', background: '#000' };
const detailImage = { width: '100%', height: '300px', objectFit: 'cover' };
const imgCounter = { position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' };

const detailContent = { padding: '20px', flex: 1 };
const detailTitle = { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '5px' };
const detailPrice = { fontSize: '20px', fontWeight: '700', color: '#1e40af', marginBottom: '15px' };
const divider = { height: '1px', background: '#f1f5f9', width: '100%', margin: '15px 0' };

const descBox = { paddingBottom: '100px' };
const shortDesc = { fontSize: '15px', color: '#475569', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const fullDesc = { fontSize: '15px', color: '#475569', lineHeight: '1.6' };
const readMoreBtn = { background: 'none', border: 'none', color: '#1e40af', fontWeight: 'bold', marginTop: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };

const actionButtons = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px', background: 'white', padding: '15px', display: 'flex', gap: '10px', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)', boxSizing: 'border-box' };
const callBtn = { flex: 1, background: '#0f172a', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' };
const waBtn = { flex: 1, background: '#25D366', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' };

const arrowLeft = { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' };
const arrowRight = { ...arrowLeft, left: 'auto', right: '10px' };

const galleryOverlay = { position: 'fixed', inset: 0, background: '#000', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const closeGallery = { position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', cursor: 'pointer' };
const fullScreenImg = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };

export default ServiceCard;