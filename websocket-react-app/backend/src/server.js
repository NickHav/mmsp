const apiRoutes = require('./apis/apiRoutes'); 
const { usernames, rooms, sharedIPAddress } = require('./utils/sharedState'); // Import the rooms map
const { setupWebSocket } = require('./utils/websocketHandler'); 
const videoRoutes = require('./apis/videoRoutes');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const fs = require('fs');
const { getLocalIPAddress } = require('./utils/sharedFunctions');
const PORT = process.env.PORT || 5000;

// const localIP = getLocalIPAddress(); // Get the local IP address
// // Generate the config.json file
// const configPath = path.join(__dirname, '../../frontend/public/config.json');

// const configData = { serverIP: localIP };

// Point to the correct public directory (relative to server.js)
const publicPath = path.join(__dirname, '../public');
app.use('/public', express.static(publicPath));

//fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf-8');
// Για να κάνουμε parse τα JSON body των requests
app.use(express.json());

// Serve static αρχεία για το React app
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Serve static αρχεία για τα βίντεο και τις εικόνες
app.use('/images', express.static(path.join(__dirname,'../Images')));

app.use('/api', apiRoutes);

app.get('/mmps', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

app.use('/video', videoRoutes);

// Serve αρχες υποτίτλων
app.use('/subtitles', express.static(path.join(__dirname, '../Subtitles')));

// Serve React app για όλες τις άλλες διαδρομές
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/stream')) {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  } else {
    next();
  }
});

// Set up WebSocket handling
setupWebSocket(wss, usernames);


server.listen(PORT, () => {
  console.log(`Server is running on http://${sharedIPAddress}:${PORT}`);
});