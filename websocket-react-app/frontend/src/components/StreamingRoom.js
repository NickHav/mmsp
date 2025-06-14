import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Video from './Video';
import Chat from './Chat';
import SynchronizeTime from './SynchronizeTime';
import wsManager from './WebSocketManager';
import './StreamingRoom.css';

function StreamingRoom() {
  const [isCreator, setIsCreator] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showSync, setShowSync] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [syncType, setSyncType] = useState('');
  const navigate = useNavigate();

  const handleMessageRef = useRef();

  handleMessageRef.current = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received message from server:', data);

    switch (data.type) {
      case 'roomState':
        const { movie, chatMessages } = data.room;
        setSelectedMovie(movie);
        loadSubtitles(movie.title);
        setMessages(chatMessages || []);
        break;
      case 'synchronizeTime':
        console.log(`Received synchronizeTime message: ${data.timestamp} from user: ${data.user}`);
        setTimestamp(data.timestamp);
        setSyncType('received');
        setShowSync(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem('isCreator') === 'true';
    setIsCreator(role);

    if (role) {
      const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));
      if (!movie || !movie.url) {
        console.error('No valid movie found in sessionStorage');
        navigate('/');
        return;
      }
      setSelectedMovie(movie);
      loadSubtitles(movie.title);
    } else {
      wsManager.send(
        JSON.stringify({
          type: 'requestRoomState',
          roomCode: sessionStorage.getItem('room'),
          user: sessionStorage.getItem('username'),
        })
      );
    }

    const onMessage = (event) => handleMessageRef.current(event);
    wsManager.addMessageListener(onMessage);
    console.log('WebSocketManager message listener added');

    return () => {
      wsManager.removeMessageListener(onMessage);
      console.log('WebSocketManager message listener removed');
    };
  }, [navigate]);

  const toggleSync = () => {
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      console.log('Current video time:', currentTime);
      setTimestamp(currentTime);
      setSyncType('send');
    }
    setShowSync(prev => !prev);
  };

  const loadSubtitles = (movieTitle) => {
    const subtitleFileName = movieTitle.replace(/\.[^/.]+$/, '');
    const languages = ['en', 'es', 'fr'];
    const subtitlePromises = languages.map(lang => {
      const subtitleUrl = `/subtitles/${subtitleFileName}_${lang}.vtt`;
      return fetch(subtitleUrl)
        .then(response => (response.ok ? { lang, url: subtitleUrl } : null))
        .catch(error => {
          console.error(`Error loading ${lang} subtitles:`, error);
          return null;
        });
    });

    Promise.all(subtitlePromises).then(results => {
      const validSubtitles = results.filter(subtitle => subtitle !== null);
      setSubtitles(validSubtitles);
    });
  };

  if (!selectedMovie) {
    return <p>Loading movie...</p>;
  }

  return (
    <div className="grid">
      <Video
        selectedMovie={selectedMovie}
        subtitles={subtitles}
        onRefReady={setVideoElement}
      />
      <Chat
        messages={messages}
        setMessages={setMessages}
        onToggleSync={toggleSync}
      />
      {showSync && (
        <SynchronizeTime
          syncType={syncType}
          timestamp={timestamp}
          onClose={() => setShowSync(false)}
          videoElement={videoElement}
        />
      )}
    </div>
  );
}

export default StreamingRoom;