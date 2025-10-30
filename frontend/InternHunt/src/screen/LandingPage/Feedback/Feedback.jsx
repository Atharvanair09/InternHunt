import React, { useEffect, useState } from 'react';
import './Feedback.css';
import axios from 'axios';

const StarRow = ({ rating }) => (
  <div className="stars-row" aria-label={`Rating ${rating} out of 5`}>
    {[1,2,3,4,5].map(n => (
      <span key={n} className={n <= rating ? 'star filled' : 'star'}>★</span>
    ))}
  </div>
);

const Feedback = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/feedback')
      .then(res => setReviews(res.data || []))
      .catch(() => setReviews([]));
  }, []);

  const list = reviews.length > 0 ? reviews : [
    { review_text: "InternHunt helped me land my first internship at an amazing tech startup. The dashboard and application process were super easy.", reviewer_name: "Ankit", rating: 5, source: "InternHunt" },
    { review_text: "The mentor matching feature on InternHunt is incredible. Connected with a pro who guided me through interviews.", reviewer_name: "Priya", rating: 5, source: "InternHunt" },
    { review_text: "Our batch grabbed verified industry opportunities thanks to InternHunt. Notifications and filtering are life-savers.", reviewer_name: "Rahul", rating: 4, source: "InternHunt" },
  ];

  const duplicated = [...list, ...list];

  return (
    <section className="carousel-section" id='carousel-section'>
      <h1 className="carousel-title">What <span>people</span> say</h1>
      <div className="carousel-slider">
        <div className="carousel-track">
          {duplicated.map((review, idx) => (
            <div className="carousel-item" key={idx}>
              <StarRow rating={review.rating || 5} />
              <div className="carousel-text">{review.review_text}</div>
              <div className="carousel-user">
                <span className="carousel-author">{review.reviewer_name}</span>
                <br />
                <span className="carousel-source">from {review.source || 'InternHunt Reviews'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;

