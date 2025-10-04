import React, { useState } from 'react';

interface Product {
  _id: string;
  title: string;
  desc: string;
  pricePerKg: number;
  discount?: number;
  weights: string[];
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number, weight: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { _id, title, desc, pricePerKg, discount, weights, image } = product;
  const [selectedWeight, setSelectedWeight] = useState(weights[0]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/assets/placeholder.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  const calculatePrice = () => {
    const weightValue = parseFloat(selectedWeight.replace(/[^0-9.]/g, ''));
    const unit = selectedWeight.replace(/[^a-zA-Z]/g, '');

    let weightInKg = weightValue;
    if (unit.toLowerCase() === 'g') {
      weightInKg = weightValue / 1000;
    }

    let price = pricePerKg * weightInKg;
    if (discount) {
      price = price * (1 - discount / 100);
    }
    return Math.ceil(price);
  };

  const handleWeightChange = (weight: string) => {
    setSelectedWeight(weight);
  };

  const handleAddToCart = () => {
    onAddToCart(_id, 1, selectedWeight);
  };

  return (
    <div className="card h-100 product-card">
      <div className="product-image-container">
        <img 
          src={getImageUrl(image)} 
          className="product-image" 
          alt={title}
          onError={(e) => {
            e.currentTarget.src = '/assets/placeholder.jpg';
          }}
        />
        {discount && <span className="discount-badge">{discount}% OFF</span>}
        <button className="wishlist-btn">
          <i className="bi bi-heart"></i>
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{desc}</p>
        <div className="weights-container mb-3">
          {weights.map((w, idx) => (
            <button
              key={idx}
              className={`weight-btn ${selectedWeight === w ? 'active' : ''}`}
              onClick={() => handleWeightChange(w)}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="price-add-container">
          <div className="price">
            {discount ? (
              <>
                <span className="original-price">
                  ₹{Math.ceil(pricePerKg * parseFloat(selectedWeight.replace(/[^0-9.]/g, '')) / (selectedWeight.includes('g') ? 1000 : 1))}
                </span>
                <span className="discounted-price">₹{calculatePrice()}</span>
              </>
            ) : (
              <span className="regular-price">₹{calculatePrice()}</span>
            )}
          </div>
          <button className="add-btn" onClick={handleAddToCart}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
