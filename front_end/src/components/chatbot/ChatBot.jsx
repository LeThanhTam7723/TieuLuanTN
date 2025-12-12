import React, { useState } from "react";
import { askChatBot } from "../../API/ChatBotService";

const ChatBot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);

        const reply = await askChatBot(input);

        const botMsg = { sender: "bot", text: reply };
        setMessages(prev => [...prev, botMsg]);

        setInput("");
    };

    return (
        <div style={{ width: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc" }}>
            <h2>Chatbot Gemini</h2>
            <div style={{ height: "300px", overflowY: "auto", marginBottom: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ margin: "5px 0" }}>
                        <b>{msg.sender === "user" ? "Bạn" : "Bot"}:</b> {msg.text}
                    </div>
                ))}
            </div>

            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Hỏi gì đó..."
                style={{ width: "80%", padding: "5px" }}
            />
            <button onClick={sendMessage} style={{ padding: "6px 10px", marginLeft: "5px" }}>
                Gửi
            </button>
        </div>
    );
};

export default ChatBot;
