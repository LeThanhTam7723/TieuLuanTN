package com.example.back_end.service.chatBot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatBotService implements IChatBotService{
    private final WebClient webClient;
    private final Map<String, List<Map<String, String>>> sessions = new ConcurrentHashMap<>();

    public ChatBotService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:11434").build();
    }

    public List<Map<String, String>> getSession(String sessionId) {
        return sessions.computeIfAbsent(sessionId, k -> new ArrayList<>());
    }

    @Override
    public String askChatBot(String sessionId,String prompt) {
        List<Map<String, String>> messages = getSession(sessionId);

        if (messages.isEmpty()) {
            messages.add(Map.of(
                    "role", "system",
                    "content", "Bạn là trợ lý tư vấn thời trang"
            ));
        }

        messages.add(Map.of("role", "user", "content", prompt));

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3.2-viet:latest");
        body.put("messages", messages);
        body.put("stream", false);

        String json = webClient.post()
                .uri("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(json);

            String answer = node.get("message").get("content").asText();

            messages.add(Map.of("role", "assistant", "content", answer));

            return answer;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Map<String, String>> getChatHistory(String sessionId) {
        return sessions.getOrDefault(sessionId, List.of());
    }
}
