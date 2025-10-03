import React from 'react';
import HomeCarousel from '../components/HomeCarousel';
import BestSelling from '../components/BestSelling';

import ShopByCategory from '../components/ShopByCategory';

import WhyChooseUs from '../components/WhyChooseUs';

const HomePage: React.FC = () => {
  return (
    <div>
      <HomeCarousel />
      <BestSelling />
      <ShopByCategory />
      <WhyChooseUs />
    </div>
  );
};

export default HomePage;