import React, { useState, useEffect, useRef } from 'react';
import wsManager from './WebSocketManager';
import './Popup.css';
const { checkUsernameAvailability } = require('../utils/validation');

function Popup({ serverIP, onSubmit, onClose }) {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const focusableElements = modalRef.current.querySelectorAll('input, button');
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    first?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value.trim()) {
      setAvailabilityMessage('');
      setErrorMessage('Username cannot be empty.');
      return;
    }
    try {
      const isAvailable = await checkUsernameAvailability(value);
      if (isAvailable) {
        setAvailabilityMessage('Username is available!');
        setErrorMessage('');
      } else {
        setAvailabilityMessage('');
        setErrorMessage('Username is already taken.');
      }
    } catch (error) {
      setAvailabilityMessage('');
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Username cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/store-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error submitting user');
      }

      const data = await response.json();

      if (data.available) {
        // Use connectionid from backend or generate if missing
        let connectionid = data.connectionid;
        if (!connectionid) {
          connectionid = crypto.randomUUID();
        }

        // Build the WebSocket URL
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://${serverIP}:5000?username=${encodeURIComponent(data.username)}&connectionid=${encodeURIComponent(connectionid)}`;
        wsManager.connect(wsUrl);

        wsManager.send(JSON.stringify({ type: 'username', username: data.username }));

        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('connectionid', connectionid);
        onSubmit(data.username);
        onClose();
      } else {
        setErrorMessage('Username is not available.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error submitting user');
      console.error('Error submitting user:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef} role="dialog" aria-modal="true">
        <h2>Enter your username</h2>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <button onClick={handleSubmit}>Submit</button>
        {availabilityMessage && <p className="success">{availabilityMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Popup;