import React, { useEffect, useRef, useState } from 'react';

function Messages({messages}){
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    return (
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <strong style={{ color: message.userColor }}>{message.username}:</strong>{' '} {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages;