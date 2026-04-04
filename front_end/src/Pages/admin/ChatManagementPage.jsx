import React, { useEffect, useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { push, ref, set ,query, orderByChild, equalTo,get,onChildAdded, onValue} from "firebase/database";
import { db } from "../../firebase/config";

const ChatManagement = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser] = useState("admin"); // 1 = admin, bạn có thể thay đổi

  // Lấy danh sách conversations
  useEffect(() => {
    const conversationsRef = ref(db, 'conversations');
    
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const conversationsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setConversations(conversationsList);
        
        // Tự động chọn conversation đầu tiên nếu chưa có conversation nào được chọn
        if (!selectedChat && conversationsList.length > 0) {
          setSelectedChat(conversationsList[0]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Lấy messages theo conversation_id
  useEffect(() => {
    if (!selectedChat) return;

    const messagesRef = ref(db, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderByChild('conversation_id'),
      equalTo(selectedChat.id)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedChat]);

  const filteredConversations = conversations.filter(conv => {
    const userId = currentUser === "admin" ? conv.user_1 : conv.user_2;
    return userId?.toString().includes(searchTerm);
  });

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);
      
      set(newMessageRef, {
        conversation_id: selectedChat.id,
        sender: currentUser,
        content: message.trim(),
        read: false,
        timestamp: Date.now()
      });

      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  const getOtherUserId = (conv) => {
    return currentUser === 1 ? conv.user_2 : conv.user_1;
  };

  const getLastMessage = (conv) => {
    const convMessages = messages.filter(msg => msg.conversation_id === conv.id);
    if (convMessages.length > 0) {
      return convMessages[convMessages.length - 1].content;
    }
    return 'Chưa có tin nhắn';
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Tin nhắn {currentUser === "admin" ? '(Admin)' : '(User)'}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo User ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách cuộc trò chuyện */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="text-4xl mr-3">
                  {currentUser === "admin" ? '👤' : '👨‍💼'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {currentUser === "admin" ? `User ${conv.user_2}` : `Admin`}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatConversationTime(conv.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    ID: {conv.id}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Header chat */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-4xl mr-3">
                  {currentUser === "admin" ? '👤' : '👨‍💼'}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {currentUser === "admin" ? `User ${selectedChat.user_2}` : 'Admin'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Conversation ID: {selectedChat.id}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Khu vực tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === currentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${msg.sender === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                        {!msg.read && msg.sender === currentUser && (
                          <span className="text-xs ml-2">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Khu vực nhập tin nhắn */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button onClick={() => {}} className="p-2 hover:bg-gray-100 rounded-full">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <button onClick={() => {}} className="p-2 hover:bg-gray-100 rounded-full">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
