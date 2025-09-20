package com.example.back_end.controller;

import com.example.back_end.config.VnpayConfig;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.order.OrderService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.util.StandardCharset;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

// Trong controller, bạn có thể @Autowired RestTemplate hoặc tạo mới như sau:

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class VnPayController {
    private final OrderService orderService;

    @GetMapping("/vnpay")
    public ApiResponse<String> createPayment(@RequestParam long amount) {
        try {
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", VnpayConfig.vnp_TmnCode);
            System.out.println(VnpayConfig.vnp_TmnCode);
            System.out.println(VnpayConfig.vnp_HashSecret);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay nhân với 100
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", VnpayConfig.getRandomNumber(8)); // Mã đơn hàng, duy nhất
            vnp_Params.put("vnp_OrderInfo", "Thanh toán đơn hàng");
            vnp_Params.put("vnp_OrderType", "100000");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", "127.0.0.1");

            // Thời gian tạo, hạn thanh toán
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);


            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Build data để tạo chữ ký
            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator itr = fieldNames.iterator();

            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    try {
                        hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                        //Build query
                        query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                        query.append('=');
                        query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            // Bỏ dấu & cuối
            String queryUrl = query.toString();
            String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.vnp_HashSecret, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + queryUrl;

            // Trả về URL để client redirect sang
            return ApiResponse.<String>builder().result(paymentUrl).build();

        } catch (Exception e) {
            return ApiResponse.<String>builder().code(1).build();
        }
    }

    // Hàm tạo chữ ký HMAC SHA512

//     API nhận kết quả trả về từ VNPAY
//    @GetMapping("/vnpay_return")
//    ApiResponse<Void> vnpayReturn(HttpServletResponse response) throws ParseException, JOSEException, IOException {
//        // Kiểm tra chữ ký trả về, xử lý trạng thái thanh toán, cập nhật đơn hàng...
//        // allParams chứa các tham số trả về từ VNPA
//        response.sendRedirect("http://localhost:5173/payment?success=true");
//        return ApiResponse.<Void>builder().message("Kết quả thanh toán đã nhận được").build();
//    }
}

