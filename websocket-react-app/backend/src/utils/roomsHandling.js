const { rooms, sharedState } = require('../utils/sharedState');

const handleRoomMessage = (parsedMessage) => {
    const roomCode = parsedMessage.roomCode;
    const room = rooms[roomCode];

    if (rooms[roomCode]) {
        if (parsedMessage.type === 'newChatMessage') {
            const messageContent = parsedMessage.messageContent;
            const username = parsedMessage.username;
            const userColor = parsedMessage.userColor;

            room.chatMessages.push({ username, text: messageContent, userColor });

            // Broadcast the new chat message to all users in the room
            for (const user of room.users) {
                const userWs = Array.from(sharedState.wss.clients).find((client) => client.id === user);

                if (userWs && userWs.readyState === WebSocket.OPEN) {
                    userWs.send(JSON.stringify({ type: 'newChatMessage', message: { username, text: messageContent, userColor } }));
                }
            }
        } else if (parsedMessage.type === 'requestUsersList') {
            for (const user of room.users) {
                const userWs = Array.from(sharedState.wss.clients).find((client) => client.id === user);
                if (userWs && userWs.readyState === WebSocket.OPEN) {
                    userWs.send(JSON.stringify({ type: 'usersList', users: room.users, }));
                }
            }
        } else if (parsedMessage.type === 'requestRoomState'){
            const user = parsedMessage.user;
            if (!room.users.includes(user)) {
              room.users.push(user);
            }

            const userWs = Array.from(sharedState.wss.clients).find((client) => client.id === user);
            userWs.send(
              JSON.stringify({
                type: 'roomState',
                room: {
                  movie: room.movie,
                  chatMessages: room.chatMessages || [],
                  users: room.users,  
                },
              })
            );       
        } else if( parsedMessage.type === 'synchronizeTime') {
            const timestamp = parsedMessage.timestamp;
            const user = parsedMessage.user;
            const username = parsedMessage.user;
            console.log(`Received synchronizeTime message: ${timestamp} from user: ${user}`);
            for (const user of room.users) {
                if (user === username) continue;
                const userWs = Array.from(sharedState.wss.clients).find((client) => client.id === user);
                if (userWs && userWs.readyState === WebSocket.OPEN) {
                    console.log(`Sending synchronizeTime message to user: ${user}`);
                    userWs.send(JSON.stringify({ type: 'synchronizeTime', timestamp, user }));
                }
            }
            
        } else {
            console.error('Unknown message type:', parsedMessage.type);
        }
    } else {
        console.error('Room not found:', roomCode);
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
    }
}
module.exports = { handleRoomMessage };