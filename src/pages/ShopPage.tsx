import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Row, Col } from 'react-bootstrap';
import { API_URL } from '../constants';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string, quantity: number, weight: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      await axios.post(`${API_URL}/cart`, { productId, quantity, weight }, config);
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please login.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Products</h2>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopPage;