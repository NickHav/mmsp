import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import UsersList from './UsersList';
import Messages from './Messsages';
import { ClockFading, Smile, Send } from 'lucide-react';
import wsManager from './WebSocketManager';

function Chat({ messages, setMessages, onToggleSync }) {
  const [newMessage, setNewMessage] = useState('');
  const [userColor, setTextColor] = useState('#000000');
  const [users, setUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const openUserModal = () => setIsUserModalOpen(true);
  const closeUserModal = () => setIsUserModalOpen(false);

  useEffect(() => {
    // Request users list when component mounts
    wsManager.send(
      JSON.stringify({
        type: 'requestUsersList',
        roomCode: sessionStorage.getItem('room'),
      })
    );

    // Message handler
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'newChatMessage') {
        setMessages((prevMessages) => [...prevMessages.slice(-99), data.message]);
      } else if (data.type === 'usersList') {
        setUsers(data.users);
      }
    };

    wsManager.addMessageListener(handleMessage);

    return () => {
      wsManager.removeMessageListener(handleMessage);
    };
  }, [setMessages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    wsManager.send(
      JSON.stringify({
        type: 'newChatMessage',
        messageContent: newMessage,
        username: sessionStorage.getItem('username') || 'Anonymous',
        roomCode: sessionStorage.getItem('room') || 'defaultRoomCode',
        userColor: userColor,
      })
    );
    setNewMessage('');
  };

  return (
    <>
      <div className="grid_chat">
        <UsersList users={users} />
        <button className="toggle_users_button"
          onClick={openUserModal}
        >
          Display Users</button>
        <Messages messages={messages} />
        <div className="chat_tools">
          <label htmlFor="colorPicker">User Color</label>
          <input
            type="color"
            id="colorPicker"
            value={userColor}
            onChange={handleColorChange}
          />
          <ClockFading
            className="clock-icon"
            onClick={() => onToggleSync()}
            style={{ cursor: 'pointer', fontSize: '1.5em', marginLeft: 'auto' }}
          />
          <Smile
            className="emoji-toggle-icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Insert emoji"
          />

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="emoji_picker_wrapper">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setNewMessage((prev) => prev + emojiData.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>
        <div className="grid_input">
          <textarea
            className="message_input"
            placeholder="Your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>
          {/* <button
            className="message-button"
            id="message-button"
            onClick={handleSendMessage}
          >
            Send
          </button> */}
          <div className="message-button-wrapper">
          <Send
            className="message-button"
            onClick={() => handleSendMessage}
            title="Send Message"
          />
          </div>
        </div>
      </div>
      {isUserModalOpen && (
        <div className="users-modal" onClick={closeUserModal}>
          <div
            className="users-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">Online Users</div>
            <div className="modal-user-list">
              <ul className="user-list"> <UsersList users={users} /> </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;