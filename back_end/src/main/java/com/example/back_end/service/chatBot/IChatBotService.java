package com.example.back_end.service.chatBot;

import java.util.List;
import java.util.Map;

public interface IChatBotService {
    String askChatBot(String sessionId,String message) ;

    List<Map<String, String>> getChatHistory(String sessionId);

}
