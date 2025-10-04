import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { bestSelling } from '../data/mockData';
import axios from 'axios';
import { API_URL } from '../constants';

const BestSelling: React.FC = () => {
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(bestSelling.length / itemsPerSlide);

  const handleAddToCart = async (productId: string, quantity: number, weight: string) => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert('Please login to add items to cart.');
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      await axios.post(`${API_URL}/cart`, { productId, quantity, weight }, config);
      alert('Item added to cart!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Please login again to add items to cart.');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        window.dispatchEvent(new Event('userLogout'));
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  const slides = Array.from({ length: totalSlides }, (_, slideIndex) => {
    const startIndex = slideIndex * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    const slideItems = bestSelling.slice(startIndex, endIndex);

    return (
      <Carousel.Item key={slideIndex}>
        <Row className="g-3 justify-content-center">
          {slideItems.map((item) => (
            <Col md={3} key={item.id}>
              <ProductCard product={item} onAddToCart={handleAddToCart} />
            </Col>
          ))}
        </Row>
      </Carousel.Item>
    );
  });

  return (
    <section className="py-5 best-selling-section">
      <div className="container">
        <h2 className="text-center mb-2">Best Selling Products</h2>
        <div className="mx-auto mb-4 section-divider"></div>
        <Carousel id="bestSellingCarousel" indicators={false}>
          {slides}
        </Carousel>
      </div>
    </section>
  );
};

export default BestSelling;
