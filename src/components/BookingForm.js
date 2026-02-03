// src/components/BookingForm.js
import { useState } from 'react';
import { supabase } from '../supabaseClient';

const BookingForm = ({ service, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('bookings')
      .insert([
        { 
          customer_name: name, 
          phone_number: phone, 
          address: address,
          appointment_date: date,
          service_id: service.id // Ye us service ki UUID lega
        }
      ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`Shukriya! ${service.title} ke liye aapki request mil gayi hai.`);
      onClose(); // Form band karne ke liye
    }
    setLoading(false);
  };

  return (
    <div style={modalStyle}>
      <div style={formContainerStyle}>
        <h2>Book {service.title}</h2>
        <form onSubmit={handleBooking}>
          <input type="text" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Your Home(Address)" value={address} onChange={(e)=>setAddress(e.target.value)} required style={inputStyle} />
          <input type="datetime-local" value={date} onChange={(e)=>setDate(e.target.value)} required style={inputStyle} />
          
          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'Saving...' : 'Confirm Booking'}
          </button>
          <button type="button" onClick={onClose} style={closeBtnStyle}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

// Styles
const modalStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const formContainerStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '400px' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' };
const submitBtnStyle = { width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const closeBtnStyle = { width: '100%', marginTop: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' };

export default BookingForm;