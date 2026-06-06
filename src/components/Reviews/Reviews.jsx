import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Reviews.css';

const reviewsData = [
  {
    name: "Eleanor Richards",
    location: "Mumbai",
    review: "Absolutely stunning pieces. The craftsmanship is beyond compare, and it arrived beautifully packaged. Every detail screams luxury — will definitely be ordering again.",
    rating: 5,
    product: "Rose Gold Pendant",
    initials: "ER"
  },
  {
    name: "Sophia Martinez",
    location: "Delhi",
    review: "I bought a customized resin tray as a gift for my mother. She was completely blown away by the elegant details and the quality of packaging. Highly recommend!",
    rating: 5,
    product: "Custom Resin Tray",
    initials: "SM"
  },
  {
    name: "Claire Thompson",
    location: "Bangalore",
    review: "The quality of the earrings is incredible for the price point. They feel substantial and look like they cost thousands. This is my new go-to boutique for gifts.",
    rating: 5,
    product: "Pearl Drop Earrings",
    initials: "CT"
  }
];

const Reviews = () => {
  return (
    <section className="section reviews-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Real stories from people who love what we create</p>
        </div>
        
        <div className="reviews-grid">
          {reviewsData.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-quote-icon">
                <Quote size={24} strokeWidth={1} />
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? 'currentColor' : 'none'}
                    strokeWidth={i < review.rating ? 0 : 1.5}
                  />
                ))}
              </div>
              <p className="review-text">{review.review}</p>
              <div className="review-footer">
                <div className="review-avatar">
                  <span>{review.initials}</span>
                </div>
                <div className="review-author">
                  <span className="author-name">{review.name}</span>
                  <span className="author-meta">{review.location} · {review.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
