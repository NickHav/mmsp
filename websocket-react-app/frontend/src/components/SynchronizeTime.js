import React, { useEffect, useRef } from 'react';
import './SynchronizeTime.css';

function SynchronizeTime({ timestamp, onClose, syncType, videoElement }) {
  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = () => {
    if (syncType === 'send' && videoElement) {
      videoElement.pause();
      videoElement.currentTime = timestamp;
      const ws = window.existingWebSocket;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ 
          type: 'synchronizeTime',
          timestamp, 
          user: sessionStorage.getItem('username'),
          roomCode: sessionStorage.getItem('room') }));
        onClose();
      }
    } else if (syncType === 'received' && videoElement) {
      videoElement.pause();
      videoElement.currentTime = timestamp;
      onClose();
    }
  };

  return (
    <div className="synchronize-time-overlay">
      <div className="synchronize-time-box" ref={boxRef}>
        <p>
          {syncType === 'send'
            ? '⏰ Current Timestamp:'
            : '🔄 Sync request received! Target timestamp:'}
          <br />
          <strong>{timestamp?.toFixed(2)}s</strong>
        </p>
        <button className="send-timestamp-button" onClick={handleAction}>
          {syncType === 'send' ? 'Send' : 'Sync'}
        </button>
      </div>
    </div>
  );
}

export default SynchronizeTime;
