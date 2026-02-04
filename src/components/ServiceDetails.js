import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, Phone, MapPin, Tag } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  async function fetchService() {
    const { data } = await supabase.from('services').select('*').eq('id', id).single();
    if (data) setService(data);
  }

  if (!service) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Details...</div>;

  const mediaList = service.media && service.media.length > 0 ? service.media : [{ url: service.image_url }];

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}><ChevronLeft /> Back</button>
      
      <div style={contentGrid}>
        {/* Left: Media Gallery */}
        <div style={mediaSection}>
          {mediaList.map((m, i) => (
            m.type === 'video' ? 
            <video key={i} src={m.url} controls style={largeMedia} /> :
            <img key={i} src={m.url} alt="" style={largeMedia} />
          ))}
        </div>

        {/* Right: Info Section */}
        <div style={infoSection}>
          <span style={badge}>{service.category}</span>
          <h1 style={mainTitle}>{service.title}</h1>
          <p style={priceTag}>Price: Negotiable / Fixed</p>
          
          <div style={descBox}>
            <h3>Description</h3>
            <p>{service.description}</p>
          </div>

          <div style={contactBox}>
            <p><MapPin size={18} /> Location: Karachi, Pakistan</p>
            <p><Phone size={18} /> Contact: +92 300 1234567</p>
            <button style={bookBtn}>Book This Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' };
const backBtn = { display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold', marginBottom: '20px' };
const contentGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' };
const mediaSection = { display: 'flex', flexDirection: 'column', gap: '15px' };
const largeMedia = { width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const infoSection = { position: 'sticky', top: '20px', height: 'fit-content' };
const badge = { background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' };
const mainTitle = { fontSize: '32px', margin: '15px 0', color: '#0f172a' };
const priceTag = { fontSize: '20px', fontWeight: 'bold', color: '#059669', marginBottom: '20px' };
const descBox = { borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '30px' };
const contactBox = { background: '#f8fafc', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' };
const bookBtn = { background: '#1e40af', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default ServiceDetails;