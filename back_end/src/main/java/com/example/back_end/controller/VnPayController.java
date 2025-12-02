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
    public ApiResponse<String> createPayment(@RequestParam("amount") long amount,@RequestParam("orderId") long orderId) {
        try {
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", VnpayConfig.vnp_TmnCode);
            System.out.println(VnpayConfig.vnp_TmnCode);
            System.out.println(VnpayConfig.vnp_HashSecret);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay nhân với 100
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", String.valueOf(orderId)); // Mã đơn hàng, duy nhất
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
            System.out.println("chư ky "+vnp_SecureHash);
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + queryUrl;

            // Trả về URL để client redirect sang
            return ApiResponse.<String>builder().result(paymentUrl).build();

        } catch (Exception e) {
            return ApiResponse.<String>builder().code(1).build();
        }
    }


    //     API nhận kết quả trả về từ VNPAY
    @GetMapping("/vnpay_return")
    public ApiResponse<Void> vnpayReturn(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        Map<String, String> fields = new HashMap<>();

        // 1. Lấy toàn params VNPay trả về
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);

            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue.trim()); // TRIM ở đây rất quan trọng
            }
        }

        // 2. Lấy vnp_SecureHash
        String vnp_SecureHash = fields.get("vnp_SecureHash");
        System.out.println("vnp_SecureHash return: " + vnp_SecureHash);

        // 3. Remove để tính lại
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // 4. Tạo chuỗi theo đúng thứ tự alphabet
        String signData = VnpayConfig.hashAllFields(fields);
        System.out.println("SIGN DATA (string to hash):");
        System.out.println(signData);

        // 5. HMAC512
        String signValue = VnpayConfig.hmacSHA512(VnpayConfig.vnp_HashSecret, signData);
        System.out.println("signValue return: " + signValue);

        // 6. So sánh
//        if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
//            System.out.println("❌ Sai chữ ký VNPay");
//            response.sendRedirect("http://localhost:5173/payment?success=false&message=invalid_checksum");
//            return ApiResponse.<Void>builder().message("Sai chữ ký VNPay").build();
//        }

        // 7. Lấy thông tin giao dịch
        String orderIdStr = fields.get("vnp_TxnRef");
        String responseCode = fields.get("vnp_ResponseCode");

        try {
            long orderId = Long.parseLong(orderIdStr);

            if ("00".equals(responseCode)) {

                orderService.updateIsPaid(orderId, true);
                System.out.println("Thanh toán thành công Order ID = " + orderId);

                response.sendRedirect("http://localhost:5173/payment?success=true&orderId=" + orderId);
                return ApiResponse.<Void>builder()
                        .message("Thanh toán thành công Order ID = " + orderId)
                        .build();

            } else {
                System.out.println("Thanh toán thất bại Order ID = " + orderId);

                response.sendRedirect("http://localhost:5173/payment?success=false&orderId=" + orderId);
                return ApiResponse.<Void>builder()
                        .message("Thanh toán thất bại Order ID = " + orderId)
                        .build();
            }

        } catch (NumberFormatException e) {
            System.out.println("Lỗi parse orderId: " + orderIdStr);
            response.sendRedirect("http://localhost:5173/payment?success=false&message=invalid_order_id");
            return ApiResponse.<Void>builder().message("Lỗi parse orderId").build();
        }
    }

}

