const os = require('os');

function generateRoomCode(length = 6) {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address; // Return the first non-internal IPv4 address
        }
      }
    }
    return '127.0.0.1'; // Fallback to localhost if no external IP is found
  }

module.exports = { generateRoomCode, getLocalIPAddress };