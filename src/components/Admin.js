import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// Pencil aur Trash icon ke liye (agar install nahi hai toh install karein: npm install lucide-react)
import { Pencil, Trash2, X } from 'lucide-react'; 

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  const [newService, setNewService] = useState({ title: '', description: '', category: '', media: [] });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null); // Edit track karne ke liye

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

  // --- MULTIPLE MEDIA UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const uploadedMedia = [...newService.media];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images') // Apne bucket ka naam yahan check karlein
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
        
        if (urlData) {
          uploadedMedia.push({
            url: urlData.publicUrl,
            type: file.type.startsWith('video') ? 'video' : 'image'
          });
        }
      }

      setNewService({ ...newService, media: uploadedMedia });
      alert("All files uploaded successfully!");
    } catch (error) {
      alert("Upload Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (newService.media.length === 0) {
        alert("Kam az kam aik image ya video upload karein!");
        return;
    }

    if (editingId) {
      // UPDATE EXISTING AD
      const { error } = await supabase.from('services').update({
        title: newService.title,
        description: newService.description,
        category: newService.category,
        media: newService.media // Make sure your column name in DB is 'media' or 'image_url'
      }).eq('id', editingId);

      if (error) alert(error.message);
      else {
        alert("Ad Updated Successfully!");
        setEditingId(null);
      }
    } else {
      // INSERT NEW AD
      const { error } = await supabase.from('services').insert([newService]);
      if (error) alert(error.message);
      else alert("Ad Published!");
    }

    setNewService({ title: '', description: '', category: '', media: [] });
    fetchServices();
  };

  const startEdit = (ad) => {
    setEditingId(ad.id);
    setNewService({
      title: ad.title,
      description: ad.description,
      category: ad.category,
      media: ad.media || [{url: ad.image_url, type: 'image'}] // Handle old data
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteAd = async (id) => {
    if (window.confirm("Kya aap waqai ye Ad delete karna chahte hain?")) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else fetchServices();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{color: '#1e40af'}}>TECH PRO Admin Control</h1>

      {/* --- Section 1: Form (Post/Edit) --- */}
      <section style={cardStyle}>
        <h2>{editingId ? "✏️ Edit Ad" : "📢 Post New Ad"}</h2>
        <form onSubmit={handleUploadAd}>
          <input style={inputStyle} placeholder="Service Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          <textarea style={inputStyle} placeholder="Description" rows="4" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
          <input style={inputStyle} placeholder="Category" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          
          <div style={{marginBottom: '15px'}}>
            <label style={{fontWeight: 'bold'}}>Add Media (Images/Videos): </label>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} style={{marginTop: '10px', display: 'block'}} />
            
            {/* Preview Selected Media */}
            <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                {newService.media.map((m, i) => (
                    <div key={i} style={{position: 'relative'}}>
                        {m.type === 'video' ? 
                          <video src={m.url} style={{width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px'}} /> :
                          <img src={m.url} alt="prev" style={{width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px'}} />
                        }
                        <button type="button" onClick={() => setNewService({...newService, media: newService.media.filter((_, idx) => idx !== i)})} 
                                style={{position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', width: '20px', height: '20px'}}>×</button>
                    </div>
                ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button type="submit" style={btnStyle} disabled={uploading}>
                {uploading ? "Processing Files..." : (editingId ? "Update Ad" : "Publish Ad")}
            </button>
            {editingId && <button onClick={() => {setEditingId(null); setNewService({title:'', description:'', category:'', media:[]})}} style={{...btnStyle, background: '#666'}}>Cancel</button>}
          </div>
        </form>
      </section>

      {/* --- Section 2: Ads Manager --- */}
      <section style={cardStyle}>
        <h2>Manage Your Ads</h2>
        <div style={gridStyle}>
          {services.map(ad => (
            <div key={ad.id} style={adRowStyle}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <img src={ad.media?.[0]?.url || ad.image_url} alt="service" style={{width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover'}} />
                <span><strong>{ad.title}</strong></span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => startEdit(ad)} style={{background: '#fbbf24', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'}} title="Edit Ad">
                  <Pencil size={18} color="white" />
                </button>
                <button onClick={() => deleteAd(ad.id)} style={{background: '#ef4444', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'}} title="Delete Ad">
                  <Trash2 size={18} color="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 3: Bookings --- */}
      <section style={cardStyle}>
        <h2>Customer Bookings</h2>
        <div style={{overflowX: 'auto'}}>
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
        </div>
      </section>
    </div>
  );
};

// Styles
const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { padding: '10px 25px', background: '#1e40af', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' };
const adRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee' };
const gridStyle = { background: 'white', borderRadius: '5px', padding: '10px' };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default Admin;