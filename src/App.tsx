import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

import LoginPage from './pages/LoginPage';

import ShopPage from './pages/ShopPage';

import AdminPage from './pages/AdminPage';

import CartPage from './pages/CartPage';

import CheckoutPage from './pages/CheckoutPage';

import OrderConfirmationPage from './pages/OrderConfirmationPage';

import AboutUsPage from './pages/AboutUsPage';

import OurStoresPage from './pages/OurStoresPage';

import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/stores" element={<OurStoresPage />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </Router>
  );
}

export default App;