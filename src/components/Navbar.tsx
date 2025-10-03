
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [localStorage.getItem('userToken')]); // Re-run when userToken changes

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm custom-navbar">
      <div className="container-fluid d-flex justify-content-around align-items-center">
        <Link className="navbar-brand fw-bold text-black" to="/">
          <img src="/assets/LOGO_3.jpg" alt="AreKatikaMeat Logo" style={{ height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
          AreKatikaMeat
        </Link>

        <div className="input-group" style={{ maxWidth: '400px' }}>
          <button className="btn btn-outline-maroon" type="button" id="locationBtn">
            Enter Location
          </button>
          <input type="text" className="form-control border-maroon" placeholder="Search Product Here" />
          <button className="btn btn-maroon" type="button">
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className="d-flex align-items-center">
          <Link to="/" className="btn btn-maroon text-white me-2">Home</Link>
          <Link to="/shop" className="btn btn-maroon text-white me-2">Shop Now</Link>
          <Link to="/about" className="btn btn-maroon text-white me-2">About Us</Link>
          <Link to="/stores" className="btn btn-outline-maroon">Our Stores</Link>
        </div>

        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <button className="icon-btn me-2" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i></button>
          ) : (
            <Link to="/auth" className="icon-btn me-2"><i className="bi bi-person"></i></Link>
          )}
          <Link to="#" className="icon-btn me-2"><i className="bi bi-heart"></i></Link>
          <Link to="/cart" className="icon-btn"><i className="bi bi-cart"></i></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
