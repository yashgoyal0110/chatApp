
import React, { useState, useEffect } from "react";
import io from "socket.io-client";


const socket = io("http://localhost:3000");

const ChatApp = () => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

    socket.on("message", (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

  
    return () => {
      socket.off("message"); 
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      setMessage(""); 
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
