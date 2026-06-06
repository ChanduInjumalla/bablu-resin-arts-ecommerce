import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const heroSlides = [
  {
    eyebrow: "New Arrivals",
    title: "Beautiful Resin Jewelry",
    description: "Handmade necklaces, earrings & gifts — each piece made with love and care.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    eyebrow: "Best Sellers",
    title: "Perfect Gifts for Everyone",
    description: "Find unique resin art pieces that your loved ones will treasure forever.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-content">
          <span className="hero-eyebrow">{heroSlides[currentSlide].eyebrow}</span>
          <h1 className="hero-title">{heroSlides[currentSlide].title}</h1>
          <p className="hero-description">{heroSlides[currentSlide].description}</p>
          <Link to="/shop" className="hero-btn">
            Shop Now <ArrowRight size={18} />
          </Link>
          
          <div className="hero-indicators">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx} 
                className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="hero-right">
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`hero-image-wrapper ${idx === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.title} className="hero-image" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
