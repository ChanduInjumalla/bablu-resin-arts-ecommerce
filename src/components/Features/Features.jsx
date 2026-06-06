import React from 'react';
import { Gem, Hand, Truck, ShieldCheck } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    icon: <Gem size={28} strokeWidth={1.5} />,
    title: "Premium Quality",
    description: "Crafted with the finest materials for a truly luxurious experience that lasts."
  },
  {
    icon: <Hand size={28} strokeWidth={1.5} />,
    title: "Handmade Touch",
    description: "Each piece is meticulously crafted by skilled artisans with decades of expertise."
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Fast Delivery",
    description: "Beautifully packaged and delivered express on all premium orders."
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Secure Payments",
    description: "100% secure checkout with industry-leading end-to-end encryption."
  }
];

const Features = () => {
  return (
    <section className="section features-section">
      <div className="container">
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
