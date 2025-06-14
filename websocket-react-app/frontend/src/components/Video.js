import React, { useRef, useEffect } from 'react';


function Video({ selectedMovie, subtitles, onRefReady }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && onRefReady) {
      onRefReady(videoRef.current);
    }
  }, [onRefReady]);

  return (
      <div className="grid_video">
        <video className="video"  ref={videoRef} src={selectedMovie.url} controls>
          
          {subtitles.map((subtitle) => (
            <track
              key={subtitle.lang}
              src={subtitle.url}
              kind="subtitles"
              label={subtitle.lang === 'en' ? 'English' : subtitle.lang === 'es' ? 'Spanish' : 'French'}
              srcLang={subtitle.lang}
              default={subtitle.lang === 'en'}
            />
          ))}
        </video>
      </div>    
  );
}

export default Video;