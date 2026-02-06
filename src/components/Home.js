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
  const [hoveredIcon, setHoveredIcon] = useState(null); // Hover state handle karne ke liye
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

  // Hover Style Generator
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
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <h2 style={{ textAlign: 'center', color: '#1e40af' }}>OUR SERVICES</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          {services.map(service => (
            <ServiceCard key={service.id} service={service} onBook={setSelectedService} />
          ))}
        </div>

        <hr />

        <section style={{ marginTop: '40px', marginBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', color: '#1e40af' }}>CUSTOMER REVIEWS</h2>
          
          <div style={reviewBoxStyle}>
            <h4>Leave a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <select 
                style={inputStyle} 
                value={newReview.rating} 
                onChange={e => setNewReview({...newReview, rating: e.target.value})}
              >
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Very Bad)</option>
              </select>
              <textarea 
                style={{...inputStyle, height: '80px'}} 
                placeholder="Tell us what you think about our service!" 
                value={newReview.comment}
                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                required
              />
              <button type="submit" style={btnStyle}>Post Review</button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginTop: '30px' }}>
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

        {selectedService && (
          <BookingForm service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </div>

      {/* --- FOOTER SECTION --- */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerCol}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>TECH PRO SERVICES</h3>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              Your trusted partner for all professional home services. Quality work, guaranteed satisfaction.
            </p>
          </div>

          <div style={footerCol}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Follow Us</h4>
            <div style={socialIconContainer}>
              {/* Instagram Icon */}
              <a 
                href="https://instagram.com" target="_blank" rel="noreferrer" 
                style={getDynamicStyle('insta', '#E4405F')}
                onMouseEnter={() => setHoveredIcon('insta')}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <FaInstagram size={30} />
              </a>

              {/* Facebook Icon */}
              <a 
                href="https://www.facebook.com/share/1DB2XwXP3X/" target="_blank" rel="noreferrer" 
                style={getDynamicStyle('fb', '#1877F2')}
                onMouseEnter={() => setHoveredIcon('fb')}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <FaFacebook size={30} />
              </a>

              {/* Gmail Icon */}
              <a 
                href="mailto:techpro@gmail.com" 
                style={getDynamicStyle('mail', '#DB4437')}
                onMouseEnter={() => setHoveredIcon('mail')}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <FaEnvelope size={30} />
              </a>
            </div>
          </div>

          <div style={footerCol}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Contact Details</h4>
            <p style={contactItem}><FaMapMarkerAlt style={{marginRight: '10px'}}/> Karachi, Pakistan</p>
            <p style={contactItem}><FaPhoneAlt style={{marginRight: '10px'}}/> +92 316 2802558</p>
            <p style={contactItem}><FaEnvelope style={{marginRight: '10px'}}/> support@dhavillas&bungalows.com</p>
          </div>
        </div>
        <div style={copyrightStyle}>
          © {new Date().getFullYear()} DHA VILLAS & BUNGALOWS. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

// --- Styles ---
const reviewBoxStyle = { background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', maxWidth: '500px', margin: '0 auto' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #cbd5e1' };
const btnStyle = { width: '100%', padding: '10px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const revCardStyle = { background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' };

// Footer Styles
const footerStyle = { background: '#0f172a', color: 'white', padding: '50px 20px 20px 20px', marginTop: 'auto' };
const footerContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' };
const footerCol = { display: 'flex', flexDirection: 'column' };
const socialIconContainer = { display: 'flex', gap: '25px' };
const contactItem = { color: '#cbd5e1', fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '10px' };
const copyrightStyle = { textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', fontSize: '12px', color: '#94a3b8' };