
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../constants';

interface Product {
  _id: string;
  title: string;
  desc: string;
  pricePerKg: number;
  discount: number | null;
  weights: string[];
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  user: { _id: string; firstName: string; lastName: string };
  orderItems: { title: string; quantity: number; weight: string }[];
  shippingAddress: { address: string; city: string };
  totalPrice: number;
  status: string;
}

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    desc: '',
    pricePerKg: 0,
    discount: null as number | null,
    weights: '',
    image: '',
    quantity: 0,
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    itemsPacked: 0,
    totalRevenue: 0,
  });

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${adminToken}` } }),
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${adminToken}` } }),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormState({
        title: product.title,
        desc: product.desc,
        pricePerKg: product.pricePerKg,
        discount: product.discount,
        weights: product.weights.join(', '),
        image: product.image,
        quantity: product.quantity,
      });
    } else {
      setEditingProduct(null);
      setFormState({
        title: '',
        desc: '',
        pricePerKg: 0,
        discount: null,
        weights: '',
        image: '',
        quantity: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => setShowOrderModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: id === 'pricePerKg' || id === 'discount' || id === 'quantity' ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formState,
        weights: formState.weights.split(',').map((w) => w.trim()),
      };

      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } else {
        await axios.post(`${API_URL}/products`, productData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`${API_URL}/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={4}>
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text fs-4">{stats.totalOrders}</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Items Packed</h5>
              <p className="card-text fs-4">{stats.itemsPacked}</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="card-text fs-4">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </Col>
      </Row>

      <div className="card mb-4">
        <div className="card-header">
          <h4>Order Management</h4>
        </div>
        <div className="card-body">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.firstName} {order.user.lastName}</td>
                  <td>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx}>{item.title} (Qty: {item.quantity}, {item.weight})</div>
                    ))}
                  </td>
                  <td>{order.shippingAddress.address}, {order.shippingAddress.city}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowOrderModal(order)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Product Management</h4>
        </div>
        <div className="card-body">
          <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>Add Product</Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price/Kg</th>
                <th>Discount</th>
                <th>Weights</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><img src={product.image} alt={product.title} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{product.title}</td>
                  <td>{product.desc}</td>
                  <td>₹{product.pricePerKg}</td>
                  <td>{product.discount ? `${product.discount}%` : 'N/A'}</td>
                  <td>{product.weights.join(', ')}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleShowModal(product)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" id="title" value={formState.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" id="desc" rows={3} value={formState.desc} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price per Kg</Form.Label>
              <Form.Control type="number" id="pricePerKg" value={formState.pricePerKg} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control type="number" id="discount" value={formState.discount || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Weights (comma-separated)</Form.Label>
              <Form.Control type="text" id="weights" value={formState.weights} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
              {formState.image && (
                <img src={formState.image} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" id="quantity" value={formState.quantity} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>User:</strong> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
              <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
              <h5>Items</h5>
              <ul>
                {selectedOrder.orderItems.map((item, idx) => (
                  <li key={idx}>{item.title} (Qty: {item.quantity}, {item.weight})</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrderModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
