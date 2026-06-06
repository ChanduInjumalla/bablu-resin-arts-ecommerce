import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Legal.css';

const Legal = () => {
  const { type } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const getContent = () => {
    switch(type) {
      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          content: (
            <>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <h3>1. Introduction</h3>
              <p>Welcome to Bablu Resin Arts. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
              <h3>2. Data We Collect</h3>
              <p>We may collect, use, store and transfer different kinds of personal data about you which includes: Identity Data, Contact Data, Financial Data, and Transaction Data necessary to process your orders.</p>
              <h3>3. How We Use Your Data</h3>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process and deliver your order, manage our relationship with you, and improve our website.</p>
              <h3>4. Data Security</h3>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way.</p>
            </>
          )
        };
      case 'terms-of-service':
        return {
          title: 'Terms of Service',
          content: (
            <>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <h3>1. Agreement to Terms</h3>
              <p>By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.</p>
              <h3>2. Products and Pricing</h3>
              <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for all products are subject to change without notice.</p>
              <h3>3. Accuracy of Billing</h3>
              <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</p>
              <h3>4. Governing Law</h3>
              <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            </>
          )
        };
      case 'refund-policy':
        return {
          title: 'Refund & Cancellation Policy',
          content: (
            <>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <h3>1. Returns</h3>
              <p>We accept returns within 7 days of delivery if the product is damaged or defective. Customized or personalized items cannot be returned unless they arrive damaged.</p>
              <h3>2. Refunds</h3>
              <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within 5-7 business days.</p>
              <h3>3. Cancellations</h3>
              <p>You may cancel your order within 24 hours of placing it. After 24 hours, if the order has already been processed or shipped, cancellation is no longer possible.</p>
            </>
          )
        };
      case 'shipping-policy':
        return {
          title: 'Shipping Policy',
          content: (
            <>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <h3>1. Processing Time</h3>
              <p>All orders are processed within 2-3 business days. Customized orders may take up to 5-7 business days to process before shipping.</p>
              <h3>2. Shipping Rates</h3>
              <p>Shipping charges for your order will be calculated and displayed at checkout. We offer free shipping on orders over Rs. 1500.</p>
              <h3>3. Delivery Estimates</h3>
              <p>Standard delivery typically takes 4-7 business days depending on your location within India. Delivery delays can occasionally occur.</p>
            </>
          )
        };
      default:
        return {
          title: 'Page Not Found',
          content: <p>The policy you are looking for does not exist. <Link to="/">Return to Home</Link></p>
        };
    }
  };

  const pageData = getContent();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">{pageData.title}</h1>
        <div className="legal-content">
          {pageData.content}
        </div>
      </div>
    </div>
  );
};

export default Legal;
