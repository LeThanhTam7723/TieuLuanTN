import React, { useState } from "react";
import ChatBotService from "../../API/ChatBotService";
import { useNavigate } from "react-router-dom";

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
        role: "assistant",
        content: "Xin chào 👋 Tôi là AI hỗ trợ. Bạn cần giúp gì?"
        }
    ]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);

        setInput("");
        setLoading(true); // 🔵 bắt đầu đợi API

        try {
            const reply = await ChatBotService.askChatBot(input);

            const botMsg = { role: "assistant", content: reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "❌ Có lỗi xảy ra, vui lòng thử lại." }
            ]);
        } finally {
            setLoading(false); // 🟢 API trả về (thành công hay lỗi)
        }
    };
    const navigate = useNavigate();


    return (
        <>
        {!open && (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-20 right-5 w-14 h-14 
                        rounded-full bg-blue-600 text-white 
                        font-bold text-lg shadow-lg 
                        hover:bg-blue-700 transition
                        z-[9999]"
            >
                AI
            </button>
        )}
        <button
            onClick={() => window.open(
            "https://www.facebook.com/messages/t/743582288827754",
            "_blank",
            "noopener,noreferrer"
        )}
            className="fixed bottom-5 right-5 w-14 h-14 
                        rounded-full bg-blue-600 text-white 
                        font-bold text-lg shadow-lg 
                        hover:bg-blue-700 transition
                        z-[9999]"
            title="Thu nhỏ chatbot"
        >
            💬
        </button>
        {open && (
            <div className="fixed bottom-5 right-5 w-[360px] p-4 bg-white border rounded-lg shadow-lg z-[9999]">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">Chatbot AI</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-red-500 
                                text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="h-[280px] overflow-y-auto mb-2 space-y-2 text-sm">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-[75%] break-words
                                ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-600 text-white"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* ⏳ Loading của bot */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-3 py-2 rounded-lg bg-gray-600 text-white italic">
                                Bot đang trả lời...
                            </div>
                        </div>
                    )}
                </div>


                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Hỏi gì đó..."
                    />
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        Gửi
                    </button>
                </div>
            </div>
        )}
        
        </>
        
    );
};

export default ChatBot;
