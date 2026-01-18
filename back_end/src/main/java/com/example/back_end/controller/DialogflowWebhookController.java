package com.example.back_end.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dialogflow")
public class DialogflowWebhookController {

    @PostMapping("/webhook")
    public Map<String, Object> handleWebhook(@RequestBody Map<String, Object> payload) {
        // Lấy queryResult từ payload
        Map<String, Object> queryResult = (Map<String, Object>) payload.get("queryResult");
        String userQuery = (String) queryResult.get("queryText");

        // Ví dụ: xử lý logic lấy dữ liệu từ DB
        String responseText = "Tôi nhận được câu hỏi: " + userQuery + ". Sản phẩm đang còn hàng!";

        // Trả về JSON chuẩn cho Dialogflow
        Map<String, Object> response = new HashMap<>();
        response.put("fulfillmentText", responseText);
        return response;
    }
}

