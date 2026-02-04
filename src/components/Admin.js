import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Pencil, Trash2, X } from 'lucide-react'; 

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  // Added 'price' to the state
  const [newService, setNewService] = useState({ title: '', description: '', category: '', media: [], price: '' });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  // --- PRICE TO WORDS CONVERTER LOGIC ---
  const formatPriceToWords = (num) => {
    if (!num || isNaN(num)) return "";
    const n = parseInt(num);
    if (n === 0) return "Zero";

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
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
    const { data } = await supabase.from('bookings').select('*, services(title)');
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
      if (files.length === 0) return;
      const uploadedMedia = [...newService.media];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
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
      alert("Uploaded!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (newService.media.length === 0) {
        alert("Upload media first!");
        return;
    }

    const payload = {
        title: newService.title,
        description: newService.description,
        category: newService.category,
        media: newService.media,
        price: parseInt(newService.price) // Sending price to DB
    };

    if (editingId) {
      const { error } = await supabase.from('services').update(payload).eq('id', editingId);
      if (error) alert(error.message);
      else { alert("Updated!"); setEditingId(null); }
    } else {
      const { error } = await supabase.from('services').insert([payload]);
      if (error) alert(error.message);
      else alert("Published!");
    }

    setNewService({ title: '', description: '', category: '', media: [], price: '' });
    fetchServices();
  };

  const startEdit = (ad) => {
    setEditingId(ad.id);
    setNewService({
      title: ad.title,
      description: ad.description,
      category: ad.category,
      media: ad.media || [],
      price: ad.price || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteAd = async (id) => {
    if (window.confirm("Delete this Ad?")) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{color: '#1e40af'}}>TECH PRO Admin</h1>

      <section style={cardStyle}>
        <h2>{editingId ? "✏️ Edit Ad" : "📢 Post New Ad"}</h2>
        <form onSubmit={handleUploadAd}>
          <input style={inputStyle} placeholder="Service Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          
          {/* PRICE INPUT FIELD */}
          <div style={{marginBottom: '10px'}}>
            <input 
                type="number" 
                style={inputStyle} 
                placeholder="Enter Price (PKR)" 
                value={newService.price} 
                onChange={e => setNewService({...newService, price: e.target.value})} 
                required 
            />
            {newService.price && (
                <p style={{marginTop: '-5px', fontSize: '13px', color: '#059669', fontWeight: 'bold'}}>
                   💰 {formatPriceToWords(newService.price)}
                </p>
            )}
          </div>

          <textarea style={inputStyle} placeholder="Description" rows="4" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
          <input style={inputStyle} placeholder="Category" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          
          <div style={{marginBottom: '15px'}}>
            <label style={{fontWeight: 'bold'}}>Add Media: </label>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} />
            <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                {newService.media.map((m, i) => (
                    <div key={i} style={{position: 'relative'}}>
                        <img src={m.url} alt="prev" style={{width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px'}} />
                        <button type="button" onClick={() => setNewService({...newService, media: newService.media.filter((_, idx) => idx !== i)})} 
                                style={removeBtnStyle}>×</button>
                    </div>
                ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button type="submit" style={btnStyle} disabled={uploading}>
                {uploading ? "Uploading..." : (editingId ? "Update Ad" : "Publish Ad")}
            </button>
            {editingId && <button onClick={() => {setEditingId(null); setNewService({title:'', description:'', category:'', media:[], price:''})}} style={{...btnStyle, background: '#666'}}>Cancel</button>}
          </div>
        </form>
      </section>

      {/* Ads List Section */}
      <section style={cardStyle}>
        <h2>Manage Your Ads</h2>
        <div style={gridStyle}>
          {services.map(ad => (
            <div key={ad.id} style={adRowStyle}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <img src={ad.media?.[0]?.url || ad.image_url} alt="service" style={{width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover'}} />
                <span><strong>{ad.title}</strong> - <span style={{color: '#059669'}}>PKR {ad.price}</span></span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => startEdit(ad)} style={{background: '#fbbf24', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'}}><Pencil size={18} color="white" /></button>
                <button onClick={() => deleteAd(ad.id)} style={{background: '#ef4444', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'}}><Trash2 size={18} color="white" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Styles
const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { padding: '10px 25px', background: '#1e40af', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' };
const adRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee' };
const gridStyle = { background: 'white', borderRadius: '5px', padding: '10px' };
const removeBtnStyle = { position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', width: '20px', height: '20px' };

export default Admin;