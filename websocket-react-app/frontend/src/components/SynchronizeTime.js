import React, { useEffect, useRef } from 'react';
import wsManager from './WebSocketManager';
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
      console.log('Attempting to send synchronizeTime message:');

      const ws = wsManager.getWebSocket && wsManager.getWebSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Websocket is open, sending synchronizeTime message:', timestamp);
        wsManager.send(JSON.stringify({ 
          type: 'synchronizeTime',
          timestamp, 
          user: sessionStorage.getItem('username'),
          roomCode: sessionStorage.getItem('room')
        }));
        onClose();
      } else {
        console.error('WebSocket is not open');
      }
    } else if (syncType === 'received' && videoElement) {
      console.log('Received synchronizeTime request, setting video to timestamp:', timestamp);
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