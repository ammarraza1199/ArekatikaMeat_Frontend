
import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
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

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuantity(item._id, parseInt(e.target.value))}
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
        <div className="col-md-6 text-end">
          <h4>Total: <span id="cart-total">₹{calculateTotal()}</span></h4>
          <Button variant="primary" onClick={handlePlaceOrder}>Proceed to Checkout</Button>
        </div>
      </div>

    </div>
  );
};

export default CartPage;
