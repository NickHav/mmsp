const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Directory που περιέχει τα βίντεο
const videoDirectory = path.join(__dirname, '../../public/videos');

// Stream αρχείο βίντεο
router.get('/stream/:videoTitle', (req, res) => {
  const requestedTitle = req.params.videoTitle.toLowerCase();

  // Find the first file in the directory that matches the title (ignoring extension)
  const files = fs.readdirSync(videoDirectory);
  const matchedFile = files.find(file => {
    const fileTitle = path.parse(file).name.toLowerCase();
    return fileTitle === requestedTitle;
  });

  if (!matchedFile) {
    return res.status(404).send('Video not found');
  }

  const videoPath = path.join(videoDirectory, matchedFile);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4', 
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

module.exports = router;