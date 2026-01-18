const ChatBotService = {
  askChatBot: async (prompt) => {
    try {
      const response = await fetch("http://localhost:8080/api/chatBot/chat?sessionId=user-123", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      return data.result; // trả về text trả lời từ chatbot
    } catch (error) {
      console.error("Lỗi chat bot:", error);
      return "Lỗi gọi API chatbot";
    }
  }
};

export default ChatBotService;
