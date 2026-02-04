import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, Phone, MapPin } from 'lucide-react'; // Tag hata diya kyunke use nahi ho raha

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    // Page ko hamesha top par load karein
    window.scrollTo(0, 0);
    fetchService();
  }, [id]);

  async function fetchService() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) setService(data);
    } catch (err) {
      console.error("Error fetching service:", err.message);
    }
  }

  if (!service) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Details...</div>;

  // Media list handle karne ka safe tareeqa
  const mediaList = service.media && Array.isArray(service.media) && service.media.length > 0 
    ? service.media 
    : (service.image_url ? [{ url: service.image_url, type: 'image' }] : []);

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        <ChevronLeft size={20} /> Back
      </button>
      
      <div style={contentGrid}>
        {/* Left: Media Gallery */}
        <div style={mediaSection}>
          {mediaList.length > 0 ? (
            mediaList.map((m, i) => (
              m.type === 'video' ? 
              <video key={i} src={m.url} controls style={largeMedia} /> :
              <img key={i} src={m.url} alt={service.title} style={largeMedia} />
            ))
          ) : (
            <div style={{padding: '20px', background: '#f1f5f9', borderRadius: '12px'}}>No images available</div>
          )}
        </div>

        {/* Right: Info Section */}
        <div style={infoSection}>
          <span style={badge}>{service.category}</span>
          <h1 style={mainTitle}>{service.title}</h1>
          <p style={priceTag}>Price: Negotiable / Fixed</p>
          
          <div style={descBox}>
            <h3 style={{marginBottom: '10px'}}>Description</h3>
            <p style={{lineHeight: '1.6', color: '#475569'}}>{service.description}</p>
          </div>

          <div style={contactBox}>
            <p style={contactItem}><MapPin size={18} color="#1e40af" /> Location: Karachi, Pakistan</p>
            <p style={contactItem}><Phone size={18} color="#1e40af" /> Contact: +92 300 1234567</p>
            <button style={bookBtn}>Book This Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { maxWidth: '1100px', margin: '40px auto', padding: '0 20px' };
const backBtn = { display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold', marginBottom: '20px' };
const contentGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' };
const mediaSection = { display: 'flex', flexDirection: 'column', gap: '15px' };
const largeMedia = { width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'block' };
const infoSection = { position: 'sticky', top: '20px', height: 'fit-content' };
const badge = { background: '#dbeafe', color: '#1e40af', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' };
const mainTitle = { fontSize: '32px', margin: '15px 0', color: '#0f172a', fontWeight: '800' };
const priceTag = { fontSize: '20px', fontWeight: 'bold', color: '#059669', marginBottom: '20px' };
const descBox = { borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '30px' };
const contactBox = { background: '#f8fafc', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #e2e8f0' };
const contactItem = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#334155' };
const bookBtn = { background: '#1e40af', color: 'white', padding: '16px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px', transition: 'all 0.2s' };

export default ServiceDetails;