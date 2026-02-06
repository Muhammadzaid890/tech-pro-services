import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ServiceCard from './ServiceCard';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function Home() {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        await fetchServices();
        await fetchReviews();
      }
      setLoading(false);
    };
    checkUserAndFetch();
  }, [navigate]);

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
  }

  async function fetchReviews() {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('reviews').insert([
      { 
        comment: newReview.comment, 
        rating: parseInt(newReview.rating), 
        customer_name: user.email.split('@')[0] 
      }
    ]);

    if (error) alert(error.message);
    else {
      alert("Review Post Ho Gaya! Shukriya.");
      setNewReview({ comment: '', rating: 5 });
      fetchReviews();
    }
  };

  const getDynamicStyle = (id, color) => ({
    color: hoveredIcon === id ? color : '#cbd5e1',
    transform: hoveredIcon === id ? 'translateY(-10px)' : 'translateY(0)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    display: 'inline-block'
  });

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- PREMIUM VIDEO HERO SECTION --- */}
      <div style={heroContainer}>
        {/* CSS for Animation - Inline Style Tag */}
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-title { animation: fadeInUp 1s ease-out forwards; }
            .animate-subtitle { opacity: 0; animation: fadeInUp 1s ease-out 0.4s forwards; }
            .animate-btn { opacity: 0; animation: fadeInUp 1s ease-out 0.8s forwards; }
          `}
        </style>

        <video autoPlay loop muted playsInline style={videoBackground}>
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={heroOverlay}>
          <div style={heroContent}>
            <h1 style={heroTitle} className="animate-title">
              Find Your Dream Home in <span style={{color: '#f87171'}}>DHA Karachi</span>
            </h1>
            <p style={heroSubTitle} className="animate-subtitle">
              Exclusive Villas, Luxury Bungalows, and Prime Plots. <br/>
              Professional Real Estate Services you can trust in DHA.
            </p>
            <button 
              style={heroBtn} 
              className="animate-btn"
              onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
            >
              Explore Listings
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '40px auto', flex: 1 }}>
        <h2 style={{ textAlign: 'center', color: '#1e40af', fontSize: '32px', marginBottom: '40px' }}>OUR SERVICES</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '80px' }}>
          {services.map(service => (
            <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
          ))}
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #e2e8f0' }} />

        {/* --- REVIEWS SECTION --- */}
        <section style={{ marginTop: '60px', marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', color: '#1e40af' }}>CUSTOMER REVIEWS</h2>
          <div style={reviewBoxStyle}>
            <h4>Leave a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <select style={inputStyle} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})}>
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Very Bad)</option>
              </select>
              <textarea style={{...inputStyle, height: '80px'}} placeholder="Tell us what you think!" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
              <button type="submit" style={btnStyle}>Post Review</button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {reviews.map(rev => (
              <div key={rev.id} style={revCardStyle}>
                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>{rev.customer_name}</div>
                <div style={{ color: '#facc15', margin: '5px 0' }}>{"⭐".repeat(rev.rating)}</div>
                <p style={{ fontSize: '14px', color: '#444' }}>{rev.comment}</p>
                <small style={{ color: '#999' }}>{new Date(rev.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>

        {selectedService && <BookingForm service={selectedService} onClose={() => setSelectedService(null)} />}
      </div>

      {/* --- FOOTER --- */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerCol}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>DHA VILLAS & BUNGALOWS</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              Your trusted partner for all premium real estate services in DHA Karachi.
            </p>
          </div>
          <div style={footerCol}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Follow Us</h4>
            <div style={socialIconContainer}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={getDynamicStyle('insta', '#E4405F')} onMouseEnter={() => setHoveredIcon('insta')} onMouseLeave={() => setHoveredIcon(null)}><FaInstagram size={30} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={getDynamicStyle('fb', '#1877F2')} onMouseEnter={() => setHoveredIcon('fb')} onMouseLeave={() => setHoveredIcon(null)}><FaFacebook size={30} /></a>
              <a href="mailto:support@dhavillasandbungalows.com" style={getDynamicStyle('mail', '#DB4437')} onMouseEnter={() => setHoveredIcon('mail')} onMouseLeave={() => setHoveredIcon(null)}><FaEnvelope size={30} /></a>
            </div>
          </div>
          <div style={footerCol}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Contact</h4>
            <p style={contactItem}><FaMapMarkerAlt style={{marginRight: '10px'}}/> DHA, Karachi</p>
            <p style={contactItem}><FaPhoneAlt style={{marginRight: '10px'}}/> +92 316 2802558</p>
          </div>
        </div>
        <div style={copyrightStyle}>© {new Date().getFullYear()} DHA VILLAS & BUNGALOWS. All Rights Reserved.</div>
      </footer>
    </div>
  );
}

// --- STYLES ---
const heroContainer = { position: 'relative', height: '85vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const videoBackground = { position: 'absolute', top: '50%', left: '50%', minWidth: '100%', minHeight: '100%', width: 'auto', height: 'auto', transform: 'translate(-50%, -50%)', objectFit: 'cover', zIndex: '-1' };
const heroOverlay = { position: 'absolute', inset: '0', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' };
const heroContent = { textAlign: 'center', maxWidth: '900px', color: 'white' };
const heroTitle = { fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1', textTransform: 'uppercase' };
const heroSubTitle = { fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', marginBottom: '30px', color: '#f1f5f9', fontWeight: '300' };
const heroBtn = { background: '#1e40af', color: 'white', padding: '16px 45px', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' };
const reviewBoxStyle = { background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0', maxWidth: '500px', margin: '0 auto' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const revCardStyle = { background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const footerStyle = { background: '#0f172a', color: 'white', padding: '60px 20px 20px 20px', marginTop: 'auto' };
const footerContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' };
const footerCol = { display: 'flex', flexDirection: 'column' };
const socialIconContainer = { display: 'flex', gap: '20px' };
const contactItem = { color: '#cbd5e1', fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '12px' };
const copyrightStyle = { textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', fontSize: '13px', color: '#94a3b8' };