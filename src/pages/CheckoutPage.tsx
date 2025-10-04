
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

interface CartItem {
  _id: string;
  product: string;
  title: string;
  quantity: number;
  price: number;
  discount: number | null;
}

const CheckoutPage: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/auth');
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
      setError('Failed to load cart items');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const openCashfreeCheckout = async (orderId: string, amount: number) => {
    try {
      const { data } = await axios.post(`${API_URL}/payment/create-order`, {
        amount,
        email: 'customer@example.com', // You can get this from user profile
        phone: '9999999999', // You can get this from user profile
        orderId
      });

      const paymentSessionId = data?.payment_session_id;
      if (!paymentSessionId) {
        throw new Error('Failed to create payment session');
      }

      const cashfree = (window as any).Cashfree({ mode: "sandbox" });

      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      console.log("Checkout result:", result);

      // Check payment status
      const statusResp = await axios.get(`${API_URL}/payment/order-status/${data.order_id}`);
      const status = statusResp.data?.order_status;
      
      if (status === "PAID") {
        navigate(`/order-confirmation?orderId=${orderId}&status=success`);
      } else {
        setError(`Payment status: ${status || "Unknown"}`);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to place an order.');
      navigate('/auth');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };

      // Create order first
      const orderItemsToSend = cartItems.map(item => ({
        ...item,
        product: item.product,
      }));

      const { data } = await axios.post(`${API_URL}/admin/orders`, { 
        shippingAddress, 
        paymentMethod: paymentMethod,
        orderItems: orderItemsToSend
      }, config);

      if (paymentMethod === 'cashfree') {
        await openCashfreeCheckout(data._id, data.totalPrice);
      } else {
        navigate(`/order-confirmation?orderId=${data._id}`);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      setError('An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={8}>
          <h4>Shipping Address</h4>
          <Form onSubmit={handlePlaceOrder}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={shippingAddress.fullName} onChange={handleShippingChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={shippingAddress.address} onChange={handleShippingChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" value={shippingAddress.city} onChange={handleShippingChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control type="text" value={shippingAddress.postalCode} onChange={handleShippingChange} required />
            </Form.Group>

            <h4 className="mt-4">Payment Method</h4>
            <Card>
              <Card.Body>
                <Form.Check
                  type="radio"
                  label="Cashfree Payment Gateway"
                  name="paymentMethod"
                  id="cashfree"
                  value="cashfree"
                  checked={paymentMethod === 'cashfree'}
                  onChange={handlePaymentMethodChange}
                  className="mb-3"
                />
                <Form.Check
                  type="radio"
                  label="Cash on Delivery"
                  name="paymentMethod"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
                />
              </Card.Body>
            </Card>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : `Place Order - ₹${calculateTotal()}`}
            </Button>
          </Form>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {cartItems.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{calculateTotal()}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
