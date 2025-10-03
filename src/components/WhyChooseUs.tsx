
import React from 'react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-5 why-choose-section" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="container">
        <h2 className="text-center mb-2">Why Choose Arekatika?</h2>
        <p className="text-center mb-4 subtitle">We're committed to delivering the freshest, highest quality meat and seafood with exceptional service that you can trust</p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-shield-check feature-icon"></i>
              </div>
              <h5 className="feature-title">100% Fresh Guarantee</h5>
              <p className="feature-text">Every product is carefully inspected for freshness and quality before delivery</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-truck feature-icon"></i>
              </div>
              <h5 className="feature-title">Same Day Delivery</h5>
              <p className="feature-text">Order before 2 PM and get your fresh meat delivered the same day</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-clock-history feature-icon"></i>
              </div>
              <h5 className="feature-title">Always On Time</h5>
              <p className="feature-text">Reliable delivery within the promised time slot, every single time</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-award feature-icon"></i>
              </div>
              <h5 className="feature-title">Premium Quality</h5>
              <p className="feature-text">Sourced from certified suppliers and local farms with highest standards</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-people feature-icon"></i>
              </div>
              <h5 className="feature-title">10,000+ Happy Customers</h5>
              <p className="feature-text">Join thousands of satisfied customers who trust Arekatika for quality</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon-container">
                <i className="bi bi-headset feature-icon"></i>
              </div>
              <h5 className="feature-title">24/7 Support</h5>
              <p className="feature-text">Round-the-clock customer support for all your queries and concerns</p>
            </div>
          </div>
        </div>

        <div className="stats-container mt-5">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Products</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Locations</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
