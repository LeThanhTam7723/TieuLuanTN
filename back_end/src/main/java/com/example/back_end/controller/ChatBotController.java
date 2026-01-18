package com.example.back_end.controller;

import com.example.back_end.dto.request.chatbot.OllamaRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.service.chatBot.ChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chatBot")
@RequiredArgsConstructor
public class ChatBotController {
    private final ChatBotService chatBotService;

    @PostMapping("/chat")
    public ApiResponse<String> chat(@RequestParam String sessionId,
                                    @RequestBody String prompt) {
        return ApiResponse.<String>builder()
                .code(0)
                .message("oke")
                .result(chatBotService.askChatBot(sessionId, prompt))
                .build();
    }
    @GetMapping("/history")
    public ApiResponse<List<Map<String, String>>> history(
            @RequestParam String sessionId
    ) {
        return ApiResponse.<List<Map<String, String>>>builder()
                .code(0)
                .message("OK")
                .result(chatBotService.getChatHistory(sessionId))
                .build();
    }

}
