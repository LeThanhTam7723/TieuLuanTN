package com.example.back_end.dto.request.chatbot;

import lombok.Data;

@Data
public class OllamaRequest {
    private String model;
    private String prompt;
    private boolean stream;
}

