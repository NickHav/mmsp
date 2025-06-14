import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Popup from './components/Popup';
import CreateRoomPopup from './components/CreateRoomPopup';
import JoinRoomPopup from './components/JoinRoomPopup';
import StreamingRoom from './components/StreamingRoom'; // Import the StreamingRoom component
import MovieCard from './components/MovieCard'; // Import the MovieCard component
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import './components/MovieCard.css';
import './App.css';
import './components/HeroSection.css';
import './components/Navbar.css';
import MainSeperator from './components/MainSeperator';
import RatingCircle from './components/RatingCircle';
import { Users, Bookmark, Search, Menu, X } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMovieForRoom, setSelectedMovieForRoom] = useState(null); // New state for the selected movie for streaming
  const [searchQuery, setSearchQuery] = useState('');
  const videoPlayerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const [isCreateRoomPopupVisible, setIsCreateRoomPopupVisible] = useState(false);
  const [isUsernamePopupVisible, setIsUsernamePopupVisible] = useState(true);
  const [isJoinRoomPopupVisible, setIsJoinRoomPopupVisible] = useState(false);
  const [serverIP, setServerIP] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [movieListFromAPI, setMovieListFromAPI] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentMovie, setCurrentMovie] = useState(null);
  const sliderIntervalRef = useRef(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [isMoviesLoaded, setIsMoviesLoaded] = useState(false);
  const [isMovieDetailsLoaded, setIsMovieDetailsLoaded] = useState(false);
  const [isVideosLoaded, setIsVideosLoaded] = useState(false);

  // Fetch the server IP address from the config.json file
  useEffect(() => {
    console.log('Set up Server IP');
    
    fetch('/config.json')
      .then((response) => response.json())
      .then((data) => {
        setServerIP(data.serverIP);
        setIsConfigLoaded(true); 
        console.log(`Server IP: ${serverIP}`);
      })
      .catch((error) => console.error('Error fetching server IP:', error));
  }, []);

  const handleUsernameSubmit = (name) => {
    setUsername(name);
    setIsPopupVisible(false);
  };


  useEffect(() => {
    if (!serverIP) return; // Don't run until serverIP is set

    console.log(`Fetch the movies json file from server: ${serverIP}`);
    fetch(`http://${serverIP}:5000/public/movies.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch movies');
        return response.json();
      })
      .then((data) => {
        setMovieList(data);
        setIsMoviesLoaded(true); 
      })
      .catch((error) => console.error('Error fetching movie data:', error));
  }, [serverIP]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      const apiKey = '757c734e';
      const promises = movieList.map(async (movie) => {
        try {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movie.title)}`);
          const data = await res.json();

          if (data.Response === 'True') {
            return {
              title: data.Title,
              genre: data.Genre,
              plot: data.Plot,
              poster: data.Poster,
              imdbRating: data.imdbRating,
            };
          } else {
            console.warn(`Movie not found: ${movie.title}`);
            return null;
          }
        } catch (err) {
          console.error(`Error fetching ${movie.title}:`, err);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const filteredResults = results.filter(Boolean); 
      setMovieListFromAPI(filteredResults);
      setIsMovieDetailsLoaded(true); 
    };

    if (movieList.length > 0) {
      fetchAllDetails();
    }
  }, [movieList]);

  useEffect(() => {
    if (movieListFromAPI.length > 0) {
      setCurrentMovie(movieListFromAPI[activeIndex]);
    }
  }, [activeIndex, movieListFromAPI]);

  useEffect(() => {
    if (movieListFromAPI.length === 0) return;

    const startSliderInterval = () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }

      sliderIntervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % movieListFromAPI.length);
      }, 8000); // 8 seconds
    };

    startSliderInterval();

    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [movieListFromAPI]);

  const resetSliderInterval = () => {
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    sliderIntervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % movieListFromAPI.length);
    }, 8000);
  };

  const handleNextMovie = () => {
    setActiveIndex((prev) => (prev + 1) % movieListFromAPI.length);
    resetSliderInterval();
  };

  const handlePrevMovie = () => {
    setActiveIndex((prev) =>
      prev === 0 ? movieListFromAPI.length - 1 : prev - 1
    );
    resetSliderInterval();
  };

  // useEffect(() => {
  //   const fetchMovieDetails = async () => {
  //     try {
  //       const response = await fetch('https://www.omdbapi.com/?apikey=757c734e&t=forest'); // Replace with your real API endpoint
  //       const data = await response.json();
  //       console.log(data);

  //       const selectedData = {
  //         Title: data.Title,
  //         Genre: data.Genre,
  //         Plot: data.Plot,
  //         Poster: data.Poster,
  //         imdbRating: data.imdbRating,
  //       };

  //       setMovieInfo(selectedData);
  //     } catch (error) {
  //       console.error('Error fetching movie info:', error);
  //     }
  //   };

  //   fetchMovieDetails();
  // }, []);


  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();

    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data);
        setIsVideosLoaded(true); // ✅ set flag here
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (
      isConfigLoaded &&
      isMoviesLoaded &&
      isMovieDetailsLoaded &&
      isVideosLoaded
    ) {
      setIsAppReady(true);
    }
  }, [isConfigLoaded, isMoviesLoaded, isMovieDetailsLoaded, isVideosLoaded]);

  const initializePlayer = () => {
    if (videoPlayerRef.current) {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
        playerInstanceRef.current = null;
      }

      playerInstanceRef.current = videojs(videoPlayerRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
      });

      playerInstanceRef.current.src({
        src: `http://${serverIP}:5000/video/stream/${selectedVideo}`,
        type: 'video/mp4',
      });

      const subtitleFileName = selectedVideo.replace(/\.[^/.]+$/, '');

      const subtitleTracks = [
        { srclang: 'en', label: 'English', src: `http://${serverIP}:5000/subtitles/${subtitleFileName}_en.vtt` },
        { srclang: 'es', label: 'Spanish', src: `http://${serverIP}:5000/subtitles/${subtitleFileName}_es.vtt` },
        { srclang: 'fr', label: 'French', src: `http://${serverIP}:5000/subtitles/${subtitleFileName}_fr.vtt` },
      ];

      subtitleTracks.forEach((track) => {
        playerInstanceRef.current.addRemoteTextTrack(
          {
            kind: 'subtitles',
            src: track.src,
            srclang: track.srclang,
            label: track.label,
          },
          false
        );
      });

      playerInstanceRef.current.on('error', () => {
        console.error('Video.js player encountered an error');
      });
    }
  };

  const handleVideoSelection = (videoTitle) => {
    if (selectedVideo) {
      setSelectedVideo(null);
      setTimeout(() => {
        setSelectedVideo(videoTitle);
      }, 0);
    } else {
      setSelectedVideo(videoTitle);
    }
  };
  const handleStreamToRoom = (movieTitle) => {
    setSelectedMovieForRoom(movieTitle);
    setIsCreateRoomPopupVisible(true); // <-- show popup
    console.log(`Selected movie for streaming: ${movieTitle}`);
  };


  const handleCreateRoom = (roomName, numberOfUsers) => {
    console.log(`Room Created: ${roomName}, Max Users: ${numberOfUsers}`);
    setIsPopupVisible(false);
  };

  const handleJoinRoom = (roomCode) => {
    console.log(`Joining Room: ${roomCode}`);
    setIsJoinRoomPopupVisible(false);
  };

  useEffect(() => {
    if (selectedVideo) {
      initializePlayer();
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
        playerInstanceRef.current = null;
      }
    };
  }, [selectedVideo]);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Routes>
      {/* Main application layout */}
      <Route
        path="/"
        element={
          <div className="App">
            <div className='navbar-wrapper'>
              <div className="navbar">
                <div className='navbar-logo'>
                  <img className='logo-img' src='https://img.icons8.com/?size=100&id=KVmY50QrSUEu&format=png&color=FFFFFF' />
                  <div className="logo-text">Mmsp</div>
                </div>
                <div className="navbar-controls">
                  {isMenuOpen ? (
                    <X
                      className="menu-toggle open"
                      size={28}
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Close menu"
                    />
                  ) : (
                    <Menu
                      className="menu-toggle"
                      size={28}
                      onClick={() => setIsMenuOpen(true)}
                      aria-label="Open menu"
                    />
                  )}
                  <Search className="search-icon" size={24} onClick={() => setIsSearchOpen(!isSearchOpen)} />
                </div>
                <div className='search-wrapper'>
                  <div ref={searchContainerRef} className={`search-container ${isSearchOpen ? 'open' : ''}`}>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                  <li><a href="#">Movies</a></li>
                  <li><a href="#">Shows</a></li>
                  <li><a href="#">Streaming</a></li>
                  <li><a href="#">Discover</a></li>
                </ul>
              </nav>
            </div>
            <div
              className="hero-section"
              style={{
                '--hero-background': currentMovie ? `url(${currentMovie.poster})` : 'none',
              }}
            >
              <div className='hero-grid-wrapper'>
                <div className="hero-grid">
                  <div className="title-wrapper">
                    <h1>{currentMovie ? currentMovie.title : 'Loading...'}</h1>
                  </div>
                  <div className='description-wrapper'>
                    <p>{currentMovie ? currentMovie.plot : ''}</p>
                  </div>
                  <div className='tags-wrapper'>
                    <div className="genres">
                      <span className="line" />
                      <ul className="tags">
                        {currentMovie?.genre && currentMovie.genre !== 'N/A' && currentMovie.genre.split(', ').map((genre, index) => (
                          <li key={index}>{genre}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="actions-wrapper">
                    <div className='actions-buttons-wrapper'>
                      <button className="watch-now">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
                          viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z">
                          </path>
                        </svg>
                        Watch Now</button>
                      <button className="bookmark">
                        <Bookmark className='bookmark-icon' size={28} />
                      </button>
                    </div>
                    <div className="rating-wrapper">
                      {currentMovie?.imdbRating && !isNaN(parseFloat(currentMovie.imdbRating)) && (
                        <RatingCircle rating={parseFloat(currentMovie.imdbRating)} />
                      )}
                    </div>
                  </div>
                  <div className='slide-controls'>
                    <div className='slide-nav'>
                      <button className='slide-left-button' onClick={handlePrevMovie}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" className="slide-left-arrow">
                          <path d="m15 18-6-6 6-6"></path>
                        </svg>
                      </button>
                      <div className="slider-dots">
                        {movieListFromAPI.map((_, index) => (
                          <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => {
                              setActiveIndex(index);
                              resetSliderInterval();
                            }}
                          />
                        ))}
                      </div>
                      <button className='slide-left-button' onClick={handleNextMovie}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" className="slide-right-arrow">
                          <path d="m9 18 6-6-6-6"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div
                key={activeIndex} // restart animation on index change
                className="progress-bar-fill"
              />
            </div>
            <CreateRoomPopup
              isVisible={isCreateRoomPopupVisible}
              onClose={() => {
                setIsCreateRoomPopupVisible(false);
                setSelectedMovieForRoom(null);
              }}
              onCreateRoom={handleCreateRoom}
              selectedMovie={{
                title: selectedMovieForRoom, // Pass the selected movie title
                url: `http://${serverIP}:5000/video/stream/${selectedMovieForRoom}`, // Construct the movie URL
              }}
            />
            {isUsernamePopupVisible && (
              <Popup
                serverIP={serverIP}
                onSubmit={handleUsernameSubmit}
                onClose={() => setIsUsernamePopupVisible(false)}
              />
            )}
            <JoinRoomPopup
              isVisible={isJoinRoomPopupVisible}
              onClose={() => setIsJoinRoomPopupVisible(false)}
              onJoinRoom={handleJoinRoom}
            />
            <main className={isPopupVisible ? 'blurred' : ''}>
              <MainSeperator />
              <div className="movie-list">
                {filteredVideos.map((video, index) => (
                  <MovieCard
                    key={index}
                    imageUrl={video.image || 'https://via.placeholder.com/150'}
                    title={video.title}
                    description={video.description}
                    onClick={() => handleVideoSelection(video.title)}
                    isSelected={selectedMovieForRoom === video.title}
                    onStreamToRoom={handleStreamToRoom}
                  />
                ))}
              </div>
              {/* {selectedVideo && (
                <div className="video-player">
                  <h2>Now Playing: {selectedVideo}</h2>
                  <div data-vjs-player>
                    <video
                      ref={videoPlayerRef}
                      className="video-js"
                      width="600"
                    ></video>
                  </div>
                  <button
                    className="hidden-button"
                    onClick={() => {
                      setSelectedVideo(null);
                    }}
                  >
                    Close Player
                  </button>
                </div>
              )} */}
            </main>
            {!isJoinRoomPopupVisible && (
              <button
                className="fab-join-room"
                onClick={() => setIsJoinRoomPopupVisible(true)}
                aria-label="Join Room"
              ><Users size={28} />
              </button>
            )}
          </div>
        }
      />
      {/* Streaming Room Route */}
      <Route path="/mmsw/streamingroom" element={<StreamingRoom />} />
    </Routes>
  );
}

export default App;