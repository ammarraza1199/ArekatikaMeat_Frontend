
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

interface CartItem {
  _id: string;
  product: string;
  title: string;
  quantity: number;
  weight: string;
  price: number;
  discount: number | null;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      if (!userId) {
        // Handle not logged in state, e.g., redirect to login
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/cart`, config);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      await axios.put(`${API_URL}/cart/${itemId}`, { quantity }, config);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      await axios.delete(`${API_URL}/cart/${itemId}`, config);
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to place an order.');
      navigate('/auth');
      return;
    }

    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
    } else {
      placeOrder(paymentMethod);
    }
  };

  const placeOrder = async (method: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      const shippingAddress = { // Dummy address for now
        fullName: "Test User",
        address: "123 Test Street",
        city: "Test City",
        postalCode: "12345"
      };
      const orderItemsToSend = cartItems.map(item => ({
        ...item,
        product: item.product,
      }));

      // 1. Create order in your backend (initially with pending payment status)
      const { data: createdOrder } = await axios.post(`${API_URL}/admin/orders`, { shippingAddress, paymentMethod: method, orderItems: orderItemsToSend }, config);

      // 2. Initiate Cashfree payment session
      const { data: cashfreeResponse } = await axios.post(`${API_URL}/payment/create-order`, {
        orderId: createdOrder._id,
        amount: createdOrder.totalPrice,
      }, config);

      // 3. Redirect to Cashfree payment page
      if (cashfreeResponse && cashfreeResponse.payment_session_id) {
        // Cashfree provides a JS SDK to handle redirection, or you can construct a form and submit it.
        // For simplicity, we'll use a direct redirect if Cashfree provides a payment link.
        // If using Cashfree's JS SDK, it would look something like:
        // const cashfree = new Cashfree({
        //   mode: "sandbox", // or "production"
        // });
        // cashfree.checkout({
        //   paymentSessionId: cashfreeResponse.payment_session_id,
        //   returnUrl: `http://localhost:3000/order-confirmation?order_id=${createdOrder._id}`,
        // });

        // For now, we'll assume a direct redirect is possible or handle it via a simple form submission
        // This part might need adjustment based on actual Cashfree SDK usage.
        window.location.href = `https://api.cashfree.com/pg/checkout/v1/payment?payment_session_id=${cashfreeResponse.payment_session_id}`;

      } else {
        throw new Error('Failed to get Cashfree payment session ID');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      <div id="cart-container">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.title} ({item.weight})</td>
                  <td>₹{item.price}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item._id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Payment Method</h4>
          <Form.Check
            type="radio"
            label="UPI"
            name="paymentMethod"
            id="upi"
            value="UPI"
            checked={paymentMethod === 'UPI'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Cash on Delivery"
            name="paymentMethod"
            id="cod"
            value="Cash on Delivery"
            checked={paymentMethod === 'Cash on Delivery'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <h4>Total: <span id="cart-total">₹{calculateTotal()}</span></h4>
          <Button variant="primary" onClick={handlePlaceOrder}>Place Order</Button>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <Modal show={showUpiModal} onHide={() => setShowUpiModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>UPI Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div id="upi-app-selection">
            <h6>Select UPI App</h6>
            <div className="d-flex justify-content-center">
              <Button variant="outline-primary" className="me-2" onClick={() => placeOrder('UPI')}>PhonePe</Button>
              <Button variant="outline-primary" className="me-2" onClick={() => placeOrder('UPI')}>Google Pay</Button>
              <Button variant="outline-primary" onClick={() => placeOrder('UPI')}>Paytm</Button>
            </div>
          </div>
          {/* QR Code container and payment status can be added here if needed */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartPage;
