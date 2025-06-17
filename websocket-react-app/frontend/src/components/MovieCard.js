import React from 'react';
import './MovieCard.css';

function MovieCard({ imageUrl, title, description, onClick, isSelected, onStreamToRoom }) {
  return (
    <div className={`movie-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      {/* <button onClick={onClick}>Play</button> */}
      <div className="stream-to-room-container">
        <button
          className={`stream-to-room-button ${isSelected ? 'selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); 
            onStreamToRoom(title);
          }}
        >
          {isSelected ? 'Selected' : 'Stream to Room'}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;