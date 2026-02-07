import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ServiceCard from './ServiceCard';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom';
// FaGoogle yahan import kar liya hai
import { FaInstagram, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaGoogle } from 'react-icons/fa';

export default function Home() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {/* --- HERO SECTION --- */}
      <div style={heroContainer}>
        <style>
          {`
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            .animate-title { animation: fadeInUp 1s ease-out forwards; }
            .animate-subtitle { opacity: 0; animation: fadeInUp 1s ease-out 0.4s forwards; }
            .animate-btn { opacity: 0; animation: fadeInUp 1s ease-out 0.8s forwards; }
            video { object-fit: cover !important; }
            .service-card-custom { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important; }
            .service-card-custom:hover { transform: translateY(-12px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #1e40af !important; }
            .service-card-custom:hover img { transform: scale(1.08); }
          `}
        </style>

        <video autoPlay loop muted playsInline style={videoBackground}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div style={heroOverlay}>
          <div style={heroContent}>
            <h1 style={heroTitle} className="animate-title">
              Find Your Dream Home in <br />
              <span style={{color: '#f87171', whiteSpace: 'nowrap'}}>DHA Karachi</span>
            </h1>
            <p style={heroSubTitle} className="animate-subtitle">
              Exclusive Villas, Luxury Bungalows, and Prime Plots. <br/>
              Professional Real Estate Services you can trust in DHA.
            </p>
            <button style={heroBtn} className="animate-btn" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
              Explore Listings
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '40px auto', flex: 1 }}>
        
        {/* --- SEARCH BAR --- */}
        <div style={searchContainer}>
          <div style={searchWrapper}>
            <FaSearch style={{ color: '#94a3b8', marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Search by Title, Category (e.g. Villa), or Location..." 
              style={searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e40af', fontSize: '32px', marginBottom: '40px', fontWeight: '800' }}>OUR PROPERTIES</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#f8fafc', borderRadius: '15px', border: '2px dashed #cbd5e1' }}>
              <h3 style={{ color: '#64748b' }}>No property listed for "{searchTerm}"</h3>
              <button onClick={() => setSearchTerm('')} style={{ marginTop: '10px', color: '#1e40af', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Clear Search</button>
            </div>
          )}
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #e2e8f0' }} />

        {/* --- REVIEWS SECTION --- */}
        <section style={{ marginTop: '60px', marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', color: '#1e40af', fontWeight: '800' }}>CUSTOMER REVIEWS</h2>
          <div style={reviewBoxStyle}>
            <h4 style={{ marginBottom: '15px' }}>Leave a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <select style={inputStyle} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})}>
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Very Bad)</option>
              </select>
              <textarea style={{...inputStyle, height: '100px'}} placeholder="Tell us what you think!" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
              <button type="submit" style={btnStyle}>Post Review</button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {reviews.map(rev => (
              <div key={rev.id} style={revCardStyle}>
                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>{rev.customer_name}</div>
                <div style={{ color: '#facc15', margin: '5px 0' }}>{"⭐".repeat(rev.rating)}</div>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4' }}>{rev.comment}</p>
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
              
              {/* --- NEW GOOGLE ICON ADDED HERE --- */}
              <a href="YOUR_GOOGLE_MAPS_LINK" target="_blank" rel="noreferrer" style={getDynamicStyle('google', '#4285F4')} onMouseEnter={() => setHoveredIcon('google')} onMouseLeave={() => setHoveredIcon(null)}><FaGoogle size={30} /></a>
              
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

// Styles remains same as your original code
const searchContainer = { display: 'flex', justifyContent: 'center', marginBottom: '50px', marginTop: '-20px' };
const searchWrapper = { display: 'flex', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '50px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' };
const searchInput = { border: 'none', outline: 'none', width: '100%', fontSize: '16px', color: '#1e293b' };
const heroContainer = { position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const videoBackground = { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover', zIndex: '-1' };
const heroOverlay = { position: 'absolute', inset: '0', background: 'rgba(0, 0, 0, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' };
const heroContent = { textAlign: 'center', maxWidth: '1100px', color: 'white' };
const heroTitle = { fontSize: 'clamp(2rem, 5.5vw, 4.8rem)', fontWeight: '900', marginBottom: '25px', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '-1px' };
const heroSubTitle = { fontSize: 'clamp(0.9rem, 2vw, 1.25rem)', marginBottom: '40px', color: '#f1f5f9', fontWeight: '300', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.6' };
const heroBtn = { background: '#1e40af', color: 'white', padding: '20px 55px', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '1px' };
const reviewBoxStyle = { background: '#f8fafc', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px' };
const btnStyle = { width: '100%', padding: '14px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const revCardStyle = { background: 'white', padding: '25px', borderRadius: '18px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const footerStyle = { background: '#0f172a', color: 'white', padding: '80px 20px 20px 20px', marginTop: 'auto' };
const footerContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' };
const footerCol = { display: 'flex', flexDirection: 'column' };
const socialIconContainer = { display: 'flex', gap: '25px' };
const contactItem = { color: '#cbd5e1', fontSize: '15px', display: 'flex', alignItems: 'center', marginBottom: '15px' };
const copyrightStyle = { textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #1e293b', fontSize: '14px', color: '#94a3b8' };