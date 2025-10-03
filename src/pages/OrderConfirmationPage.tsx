
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, ListGroup, Button } from 'react-bootstrap';

interface OrderItem {
  title: string;
  quantity: number;
  weight: string;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
}

const OrderConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
      generateEstimatedDeliveryTime();
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/orders/${id}`, config);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const generateEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    setEstimatedDelivery(deliveryDate.toLocaleTimeString('en-US', options));
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Packed': return 1;
      case 'Shipped': return 2;
      case 'On the Way': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="order-tracking-container py-5">
      <div className="container">
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="order-summary-card text-center">
              <h2 className="mb-3">Order Confirmed!</h2>
              <p className="lead">Thank you for your purchase. Your order is being processed.</p>
              <p className="order-id-display">Order ID: <span id="order-id-display">#{orderId}</span></p>
              <p className="estimated-delivery">Estimated Delivery: <strong>{estimatedDelivery}</strong></p>
            </div>

            <div className="tracking-details-card mt-4">
              <h4>Order Tracking</h4>
              <div className="map-placeholder">
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=Hyderabad,India&zoom=12&size=600x300&markers=color:red%7Clabel:A%7CHyderabad,India&key=YOUR_API_KEY" alt="Order Tracking Map" />
              </div>

              <div className="progress-track">
                <ul id="tracking-list" className="list-unstyled d-flex justify-content-between">
                  <li className={`step ${getStatusStep(order?.status || '') >= 0 ? 'active' : ''}`} id="step-placed">
                    <span className="icon"><i className="bi bi-check-circle"></i></span>
                    Order Placed
                  </li>
                  <li className={`step ${getStatusStep(order?.status || '') >= 1 ? 'active' : ''}`} id="step-packed">
                    <span className="icon"><i className="bi bi-box"></i></span>
                    Packed
                  </li>
                  <li className={`step ${getStatusStep(order?.status || '') >= 2 ? 'active' : ''}`} id="step-shipped">
                    <span className="icon"><i className="bi bi-truck"></i></span>
                    Shipped
                  </li>
                  <li className={`step ${getStatusStep(order?.status || '') >= 3 ? 'active' : ''}`} id="step-on-the-way">
                    <span className="icon"><i className="bi bi-geo-alt"></i></span>
                    On the Way
                  </li>
                  <li className={`step ${getStatusStep(order?.status || '') >= 4 ? 'active' : ''}`} id="step-delivered">
                    <span className="icon"><i className="bi bi-house"></i></span>
                    Delivered
                  </li>
                </ul>
              </div>
            </div>

            <div className="tracking-details-card mt-4">
              <h4>Order Details</h4>
              <div id="order-items-details">
                <ListGroup variant="flush" className="order-items-list">
                  {order?.orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <span className="item-name">{item.title} (Qty: {item.quantity}, {item.weight})</span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <div className="order-total-display" id="order-total-display">
                Total: ₹{order?.totalPrice}
              </div>
            </div>

            <div className="text-center mt-4">
              <Button variant="maroon" size="lg" onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
