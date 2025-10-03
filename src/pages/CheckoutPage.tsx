
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const { data } = await axios.post(`${API_URL}/orders`, { shippingAddress, paymentDetails, paymentMethod: "Credit Card" }, config);
      navigate(`/order-confirmation?orderId=${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Checkout</h2>
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

            <h4 className="mt-4">Payment Details</h4>
            <Card>
              <Card.Body>
                <Card.Title>Credit Card</Card.Title>
                <Form.Group className="mb-3" controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" value={paymentDetails.cardNumber} onChange={handlePaymentChange} required />
                </Form.Group>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="expiryDate">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control type="text" placeholder="MM/YY" value={paymentDetails.expiryDate} onChange={handlePaymentChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="text" value={paymentDetails.cvv} onChange={handlePaymentChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Button variant="primary" type="submit" className="w-100 mt-3">Place Order</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
