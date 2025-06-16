const { handleRoomMessage } = require('./roomsHandling');
const url = require('url');
const usernameConnectionIdMatch = require('../validation/usernameValidation');
const { rooms, sharedState } = require('../utils/sharedState');

function heartbeat() {
  this.isAlive = true;
}

function setupWebSocket(wss, usernames) {
  sharedState.wss = wss; // Αποθηκεύουμε το WebSocket server στο shared state

  
  wss.on('connection', (ws, req) => {
    ws.on('pong', heartbeat);
    const queryParams = url.parse(req.url, true).query;

    if (!queryParams.username) {
      console.error('Missing username or connection ID');
      ws.close(); // Κλείνουμε τη σύνδεση αν λείπει το username ή το connection ID
      return;
    }
    console.log('New WebSocket connection established. Username: ' + queryParams.username + ' ID: ' + queryParams.connectionid);

    if (!usernameConnectionIdMatch(queryParams)) { // Ελέγχουμε αν το username και το connection ID ταιριάζουν
      ws.close(); // Κλείνουμε τη σύνδεση αν δεν ταιριάζουν
      return;
    }

    ws.on('pong', () => {
      ws.isAlive = true; 
    });

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'username') {
          const username = parsedMessage.username;

          if (!username || username.trim() === '') {
            ws.send(JSON.stringify({ type: 'error', message: 'Username cannot be empty.' }));
            return;
          }

          ws.send(JSON.stringify({ type: 'success', message: `Username ${username} registered successfully.` }));
          ws.id = username; // Αποθηκεύουμε το username στο WebSocket
        } else {
          console.log('Received message:', parsedMessage);
          handleRoomMessage(parsedMessage);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(ws.id);
      if (ws.id) {
        usernames.delete(ws.id); // Remove the username from the shared state
        console.log(`WebSocket connection closed for username: ${ws.id}`);

        // Check if the user is in any room and remove them
        for (const roomCode in rooms) {
          const room = rooms[roomCode];
          const userIndex = room.users.indexOf(ws.id);
          if (userIndex !== -1) {
            room.users.splice(userIndex, 1); // Remove the user from the room
            console.log(`User ${ws.id} removed from room ${roomCode}`);
            break; // Exit the loop once the user is removed
          }
        }

         for (const user of room.users) {
          const userWs = Array.from(sharedState.wss.clients).find((client) => client.id === user);
          if (userWs && userWs.readyState === WebSocket.OPEN) {
            userWs.send(JSON.stringify({ type: 'usersList', users: room.users }));
          }
        }
      }
    });
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', function close() {
    clearInterval(interval);
  });
}

module.exports = { setupWebSocket };