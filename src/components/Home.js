import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ServiceCard from './ServiceCard';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaGoogle } from 'react-icons/fa';

// --- CLEAN LINKS SECTION ---
const INSTAGRAM_URL = "https://www.instagram.com/sadafestaterealtors?igsh=MWRnaXlhNDh4ZnlpNg==";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61584604430022";
const GOOGLE_URL = "https://www.google.com/search?q=Dha+bungalows&stick=H4sIAAAAAAAA_-NgU1I1qDBOTTI2TrE0M0hKtjSyMDC3MqhItkiztDBMNjMzMrZINE5NXMTK65KRqJBUmpeemJNfXgwAHZxKpzkAAAA&hl=en-GB&mat=CWAwx3nd3NwvElcBTVDHnkmMpShA94PijhxjNs8v4hKYXtfCtAC53X3oIdE0Y4oIvL2nhTPsZMqDcDco0YjWNUvGlt4sdJcfGr7CTjsZ0aJY6rB4_M88JFI5zpeh15McvIo&authuser=0";

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

  // --- ANIMATION FIXED HERE ---
  const getDynamicStyle = (id, color) => ({
    color: hoveredIcon === id ? color : '#cbd5e1',
    transform: hoveredIcon === id ? 'translateY(-10px) scale(1.1)' : 'translateY(0) scale(1)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth pop-up effect
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
          `}
        </style>
        <video autoPlay loop muted playsInline style={videoBackground}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div style={heroOverlay}>
          <div style={heroContent}>
            <h1 style={heroTitle} className="animate-title">Find Your Dream Home in <br /><span style={{color: '#f87171'}}>DHA Karachi</span></h1>
            <p style={heroSubTitle} className="animate-subtitle">Exclusive Villas and Prime Plots.</p>
            <button style={heroBtn} className="animate-btn" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>Explore Listings</button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '40px auto', flex: 1 }}>
        <div style={searchContainer}>
          <div style={searchWrapper}>
            <FaSearch style={{ color: '#94a3b8', marginRight: '10px' }} />
            <input type="text" placeholder="Search properties..." style={searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <h2 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '40px', fontWeight: '800' }}>OUR PROPERTIES</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
          ))}
        </div>

        {selectedService && <BookingForm service={selectedService} onClose={() => setSelectedService(null)} />}
      </div>

      {/* --- FOOTER (All Icons with fixed animation) --- */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerCol}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>DHA VILLAS & BUNGALOWS</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Trusted real estate partner in Karachi.</p>
          </div>
          <div style={footerCol}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Follow Us</h4>
            <div style={socialIconContainer}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" 
                 style={getDynamicStyle('insta', '#E4405F')} 
                 onMouseEnter={() => setHoveredIcon('insta')} 
                 onMouseLeave={() => setHoveredIcon(null)}><FaInstagram size={30} /></a>
              
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" 
                 style={getDynamicStyle('fb', '#1877F2')} 
                 onMouseEnter={() => setHoveredIcon('fb')} 
                 onMouseLeave={() => setHoveredIcon(null)}><FaFacebook size={30} /></a>
              
              <a href={GOOGLE_URL} target="_blank" rel="noreferrer" 
                 style={getDynamicStyle('google', '#4285F4')} 
                 onMouseEnter={() => setHoveredIcon('google')} 
                 onMouseLeave={() => setHoveredIcon(null)}><FaGoogle size={30} /></a>
              
              <a href="mailto:support@dhavillasandbungalows.com" 
                 style={getDynamicStyle('mail', '#DB4437')} 
                 onMouseEnter={() => setHoveredIcon('mail')} 
                 onMouseLeave={() => setHoveredIcon(null)}><FaEnvelope size={30} /></a>
            </div>
          </div>
        </div>
        <div style={copyrightStyle}>© {new Date().getFullYear()} DHA VILLAS & BUNGALOWS.</div>
      </footer>
    </div>
  );
}

// Styles (Baaki styles aapke original hi hain)
const searchContainer = { display: 'flex', justifyContent: 'center', marginBottom: '50px' };
const searchWrapper = { display: 'flex', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '50px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const searchInput = { border: 'none', outline: 'none', width: '100%', fontSize: '16px' };
const heroContainer = { position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const videoBackground = { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover', zIndex: '-1' };
const heroOverlay = { position: 'absolute', inset: '0', background: 'rgba(0, 0, 0, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const heroContent = { textAlign: 'center', color: 'white' };
const heroTitle = { fontSize: 'clamp(2rem, 5.5vw, 4.8rem)', fontWeight: '900' };
const heroSubTitle = { fontSize: '1.25rem', marginBottom: '40px' };
const heroBtn = { background: '#1e40af', color: 'white', padding: '15px 40px', borderRadius: '50px', cursor: 'pointer', border: 'none', fontWeight: 'bold' };
const footerStyle = { background: '#0f172a', color: 'white', padding: '60px 20px 20px' };
const footerContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' };
const footerCol = { display: 'flex', flexDirection: 'column' };
const socialIconContainer = { display: 'flex', gap: '25px' };
const copyrightStyle = { textAlign: 'center', marginTop: '40px', color: '#94a3b8' };