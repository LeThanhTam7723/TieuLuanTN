import React, { useEffect, useRef, useState } from "react";
import ChatBotService from "../../API/ChatBotService";
import { db } from "../../firebase/config";
import { push, ref, set ,query, orderByChild, equalTo,get,onChildAdded, onValue} from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";

const ChatBot = () => {
  const {user, isAdmin, loading} = useAuth();
  const [openAI, setOpenAI] = useState(false);
  const [openFirebase, setOpenFirebase] = useState(false);
  const [inputAI, setInputAI] = useState("");
  const [inputFirebase, setInputFirebase] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingFirebase, setLoadingFirebase] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [showMessageTooltip, setShowMessageTooltip] = useState(false);
  const [showFirebaseTooltip, setShowFirebaseTooltip] = useState(false);
  const [messagesAI, setMessagesAI] = useState([
    { role: "assistant", content: "Xin chào 👋 Tôi là AI hỗ trợ. Bạn cần giúp gì?" }
  ]);
  
  const [messagesFirebase, setMessagesFirebase] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const session = JSON.parse(localStorage.getItem("session"));
  const [userId, setUserId] = useState(null); 
  const messagesEndRef = useRef(null);
  //Tìm hoặc tạo conversation
  const findOrCreateConversation = async () => {
    try {
      const conversationsRef = ref(db, "conversations");
      const snapshot = await get(conversationsRef);

      if (snapshot.exists()) {
        const conversations = snapshot.val();
        
        // Tìm conversation có user_1 = 1 (admin) và user_2 = userId
        for (const [convId, conv] of Object.entries(conversations)) {
          if (
            (conv.user_1 === "admin" && conv.user_2 === userId) ||
            (conv.user_1 === userId && conv.user_2 === "admin")
          ) {
            return convId;
          }
        }
      }

      // Nếu không tìm thấy, tạo mới
      const newConvRef = push(conversationsRef);
      await set(newConvRef, {
        user_1: "admin", // Admin
        user_2: userId,
        created_at: Date.now()
      });

      return newConvRef.key;
    } catch (error) {
      console.error("Error finding/creating conversation:", error);
      return null;
    }
  };
  // Lắng nghe tin nhắn realtime
  useEffect(() => {
    if (session?.currentUser?.id) {
      setUserId(session.currentUser.id);
    };
    if (!openFirebase || !conversationId) return;

    const messagesRef = ref(db, "messages");
    const messagesQuery = query(
      messagesRef,
      orderByChild("conversation_id"),
      equalTo(conversationId)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const messages = [];
        snapshot.forEach((child) => {
          messages.push({
            id: child.key,
            ...child.val()
          });
        });

        // Sắp xếp theo timestamp
        const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
        
        // Chuyển đổi sang format hiển thị
        const formattedMessages = sortedMessages.map(msg => ({
          role: msg.sender === "admin" ? "assistant" : "user",
          content: msg.content,
          timestamp: msg.timestamp
        }));
        console.log(formattedMessages);

        setMessagesFirebase(formattedMessages);
      } else {
        setMessagesFirebase([
          { role: "assistant", content: "Xin chào! 👋 Tôi là tư vấn viên. Tôi có thể giúp gì cho bạn?" }
        ]);
      }
    });

    return () => unsubscribe();
  }, [conversationId, openFirebase]);

  // Khởi tạo conversation khi mở Firebase chat
  useEffect(() => {
    if (openFirebase && !conversationId) {
      findOrCreateConversation().then(convId => {
        setConversationId(convId);
      });
    }
  }, [openFirebase]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesFirebase]);
  

  const sendMessageAI = async () => {
    if (!inputAI.trim() || loadingAI) return;

    const userMsg = { role: "user", content: inputAI };
    setMessagesAI(prev => [...prev, userMsg]);
    setInputAI("");
    setLoadingAI(true);

    try {
      // Giả lập API call
      const reply = await ChatBotService.askChatBot(inputAI);
      const botMsg = { role: "assistant", content: reply };
      setMessagesAI(prev => [...prev, botMsg]);
    } catch (error) {
      setMessagesAI(prev => [
        ...prev,
        { role: "assistant", content: "❌ Có lỗi xảy ra, vui lòng thử lại." }
      ]);
    } finally {
      setLoadingAI(false);
    }
  };
  // Phần xử lý tin nhắn từ firebase
  
  const sendMessageFirebase = async () => {
    if (!inputFirebase.trim() || loadingFirebase || !conversationId) return;

    const userMsg = { role: "user", content: inputFirebase };
    setInputFirebase("");
    setLoadingFirebase(true);

    try {
      // Gửi tin nhắn lên Firebase
      const messagesRef = ref(db, "messages");
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        conversation_id: conversationId,
        sender: 2, // User
        content: inputFirebase,
        read: false,
        timestamp: Date.now()
      });

      // Tin nhắn sẽ được cập nhật tự động qua listener
    } catch (error) {
      console.error("Error sending message:", error);
      setMessagesFirebase(prev => [
        ...prev,
        { role: "assistant", content: "❌ Có lỗi xảy ra, vui lòng thử lại." }
      ]);
    } finally {
      setLoadingFirebase(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .group:hover .animate-shake-on-hover {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>

      {/* Nút AI - Gradient xanh dương sang tím */}
      {!openAI && (
        <div className="fixed bottom-44 right-6 z-[9999]">
          <button
            onClick={() => setOpenAI(true)}
            onMouseEnter={() => setShowAITooltip(true)}
            onMouseLeave={() => setShowAITooltip(false)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
            title="Mở chatbot AI"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300 animate-shake-on-hover">🤖</span>
          </button>
          
          {showAITooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
              Chat với tư vấn viên A.I
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      )}

      {/* Nút Message - Gradient Messenger */}
      <div className="fixed bottom-25 right-6 z-[9999]">
        <button
          onClick={() =>
            window.open(
              "https://www.facebook.com/messages/t/743582288827754",
              "_blank",
              "noopener,noreferrer"
            )
          }
          onMouseEnter={() => setShowMessageTooltip(true)}
          onMouseLeave={() => setShowMessageTooltip(false)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
          title="Chat qua Facebook Messenger"
        >
          <svg 
            className="w-8 h-8 group-hover:scale-125 transition-transform duration-300 animate-shake-on-hover" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.447 5.511 3.713 7.22V22l3.375-1.85c.9.25 1.852.384 2.837.384 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.535l-2.557-2.73-4.993 2.73 5.492-5.828 2.62 2.73 4.93-2.73-5.492 5.828z"/>
          </svg>
        </button>
        
        {showMessageTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            Chat qua message
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Nút Firebase Chat - Gradient cam đỏ */}
      {!openFirebase && (!isAdmin) && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setOpenFirebase(true)}
            onMouseEnter={() => setShowFirebaseTooltip(true)}
            onMouseLeave={() => setShowFirebaseTooltip(false)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-sm shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
            title="Chat qua hệ thống"
          >
            <span className="text-xs font-bold group-hover:scale-110 transition-transform duration-300 animate-shake-on-hover">CHAT</span>
          </button>
          
          {showFirebaseTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
              Chat qua hệ thống chính chủ
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      )}

      {/* Chatbot AI Window */}
      {openAI && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] border border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-lg">Chatbot AI</h3>
            </div>
            <button
              onClick={() => setOpenAI(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messagesAI.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loadingAI && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-600 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                  <span className="text-sm">Đang trả lời...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputAI}
                onChange={e => setInputAI(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessageAI()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loadingAI}
              />
              <button
                onClick={sendMessageAI}
                disabled={loadingAI || !inputAI.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Chat Window */}
      {openFirebase && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] border border-gray-200">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <h3 className="font-bold text-lg">Chat Hệ Thống</h3>
            </div>
            <button
              onClick={() => setOpenFirebase(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messagesFirebase.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loadingFirebase && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-600 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                  <span className="text-sm">Đang trả lời...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputFirebase}
                onChange={e => setInputFirebase(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessageFirebase()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                disabled={loadingFirebase}
              />
              <button
                onClick={sendMessageFirebase}
                disabled={loadingFirebase || !inputFirebase.trim()}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;