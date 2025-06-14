export const handleSendNewMessage = (newMessage, setNewMessage, setMessages, userColor) => {
  const username = sessionStorage.getItem('username') || 'Anonymous'; // Retrieve the username from session storage
  const roomCode = sessionStorage.getItem('room') || 'defaultRoomCode'; // Retrieve the room code from session storage
  const message = { username, text: newMessage, userColor }; // Create a message object with the username, text, and color
  const ws = window.existingWebSocket; // Retrieve the WebSocket connection stored globally

  if (newMessage.trim() !== '' && ws) {
    const username = sessionStorage.getItem('username') || 'Anonymous';
    // Send the message to the server via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'newChatMessage',
        messageContent: newMessage,
        username: username,
        roomCode: roomCode,
        userColor: userColor,
      }));
    }
    setNewMessage('');
  }

  // Add the message to the local state
  setMessages((prevMessages) => [...prevMessages, message]);

  // Clear the input field
  setNewMessage('');
};

export function updateVH() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}
