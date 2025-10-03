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