import React, { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';

const ChatManagement = () => {
  const [conversations] = useState([
    { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Chào bạn, hẹn gặp lại!', time: '10:30', unread: 2, avatar: '🧑' },
    { id: 2, name: 'Trần Thị B', lastMessage: 'Cảm ơn bạn nhiều nhé', time: '09:15', unread: 0, avatar: '👩' },
    { id: 3, name: 'Lê Văn C', lastMessage: 'Ok, tôi sẽ gửi file cho bạn', time: 'Hôm qua', unread: 5, avatar: '👨' },
    { id: 4, name: 'Phạm Thị D', lastMessage: 'Cuộc họp lúc mấy giờ?', time: 'Hôm qua', unread: 0, avatar: '👧' },
    { id: 5, name: 'Hoàng Văn E', lastMessage: 'Đã nhận được rồi, cảm ơn!', time: 'T2', unread: 1, avatar: '🧔' },
  ]);

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Chào bạn! Bạn khỏe không?', sender: 'them', time: '10:00' },
    { id: 2, text: 'Mình khỏe, còn bạn?', sender: 'me', time: '10:05' },
    { id: 3, text: 'Mình cũng khỏe. Hôm nay có rảnh không?', sender: 'them', time: '10:10' },
    { id: 4, text: 'Có đấy, bạn muốn gặp à?', sender: 'me', time: '10:15' },
    { id: 5, text: 'Ừ, mình muốn bàn về dự án mới', sender: 'them', time: '10:20' },
    { id: 6, text: 'Ok, chiều nay 3h được không?', sender: 'me', time: '10:25' },
    { id: 7, text: 'Được đấy! Chào bạn, hẹn gặp lại!', sender: 'them', time: '10:30' },
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách cuộc trò chuyện */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat.id === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-4xl mr-3">{conv.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header chat */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl mr-3">{selectedChat.avatar}</div>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
              <p className="text-sm text-green-500">Đang hoạt động</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Khu vực tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Khu vực nhập tin nhắn */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
              <Smile className="h-5 w-5 text-gray-600" />
            </button>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;