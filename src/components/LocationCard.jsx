import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LocationCard.css';

const LocationCard = ({ id, name, location, hours, price, reviews, imageUrl }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link to={`/fitness/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="location-card">
        <div className="card-header">
          <img src={imageUrl} alt={name} className="location-image" />
          <button 
            className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor" 
              strokeWidth="2"
              className="heart-icon"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
        <div className="location-info">
          <div className="main-info">
            <h3 className="location-name">{name}</h3>
            <p className="location-address">{location}</p>
          </div>

          <div className="price-box">
            <span className="price-amount">{price}</span>
            <span className="price-unit">บาท/คน</span>
          </div>
          
          <div className="time-review-info">
            <div className="time-info">
              <span className="hours-label">เปิด - ปิด</span>
              <span className="hours-value">{hours}</span>
            </div>
            
            <div className="review-box">
              <div className="score-box">
                <span className="rating-score">8.5</span>
              </div>
              <div className="review-details">
                <span className="review-count">{reviews.split(' ')[0]}</span>
                <span className="review-text">ความคิดเห็นจากผู้ใช้งาน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LocationCard;
