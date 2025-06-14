import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoomPopup.css';

function JoinRoomPopup({ isVisible, onClose, onJoinRoom }) {
  const [roomCode, setRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      // Disable scroll & pointer events on body when popup is visible
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      // Re-enable on close
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    }

    // Cleanup if component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleJoinRoom = async () => {
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username: sessionStorage.getItem('username') }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join room');
      }

      const data = await response.json();
      sessionStorage.setItem('isCreator', false);
      sessionStorage.setItem('room', roomCode);
      onJoinRoom(data.room);
      navigate('/mmsw/streamingroom');
    } catch (error) {
      console.error('Error joining room:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="popup-overlay" style={{ pointerEvents: 'auto' }}>
      <div className="popup-content" style={{ pointerEvents: 'auto' }}>
        <h2>Join Room</h2>
        <label>
          Room Code:
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="popup-buttons">
          <button className="join-room-button" onClick={handleJoinRoom}>
            Join Room
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomPopup;
