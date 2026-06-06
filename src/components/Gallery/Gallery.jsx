import React from 'react';
import './Gallery.css';

const galleryImages = [
  { src: "https://placehold.co/400x400/e8d8ce/8a7060?text=.", label: "Necklaces" },
  { src: "https://placehold.co/400x400/d4b8a0/8a7060?text=.", label: "Lifestyle" },
  { src: "https://placehold.co/400x400/c9a89a/7a6050?text=.", label: "Earrings" },
  { src: "https://placehold.co/400x400/eae6df/8a7060?text=.", label: "Bracelets" },
  { src: "https://placehold.co/400x400/f3f1ed/8a7060?text=.", label: "Gifts" },
  { src: "https://placehold.co/400x400/e0d5c8/8a7060?text=.", label: "Resin Art" }
];

const Gallery = () => {
  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Follow Along</span>
          <h2 className="section-title">@BabluResinArts</h2>
          <p className="section-subtitle">Join our community for daily inspiration and behind-the-scenes</p>
        </div>
        
        <div className="gallery-grid">
          {galleryImages.map((img, index) => (
            <div className="gallery-item" key={index}>
              <img src={img.src} alt={img.label} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="gallery-label">{img.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
