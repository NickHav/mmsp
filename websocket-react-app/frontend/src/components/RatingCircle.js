import React from 'react';
import './RatingCircle.css'; 

const RatingCircle = ({ rating }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rating / 10) * circumference;

  return (
    <div className="rating-wrapper">
      <svg className="rating-circle" width="50" height="50" viewBox="0 0 50 50">
        <circle className="bg" cx="25" cy="25" r={radius} />
        <circle
          className="progress"
          cx="25"
          cy="25"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="rating-text"
        >
          {rating}
        </text>
      </svg>
    </div>
  );
};

export default RatingCircle;
