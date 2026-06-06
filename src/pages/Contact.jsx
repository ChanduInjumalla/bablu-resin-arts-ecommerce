import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      setStatus({ type: 'loading', message: 'Sending message...' });
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again or contact us directly via WhatsApp.' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us for any queries.</p>
      </div>

      <div className="container contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p className="contact-desc">
            Whether you have a question about our products, shipping, returns, or anything else, our team is ready to answer all your questions.
          </p>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon"><Phone size={24} /></div>
              <div className="info-text">
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
                <span>Mon-Fri 9am-6pm IST</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Mail size={24} /></div>
              <div className="info-text">
                <h3>Email</h3>
                <p>support@babluresinarts.com</p>
                <span>We reply within 24 hours</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><MapPin size={24} /></div>
              <div className="info-text">
                <h3>Studio</h3>
                <p>123 Artisan Valley</p>
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="How can we help?"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="Write your message here..."
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary contact-submit" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
