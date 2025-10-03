
import React from 'react';
import { Carousel } from 'react-bootstrap';

const HomeCarousel: React.FC = () => {
  return (
    <Carousel id="areKatikaCarousel">
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="/assets/offers1.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="/assets/offers1.jpg"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="/assets/offers1.jpg"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default HomeCarousel;
