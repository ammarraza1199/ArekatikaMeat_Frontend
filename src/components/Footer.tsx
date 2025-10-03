import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-grey py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h2 className="footer-brand">Arekatika</h2>
            <p className="footer-tagline">Your trusted partner for premium fresh goat meat. From farm to fork, we ensure tender, hygienically processed goat meat with the highest quality and freshness in every cut.</p>
            <div className="social-icons mt-3">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/"><i className="bi bi-chevron-right"></i> Home</Link></li>
              <li><Link to="/shop"><i className="bi bi-chevron-right"></i> Shop</Link></li>
              <li><Link to="/about"><i className="bi bi-chevron-right"></i> About Us</Link></li>
              <li><Link to="/contact"><i className="bi bi-chevron-right"></i> Contact</Link></li>
              <li><Link to="/stores"><i className="bi bi-chevron-right"></i> Our Stores</Link></li>
              <li><Link to="/track-order"><i className="bi bi-chevron-right"></i> Track Order</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading">Categories</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#"><i className="bi bi-chevron-right"></i> Primary Cuts</a></li>
              <li><a href="#"><i className="bi bi-chevron-right"></i> Organs</a></li>
              <li><a href="#"><i className="bi bi-chevron-right"></i> Special Cuts</a></li>
              <li><a href="#"><i className="bi bi-chevron-right"></i> Combos & Bulk Packs</a></li>
              <li><a href="#"><i className="bi bi-chevron-right"></i> Extras and Addons</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-heading">Get in Touch</h5>
            <ul className="list-unstyled contact-info">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                <span>4-6-238/A ESAMIA BAZAR KOTI HYDERABAD , PIN code 50027.</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                <span>+91 98765 43210</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                <span>info@arekatika.com</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill me-2"></i>
                <span>Mon-Sun: 6 AM - 10 PM</span>
              </li>
            </ul>
            <div className="newsletter mt-4">
              <h5 className="footer-heading">Stay Updated</h5>
              <form className="d-flex">
                <input type="email" className="form-control me-2" placeholder="Your email" />
                <button className="btn btn-subscribe" type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-4">
          <div className="row">
            <div className="col-md-6">
              <p className="copyright mb-0">© 2024 Arekatika Fresh Butcher. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="policy-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Refund Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;