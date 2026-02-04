import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, Phone, MapPin, X, ChevronRight } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState(null); // Fullscreen view ke liye

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchService();
  }, [id]);

  // Price ko words mein convert karne ka function
  const formatPriceToWords = (num) => {
    if (!num || isNaN(num)) return "";
    const n = parseInt(num);
    const inWords = (n) => {
      const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      if (n < 1000) return inWords(Math.floor(n / 100)) + "Hundred " + (n % 100 !== 0 ? "and " + inWords(n % 100) : "");
      if (n < 100000) return inWords(Math.floor(n / 1000)) + "Thousand " + (n % 1000 !== 0 ? inWords(n % 1000) : "");
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + "Lakh " + (n % 100000 !== 0 ? inWords(n % 100000) : "");
      return inWords(Math.floor(n / 10000000)) + "Crore " + (n % 10000000 !== 0 ? inWords(n % 10000000) : "");
    };
    return inWords(n).trim() + " Rupees Only";
  };

  async function fetchService() {
    const { data } = await supabase.from('services').select('*').eq('id', id).single();
    if (data) setService(data);
  }

  if (!service) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Details...</div>;

  const mediaList = service.media && Array.isArray(service.media) && service.media.length > 0 
    ? service.media 
    : (service.image_url ? [{ url: service.image_url, type: 'image' }] : []);

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        <ChevronLeft size={20} /> Back to Services
      </button>

      {/* --- PART 1: POSTER GRID GALLERY --- */}
      <div style={posterGrid}>
        {mediaList.slice(0, 5).map((m, i) => (
          <div 
            key={i} 
            style={i === 0 ? mainImageWrapper : thumbImageWrapper} 
            onClick={() => setSelectedImgIdx(i)}
          >
            {m.type === 'video' ? (
              <video src={m.url} style={imgFill} />
            ) : (
              <img src={m.url} alt="" style={imgFill} />
            )}
            {/* Show "More" overlay on the last thumbnail if there are > 5 images */}
            {i === 4 && mediaList.length > 5 && (
              <div style={overlayStyle}>+{mediaList.length - 5} Photos</div>
            )}
          </div>
        ))}
      </div>

      <div style={contentLayout}>
        {/* --- PART 2: LEFT SIDE INFO --- */}
        <div style={leftCol}>
          <div style={priceCard}>
            <h1 style={priceText}>PKR {service.price?.toLocaleString() || "N/A"}</h1>
            <p style={priceWords}>{formatPriceToWords(service.price)}</p>
            <h2 style={titleText}>{service.title}</h2>
            <p style={locationText}><MapPin size={16} /> Karachi, Pakistan</p>
          </div>

          <div style={detailCard}>
            <h3>Description</h3>
            <p style={descText}>{service.description}</p>
          </div>
        </div>

        {/* --- PART 3: RIGHT SIDE CONTACT --- */}
        <div style={rightCol}>
          <div style={contactCard}>
            <p style={{fontWeight: 'bold', marginBottom: '15px'}}>Contact Seller</p>
            <div style={sellerInfo}>
              <div style={avatar}>AD</div>
              <span>Tech Pro Contractor</span>
            </div>
            <button style={callBtn} onClick={() => window.open(`tel:+923001234567`)}>
              <Phone size={18} /> +92 300 1234567
            </button>
            <button style={whatsappBtn} onClick={() => window.open(`https://wa.me/923001234567`)}>
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* --- PART 4: FULLSCREEN LIGHTBOX MODAL --- */}
      {selectedImgIdx !== null && (
        <div style={modalOverlay} onClick={() => setSelectedImgIdx(null)}>
          <button style={closeBtn}><X size={30} /></button>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            {mediaList[selectedImgIdx].type === 'video' ? (
              <video src={mediaList[selectedImgIdx].url} controls autoPlay style={fullscreenMedia} />
            ) : (
              <img src={mediaList[selectedImgIdx].url} style={fullscreenMedia} alt="" />
            )}
          </div>
          {/* Next/Prev buttons in Modal */}
          {selectedImgIdx > 0 && <button style={prevBtn} onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(selectedImgIdx-1)}}><ChevronLeft size={40}/></button>}
          {selectedImgIdx < mediaList.length - 1 && <button style={nextBtn} onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(selectedImgIdx+1)}}><ChevronRight size={40}/></button>}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const containerStyle = { maxWidth: '1200px', margin: '20px auto', padding: '0 15px' };
const backBtn = { display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold', marginBottom: '15px' };

// Poster Grid
const posterGrid = { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '220px 220px', gap: '8px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', marginBottom: '20px' };
const mainImageWrapper = { gridRow: '1 / span 2', position: 'relative' };
const thumbImageWrapper = { position: 'relative' };
const imgFill = { width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' };
const overlayStyle = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' };

const contentLayout = { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' };
const leftCol = { display: 'flex', flexDirection: 'column', gap: '20px' };
const rightCol = { display: 'flex', flexDirection: 'column', gap: '20px' };

const priceCard = { background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const priceText = { fontSize: '32px', margin: '0', color: '#1e293b' };
const priceWords = { color: '#059669', fontWeight: 'bold', marginTop: '5px', fontSize: '14px' };
const titleText = { fontSize: '24px', margin: '15px 0 5px 0', color: '#334155' };
const locationText = { display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '14px' };

const detailCard = { ...priceCard };
const descText = { lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-line' };

const contactCard = { ...priceCard, position: 'sticky', top: '20px' };
const sellerInfo = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const avatar = { width: '45px', height: '45px', borderRadius: '50%', background: '#1e40af', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const callBtn = { width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' };
const whatsappBtn = { ...callBtn, background: '#25D366' };

// Modal Styles
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContent = { maxWidth: '90%', maxHeight: '90%' };
const fullscreenMedia = { maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' };
const closeBtn = { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' };
const prevBtn = { position: 'absolute', left: '20px', color: 'white', background: 'none', border: 'none', cursor: 'pointer' };
const nextBtn = { ...prevBtn, left: 'auto', right: '20px' };

export default ServiceDetails;