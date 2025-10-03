
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Primary Cuts',
    image: 'assets/meat1.jpg',
    link: '/shop'
  },
  {
    title: 'Organs',
    image: 'assets/Mutton_Kidney.jpg',
    link: '/shop'
  },
  {
    title: 'Special Cuts',
    image: 'assets/Mutton_Kheema.jpg',
    link: '/shop'
  },
  {
    title: 'Combos & Bulk Pack',
    image: 'assets/EventsPack.jpg',
    link: '/shop'
  },
  {
    title: 'Extras and Addons',
    image: 'assets/Extras_Addons.jpg',
    link: '/shop'
  }
];

const ShopByCategory: React.FC = () => {
  return (
    <section className="py-5 shop-by-category-section">
      <div className="container">
        <h2 className="text-center mb-2">Shop By Category</h2>
        <div className="mx-auto mb-4 section-divider"></div>
        <div className="row justify-content-center">
          {categories.map((category, index) => (
            <div className="col-md-2 col-sm-4 col-6 mb-4" key={index}>
              <Link to={category.link} className="category-link">
                <div className="category-image-container">
                  <img src={category.image} className="category-image" alt={category.title} />
                </div>
                <h5 className="category-title">{category.title}</h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
