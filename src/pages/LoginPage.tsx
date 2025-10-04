import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

const LoginPage: React.FC = () => {
  const [activePortal, setActivePortal] = useState('admin');
  const [isAdminLogin, setAdminLogin] = useState(true);
  const [isUserLogin, setUserLogin] = useState(true);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminSignupEmail, setAdminSignupEmail] = useState('');
  const [adminSignupPassword, setAdminSignupPassword] = useState('');
  const [adminTermsCheck, setAdminTermsCheck] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userSignupEmail, setUserSignupEmail] = useState('');
  const [userSignupPassword, setUserSignupPassword] = useState('');
  const [userTermsCheck, setUserTermsCheck] = useState(false);

  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const switchPortal = (portal: string) => {
    setActivePortal(portal);
    setMessage(''); // Clear messages on portal switch
  };

  const showSuccessPopup = (msg: string) => {
    setMessage(msg);
    setShowSuccess(true);
  };

  const closeSuccessPopup = () => {
    setShowSuccess(false);
    setMessage('');
  };

  const handleAdminLogin = async () => {
    try {
      const url = `${API_URL}/users/login`;
      console.log("Admin Login URL:", url);
      const { data } = await axios.post(url, { email: adminEmail, password: adminPassword });
      console.log("Admin login response:", data);
      if (data.isAdmin) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data._id);
        window.dispatchEvent(new Event('userLogin'));
        navigate('/admin');
      } else {
        setMessage('Not authorized as an admin');
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Admin login failed';
      setMessage(errorMessage);
    }
  };

  const handleAdminSignup = async () => {
    if (!adminTermsCheck) {
      setMessage('Please agree to terms and conditions');
      return;
    }
    try {
      const url = `${API_URL}/users/register`;
      console.log("Admin Signup URL:", url);
      const response = await axios.post(url, { 
        firstName: adminFirstName, 
        lastName: adminLastName, 
        email: adminSignupEmail, 
        password: adminSignupPassword, 
        phone: adminPhone, 
        isAdmin: true 
      });
      console.log("Admin registration response:", response.data);
      showSuccessPopup('Admin registered successfully! Please login.');
      setAdminLogin(true);
    } catch (error: any) {
      console.error("Admin registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Admin registration failed';
      setMessage(errorMessage);
    }
  };

  const handleUserLogin = async () => {
    try {
      const url = `${API_URL}/users/login`;
      console.log("User Login URL:", url);
      const { data } = await axios.post(url, { email: userEmail, password: userPassword });
      console.log("User login response:", data);
      if (!data.isAdmin) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data._id);
        window.dispatchEvent(new Event('userLogin'));
        navigate('/shop'); // Redirect to shop page
      } else {
        setMessage('Not authorized as a user');
      }
    } catch (error: any) {
      console.error("User login error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'User login failed';
      setMessage(errorMessage);
    }
  };

  const handleUserSignup = async () => {
    if (!userTermsCheck) {
      setMessage('Please agree to terms and conditions');
      return;
    }
    try {
      const url = `${API_URL}/users/register`;
      console.log("User Signup URL:", url);
      const response = await axios.post(url, { 
        firstName: userFirstName, 
        lastName: userLastName, 
        email: userSignupEmail, 
        password: userSignupPassword, 
        phone: userPhone, 
        isAdmin: false 
      });
      console.log("Registration response:", response.data);
      showSuccessPopup('User registered successfully! Please login.');
      setUserLogin(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-half ${activePortal === 'admin' ? 'active' : 'inactive'}`} id="adminHalf" onClick={() => switchPortal('admin')}>
        <div className={`auth-form admin-form ${activePortal === 'admin' ? 'active' : ''}`}>
          {isAdminLogin ? (
            <div id="adminLoginForm">
              <h2 className="auth-title">Admin Login</h2>
              <p className="auth-description">Access the admin dashboard with your credentials</p>
              <div className="admin-icon" id="adminIcon">
                <i className="bi bi-person-fill" style={{ fontSize: '40px', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}></i>
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" id="adminEmail" placeholder="Email ID" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" id="adminPassword" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <button className="btn btn-auth mb-3" onClick={handleAdminLogin}>Login</button>
              <div className="text-center">
                Don't have an account? <span className="signup-link" onClick={() => setAdminLogin(false)}>signup</span>
              </div>
            </div>
          ) : (
            <div id="adminSignupForm">
              <h2 className="auth-title">Admin Signup</h2>
              <div className="mb-3">
                <input type="text" className="form-control" id="adminFirstName" placeholder="First Name" value={adminFirstName} onChange={(e) => setAdminFirstName(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" id="adminLastName" placeholder="Last Name" value={adminLastName} onChange={(e) => setAdminLastName(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" id="adminPhone" placeholder="Phone Number" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" id="adminSignupEmail" placeholder="Email ID" value={adminSignupEmail} onChange={(e) => setAdminSignupEmail(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" id="adminSignupPassword" placeholder="Password" value={adminSignupPassword} onChange={(e) => setAdminSignupPassword(e.target.value)} disabled={activePortal !== 'admin'} />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="adminTermsCheck" checked={adminTermsCheck} onChange={(e) => setAdminTermsCheck(e.target.checked)} disabled={activePortal !== 'admin'} />
                <label className="form-check-label" htmlFor="adminTermsCheck">Agree our terms and conditions</label>
              </div>
              <button className="btn btn-auth mb-3" onClick={handleAdminSignup}>Signup</button>
              <div className="text-center">
                Already have an account? <span className="signup-link" onClick={() => setAdminLogin(true)}>login</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`auth-half ${activePortal === 'user' ? 'active' : 'inactive'}`} id="userHalf" onClick={() => switchPortal('user')}>
        <div className={`auth-form user-form ${activePortal === 'user' ? 'active' : ''}`}>
          {isUserLogin ? (
            <div id="userLoginForm">
              <h2 className="auth-title">Customer Login</h2>
              <p className="auth-description">Access your account with your credentials</p>
              <div className="user-icon">
                <i className="bi bi-person"></i>
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" id="userEmail" placeholder="Email ID" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" id="userPassword" placeholder="Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <button className="btn btn-auth mb-3" onClick={handleUserLogin}>Login</button>
              <div className="text-center">
                Don't have an account? <span className="signup-link" onClick={() => setUserLogin(false)}>signup</span>
              </div>
            </div>
          ) : (
            <div id="userSignupForm">
              <h2 className="auth-title">User Signup</h2>
              <div className="mb-3">
                <input type="text" className="form-control" id="userFirstName" placeholder="First Name" value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" id="userLastName" placeholder="Last Name" value={userLastName} onChange={(e) => setUserLastName(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3">
                <input type="tel" className="form-control" id="userPhone" placeholder="Phone Number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" id="userSignupEmail" placeholder="Email ID" value={userSignupEmail} onChange={(e) => setUserSignupEmail(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" id="userSignupPassword" placeholder="Password" value={userSignupPassword} onChange={(e) => setUserSignupPassword(e.target.value)} disabled={activePortal !== 'user'} />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="userTermsCheck" checked={userTermsCheck} onChange={(e) => setUserTermsCheck(e.target.checked)} disabled={activePortal !== 'user'} />
                <label className="form-check-label" htmlFor="userTermsCheck">Agree our terms and conditions</label>
              </div>
              <button className="btn btn-auth mb-3" onClick={handleUserSignup}>Signup</button>
              <div className="text-center">
                Already have an account? <span className="signup-link" onClick={() => setUserLogin(true)}>login</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`success-popup ${showSuccess ? 'd-block' : 'd-none'}`} id="successPopup">
          <h3>{showSuccess ? 'Success!' : 'Error!'}</h3>
          <p>{message}</p>
          <button className="btn btn-auth" onClick={closeSuccessPopup}>OK</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;