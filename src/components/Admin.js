import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  const [newService, setNewService] = useState({ title: '', description: '', category: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null); // File state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  async function fetchBookings() {
    const { data } = await supabase.from('bookings').select('*, services(title)');
    if (data) setBookings(data);
  }

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (data) setServices(data);
  }

  // --- IMAGE UPLOAD LOGIC ---
  // --- IMAGE UPLOAD LOGIC UPDATE ---
const handleImageUpload = async (e) => {
  try {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`; // Math.random ki jagah Date.now behtar hai
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Yahan tabdeeli hai: data ko sahi tarah se nikaalein
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (urlData) {
      setNewService({ ...newService, image_url: urlData.publicUrl });
      alert("Image uploaded successfully!");
    }
  } catch (error) {
    alert("Image Upload Error: " + error.message);
  } finally {
    setUploading(false);
  }
};
  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (!newService.image_url) {
        alert("Pehle image upload hone dein!");
        return;
    }

    const { error } = await supabase.from('services').insert([newService]);
    if (error) alert(error.message);
    else {
      alert("Ad Published!");
      setNewService({ title: '', description: '', category: '', image_url: '' });
      setImageFile(null); // Reset file input
      fetchServices();
    }
  };

  const deleteAd = async (id) => {
    const confirmDelete = window.confirm("Kya aap waqai ye Ad delete karna chahte hain?");
    if (confirmDelete) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else {
        alert("Ad deleted successfully!");
        fetchServices();
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{color: '#1e40af'}}>TECH PRO Admin Control</h1>

      {/* --- Section 1: Naya Ad Post Karein --- */}
      <section style={cardStyle}>
        <h2>Post New Ad</h2>
        <form onSubmit={handleUploadAd}>
          <input style={inputStyle} placeholder="Service Title (e.g. AC Repair)" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          <textarea style={inputStyle} placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
          <input style={inputStyle} placeholder="Category (e.g. Electrical, Plumbing)" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          
          <div style={{marginBottom: '10px'}}>
            <label>Upload Service Image: </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} required />
          </div>

          <button type="submit" style={btnStyle} disabled={uploading}>
            {uploading ? "Uploading Image..." : "Publish Ad"}
          </button>
        </form>
      </section>

      {/* --- Section 2: Ads Manager --- */}
      <section style={cardStyle}>
        <h2>Manage Your Ads</h2>
        <div style={gridStyle}>
          {services.length === 0 ? <p>Koi Ads maujood nahi hain.</p> : services.map(ad => (
            <div key={ad.id} style={adRowStyle}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <img src={ad.image_url} alt="service" style={{width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover'}} />
                <span><strong>{ad.title}</strong> ({ad.category})</span>
              </div>
              <button onClick={() => deleteAd(ad.id)} style={deleteBtnStyle}>Delete Ad</button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 3: Bookings Table --- */}
      <section style={cardStyle}>
        <h2>Customer Bookings</h2>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
                <tr style={{background: '#eee', textAlign: 'left'}}>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Service</th>
                    <th style={thStyle}>Phone</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(b => (
                    <tr key={b.id} style={{borderBottom: '1px solid #ddd'}}>
                        <td style={tdStyle}>{b.customer_name}</td>
                        <td style={tdStyle}>{b.services?.title}</td>
                        <td style={tdStyle}>{b.phone}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </section>
    </div>
  );
};

// Styles
const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' };
const inputStyle = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' };
const deleteBtnStyle = { background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const adRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' };
const gridStyle = { background: 'white', borderRadius: '5px', padding: '10px' };
const thStyle = { padding: '10px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };

export default Admin;