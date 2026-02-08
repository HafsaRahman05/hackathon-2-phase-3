"use client";

import { useState } from "react";
import { handleUserCommand } from "../../lib/chatbot";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    // Get bot reply
    const botReply = await handleUserCommand(input);
    setMessages(prev => [...prev, { sender: "bot", text: botReply }]);

    setInput(""); // Clear input
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h1>Todo AI Chatbot</h1>

      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your command..."
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 12px", marginLeft: "5px" }}>Send</button>
    </div>
  );
}
