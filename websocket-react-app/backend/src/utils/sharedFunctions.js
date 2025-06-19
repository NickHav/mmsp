const os = require('os');

function generateRoomCode(length = 6) {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address; 
        }
      }
    }
    return '127.0.0.1'; 
  }

module.exports = { generateRoomCode, getLocalIPAddress };