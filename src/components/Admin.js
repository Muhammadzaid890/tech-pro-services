import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Pencil, Trash2 } from 'lucide-react'; 

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  const [newService, setNewService] = useState({ title: '', description: '', category: '', media: [], price: '' });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchServices();
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
    // Is query se hum bookings aur usse judi service ka title dono la rahe hain
    const { data, error } = await supabase.from('bookings').select('*, services(title)');
    if (error) console.error("Booking fetch error:", error);
    if (data) setBookings(data);
  }

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (data) setServices(data);
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

  // Naya aur behtar Delete function jo 409 error ko samjhaye ga
  const deleteAd = async (id) => {
    if (window.confirm("Delete this Ad?")) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        if (error.code === '23503') {
           alert("❌ Galti: Is Ad ki Bookings pehle se maujood hain. Pehle niche se Bookings delete karein, phir Ad delete hoga.");
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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{color: '#1e40af'}}>TECH PRO Admin</h1>

      {/* SECTION 1: POST AD */}
      <section style={cardStyle}>
        <h2>{editingId ? "✏️ Edit Ad" : "📢 Post New Ad"}</h2>
        <form onSubmit={handleUploadAd}>
          <input style={inputStyle} placeholder="Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          <div style={{marginBottom: '10px'}}>
            <input type="number" style={inputStyle} placeholder="Price (PKR)" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
            {newService.price && <p style={{color: '#059669', fontSize: '13px', fontWeight: 'bold'}}>💰 {formatPriceToWords(newService.price)}</p>}
          </div>
          <textarea style={inputStyle} placeholder="Description" rows="4" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
          <input style={inputStyle} placeholder="Category" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          <input type="file" multiple onChange={handleFileUpload} />
          <button type="submit" style={btnStyle} disabled={uploading}>{uploading ? "Uploading..." : "Publish"}</button>
        </form>
      </section>

      {/* SECTION 2: MANAGE ADS */}
      <section style={cardStyle}>
        <h2>Manage Your Ads</h2>
        {services.map(ad => (
          <div key={ad.id} style={adRowStyle}>
            <span>{ad.title} - <strong>PKR {ad.price}</strong></span>
            <div>
              <button onClick={() => { setEditingId(ad.id); setNewService(ad); }} style={{marginRight:'5px'}}><Pencil size={16}/></button>
              <button onClick={() => deleteAd(ad.id)} style={{background:'#ef4444', color:'white', border:'none', padding:'5px', borderRadius:'4px'}}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 3: BOOKINGS (Ye wala section aapka missing tha) */}
      <section style={cardStyle}>
        <h2 style={{borderBottom: '2px solid #1e40af', paddingBottom: '10px'}}>Customer Bookings</h2>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', background: 'white'}}>
            <thead>
              <tr style={{background: '#eee'}}>
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
    </div>
  );
};

const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px 25px', background: '#1e40af', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop:'10px' };
const adRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' };
const tdStyle = { padding: '12px', textAlign: 'left' };

export default Admin;