import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRoomPopup.css';

function CreateRoomPopup({ isVisible, onClose, selectedMovie }) {
  const [roomName, setRoomName] = useState('');
  const [numberOfUsers, setNumberOfUsers] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Disable page scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const generateRoomPass = () => {
    const generatedPass = Math.random().toString(36).substr(2, 8);
    setRoomPass(generatedPass);
  };

  const handleNumberOfUsersChange = (e) => {
    const value = e.target.value;
    setNumberOfUsers(value);

    if (value < 2 || value > 5) {
      setErrorMessage('User number must be between 2 and 5');
    } else {
      setErrorMessage('');
    }
  };

  const handleCreateRoom = async () => {
    if (numberOfUsers < 2 || numberOfUsers > 5) {
      setErrorMessage('User number must be between 2 and 5');
      return;
    }

    const currentUser = sessionStorage.getItem('username');
    const roomDetails = {
      roomName,
      numberOfUsers,
      roomCode: roomPass,
      movie: selectedMovie,
      createdBy: currentUser,
    };

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create room');
      }

      const data = await response.json();
      console.log('Room created:', data);

      sessionStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
      sessionStorage.setItem('isCreator', true);
      sessionStorage.setItem('room', roomDetails.roomCode);

      if (data.message === 'Room created successfully') {
        navigate('/streamingroom');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setErrorMessage('Failed to create room. Please try again.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create Streaming Room</h2>
        <label>
          Selected Movie:
          <input
            type="text"
            value={selectedMovie?.title || ''}
            readOnly
            placeholder="No selected movie"
          />
        </label>
        <label>
          Room Name:
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
        </label>
        <label>
          Number of Users:
          <input
            type="number"
            value={numberOfUsers}
            onChange={handleNumberOfUsersChange}
            placeholder="Enter number of users"
            min="2"
            max="5"
            className={errorMessage ? 'error-input' : ''}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label>
          Room Pass:
          <input
            type="text"
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
            placeholder="Enter or generate a room pass"
          />
        </label>
        <button className="generate-pass-button" onClick={generateRoomPass}>
          Generate Pass
        </button>
        <div className="popup-buttons">
          <button className="create-room-button" onClick={handleCreateRoom}>
            Create Room
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomPopup;
