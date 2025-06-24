import React, { useEffect, useRef, useState } from 'react';
import wsManager from './WebSocketManager';
import './SynchronizeTime.css';

function SynchronizeTime({ timestamp, onClose, syncType, videoElement }) {
  const boxRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [waitingForUsers, setWaitingForUsers] = useState(false);

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

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'allUsersSynchronized') {
          setCountdown(5);
          setWaitingForUsers(false);
        }
      } catch (e) {}
    };
    wsManager.addMessageListener(handleMessage);
    return () => {
      wsManager.removeMessageListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Start video and close popup
      if (videoElement) {
        videoElement.play();
      }
      onClose();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, videoElement, onClose]);

  const handleAction = () => {
    setWaitingForUsers(true);
    if (syncType === 'send' && videoElement) {
      videoElement.pause();
      videoElement.currentTime = timestamp;

      wsManager.send(JSON.stringify({
        type: 'synchronizeTime',
        timestamp,
        user: sessionStorage.getItem('username'),
        roomCode: sessionStorage.getItem('room')
      }));
    } else if (syncType === 'received' && videoElement) {
      videoElement.pause();
      videoElement.currentTime = timestamp;
      wsManager.send(JSON.stringify({
        type: 'syncAccepted',
        user: sessionStorage.getItem('username'),
        roomCode: sessionStorage.getItem('room')
      }));
    }
  };

  return (
    <div className="synchronize-time-overlay">
      <div className="synchronize-time-box" ref={boxRef}>
        {countdown === null ? (
          waitingForUsers ? (
            <p>⏳ Waiting for all the users to accept...</p>
          ) : (
            <>
              <p>
                {syncType === 'send'
                  ? '🕒 Current Timestamp:'
                  : '🔄 Sync request received! Target timestamp:'}
                <br />
                <strong>{timestamp?.toFixed(2)}s</strong>
              </p>
              <button className="send-timestamp-button" onClick={handleAction}>
                {syncType === 'send' ? 'Send' : 'Sync'}
              </button>
            </>
          )
        ) : (
          <p>
            ✅ All users synchronized!<br />
            Starting in <strong>{countdown}</strong>...
          </p>
        )}
      </div>
    </div>
  );
}

export default SynchronizeTime;