import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Pencil, Trash2, Star } from 'lucide-react'; 

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  const [reviews, setReviews] = useState([]); // Reviews state
  const [newService, setNewService] = useState({ title: '', description: '', category: '', media: [], price: '' });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchServices();
    fetchReviews(); // Load reviews on start
  }, []);

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

  async function fetchBookings() {
    const { data, error } = await supabase.from('bookings').select('*, services(title)');
    if (error) console.error("Booking fetch error:", error);
    if (data) setBookings(data);
  }

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (data) setServices(data);
  }

  // Fetch Reviews Function
  async function fetchReviews() {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) console.error("Reviews fetch error:", error);
    if (data) setReviews(data);
  }

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const uploadedMedia = [...newService.media];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        await supabase.storage.from('images').upload(fileName, file);
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        if (urlData) uploadedMedia.push({ url: urlData.publicUrl, type: file.type.startsWith('video') ? 'video' : 'image' });
      }
      setNewService({ ...newService, media: uploadedMedia });
      alert("Uploaded!");
    } catch (error) { alert(error.message); } finally { setUploading(false); }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    const payload = { ...newService, price: parseInt(newService.price) };
    if (editingId) {
      await supabase.from('services').update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('services').insert([payload]);
    }
    setNewService({ title: '', description: '', category: '', media: [], price: '' });
    fetchServices();
  };

  const deleteAd = async (id) => {
    if (window.confirm("Delete this Ad?")) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        if (error.code === '23503') {
           alert("❌ Galti: Is Ad ki Bookings pehle se maujood hain. Pehle niche se Bookings delete karein.");
        } else {
           alert("Error: " + error.message);
        }
      } else {
        fetchServices();
      }
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Delete this booking?")) {
        await supabase.from('bookings').delete().eq('id', id);
        fetchBookings();
    }
  };

  // Naya Review Delete Function
  const deleteReview = async (id) => {
    if (window.confirm("Kya aap ye review delete karna chahte hain?")) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) {
        alert("Error: " + error.message);
      } else {
        fetchReviews(); // Refresh the list
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{color: '#1e40af', textAlign: 'center'}}>DHA VILLAS & BUNGALOWS Admin</h1>

      {/* SECTION 1: POST AD */}
      <section style={cardStyle}>
        <h2 style={{color: '#1e40af'}}>{editingId ? "✏️ Edit Ad" : "📢 Post New Ad"}</h2>
        <form onSubmit={handleUploadAd}>
          <input style={inputStyle} placeholder="Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          <div style={{marginBottom: '10px'}}>
            <input type="number" style={inputStyle} placeholder="Price (PKR)" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
            {newService.price && <p style={{color: '#059669', fontSize: '13px', fontWeight: 'bold'}}>💰 {formatPriceToWords(newService.price)}</p>}
          </div>
          <textarea style={inputStyle} placeholder="Description" rows="4" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
          <input style={inputStyle} placeholder="Category" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          <div style={{background: '#fff', padding: '10px', borderRadius: '5px', border: '1px dashed #ccc', marginBottom: '10px'}}>
            <label style={{fontSize: '14px', color: '#666'}}>Upload Images/Videos: </label>
            <input type="file" multiple onChange={handleFileUpload} />
          </div>
          <button type="submit" style={btnStyle} disabled={uploading}>{uploading ? "Uploading..." : "Publish Ad"}</button>
        </form>
      </section>

      {/* SECTION 2: MANAGE ADS */}
      <section style={cardStyle}>
        <h2 style={{color: '#1e40af'}}>Manage Your Ads</h2>
        {services.map(ad => (
          <div key={ad.id} style={adRowStyle}>
            <span>{ad.title} - <strong>PKR {ad.price}</strong></span>
            <div>
              <button onClick={() => { setEditingId(ad.id); setNewService(ad); window.scrollTo(0,0); }} style={{marginRight:'5px', cursor:'pointer'}}><Pencil size={16}/></button>
              <button onClick={() => deleteAd(ad.id)} style={{background:'#ef4444', color:'white', border:'none', padding:'5px', borderRadius:'4px', cursor:'pointer'}}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 3: BOOKINGS */}
      <section style={cardStyle}>
        <h2 style={{borderBottom: '2px solid #1e40af', paddingBottom: '10px', color: '#1e40af'}}>Customer Bookings</h2>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', background: 'white'}}>
            <thead>
              <tr style={{background: '#1e40af', color: 'white'}}>
                <th style={tdStyle}>Customer</th>
                <th style={tdStyle}>Service</th>
                <th style={tdStyle}>Phone</th>
                <th style={tdStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map(b => (
                <tr key={b.id} style={{borderBottom: '1px solid #ddd'}}>
                  <td style={tdStyle}>{b.customer_name}</td>
                  <td style={tdStyle}>{b.services?.title || 'Service Deleted'}</td>
                  <td style={tdStyle}>{b.phone}</td>
                  <td style={tdStyle}>
                    <button onClick={() => deleteBooking(b.id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}><Trash2 size={18}/></button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: MANAGE REVIEWS (Naya Section) */}
      <section style={cardStyle}>
        <h2 style={{borderBottom: '2px solid #1e40af', paddingBottom: '10px', color: '#1e40af'}}>Manage Customer Reviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
          {reviews.length > 0 ? reviews.map(rev => (
            <div key={rev.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #eee', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{rev.customer_name}</div>
              <div style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: '2px', margin: '5px 0' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="#facc15" />)}
              </div>
              <p style={{ fontSize: '13px', color: '#555', margin: '5px 0' }}>{rev.comment}</p>
              <button 
                onClick={() => deleteReview(rev.id)} 
                style={{ position: 'absolute', top: '10px', right: '10px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )) : <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
};

const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ddd', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' };
const adRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee', background: 'white', marginBottom: '5px', borderRadius: '5px' };
const tdStyle = { padding: '12px', textAlign: 'left' };

export default Admin;