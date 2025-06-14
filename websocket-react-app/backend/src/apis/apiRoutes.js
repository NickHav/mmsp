const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { usernames, rooms } = require('../utils/sharedState'); 
const generateRoomCode = require('../utils/sharedFunctions').generateRoomCode; // Εισάγουμε τη συνάρτηση generateRoomCode
const router = express.Router();
const path = require('path');
const fs = require('fs');
// Directories για τα βίντεο και τις εικόνες
const videoDirectory = 'C:\\Users\\nicko\\Documents\\Videos';
const imageDirectory = 'C:\\Users\\nicko\\Documents\\Images';

// API route για να ελέγξουμε αν το username είναι διαθέσιμο
router.post('/check-username', (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ available: false, message: 'Username cannot be empty.' });
  }

  if (usernames.has(username)) {
    return res.status(409).json({ available: false, message: 'Username is already taken.' });
  }

  return res.status(200).json({ available: true, message: 'Username is available.' });
});

// API route για να αποθηκεύσουμε τον user
router.post('/store-user', (req, res) => {
    
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ available: false, message: 'Username cannot be empty.' });
  }

  if (usernames.has(username)) {
    return res.status(409).json({ available: false, message: 'Username is already taken.' });
  }

  const connectionid = uuidv4(); // Generate το connection ID από το uuid
  // Αποθήκευση του username και connection ID στο shared state
  usernames.set(username, { connectionid });
 
  return res.status(200).json({
    available: true,
    username,
    connectionid,
    message: 'User submitted.',
  });
});

// API endpoint για να πάρουμε τα βίντεο και τις εικόνες
router.get('/videos', (req, res) => {
  try {
    //  Έλεγχος αν οι φάκελοι υπάρχουν
    if (!fs.existsSync(videoDirectory)) {
      return res.status(500).json({ error: 'Video directory does not exist' });
    }
    if (!fs.existsSync(imageDirectory)) {
      return res.status(500).json({ error: 'Image directory does not exist' });
    }

    // Διαβάζουμε τα αρχεία βίντεο
    const videoFiles = fs.readdirSync(videoDirectory).filter((file) =>
      ['.mp4', '.avi', '.mkv', '.mov', '.flv'].includes(path.extname(file).toLowerCase())
    );

    // Διαβάζουμε τα αρχεία εικόνας
    const imageFiles = fs.readdirSync(imageDirectory).filter((file) =>
      ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
    );

    // Αντιστοιχίζουμε τα βίντεο με τις εικόνες
    const videosWithImages = videoFiles.map((video) => {
      const videoBaseName = path.basename(video, path.extname(video)).toLowerCase();

      const matchingImage = imageFiles.find((image) => {
        const imageBaseName = path.basename(image, path.extname(image)).toLowerCase();
        return imageBaseName.includes(videoBaseName);
      });

      return {
        title: video,
        image: matchingImage ? `/images/${matchingImage}` : null, // Εικόνα αν υπάρχει, αλλιώς null
      };
    });

    res.json(videosWithImages);
  } catch (error) {
    console.error('Error reading directories:', error);
    res.status(500).json({ error: 'Failed to retrieve video files' });
  }
});

// API route για να δημιουργήσουμε ένα δωμάτιο
router.post('/rooms/create', (req, res) => {
  const { roomName, numberOfUsers, roomCode, movie, createdBy } = req.body;

  if (!roomName || !numberOfUsers || !roomCode || !createdBy) {
    return res.status(400).json({ error: 'Missing required room details' });
  }

  // Save the room details in the rooms map
  rooms[roomCode] = {
    roomName,
    numberOfUsers,
    createdBy,
    movie,
    users: [], // Initialize an empty array for users in the room
    chatMessages: [],
  };
  rooms[roomCode].users.push(createdBy); // Add the creator to the room

  console.log(`Room created: ${roomCode}`, rooms[roomCode]);
  res.status(201).json({ message: 'Room created successfully', roomCode });
});

// API route για να προσθέσουμε έναν χρήστη σε ένα δωμάτιο
router.post('/rooms/join', (req, res) => {
  const { roomCode, username } = req.body;

  if (!roomCode || !username) {
    return res.status(400).json({ error: 'Room code and username are required' });
  }

  const room = rooms[roomCode];

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Add the user to the room's users array if not already present
  if (room.users.includes(username)) {
    return res.status(409).json({ error: 'User already in room' });
  }
  if (room.users.length >= room.numberOfUsers) {
    return res.status(403).json({ error: 'Room is full' });
  }
  // Add the user to the room
  room.users.push(username);
  
  console.log(`User ${username} joined room ${roomCode}`);
  res.status(200).json({ message: 'Joined room successfully', room });
});

router.post('/rooms/removeUser', (req, res) => {
  const { roomCode, username } = req.body;
  console.log('Remove user request:', req.body); // Log the request body
  if (!roomCode || !username) {
    return res.status(400).json({ error: 'Room code and username are required' });
  }

  const room = rooms[roomCode];

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Remove the user from the room's users array
  const userIndex = room.users.indexOf(username);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found in room' });
  }

  room.users.splice(userIndex, 1); // Remove the user from the array

  console.log(`User ${username} removed from room ${roomCode}`);
  res.status(200).json({ message: 'User removed from room successfully', room });
});

module.exports = router; 