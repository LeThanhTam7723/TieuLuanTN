package com.example.back_end.controller;

import com.example.back_end.dto.request.order.OrderPaid;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.PaypalService;
import com.example.back_end.service.order.OrderService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/paypal")
@RequiredArgsConstructor
public class PaypalController {
    private final PaypalService paypalService;
    private final OrderService orderService;

    @PostMapping("/pay")
    public ApiResponse<String> pay(@RequestBody OrderPaid request) {
        try {
            Payment payment = paypalService.createPayment(
                    request.getTotalAfter(),
                    "USD",
                    "Thanh toán đơn hàng #" + request.getOrderId(),
                    "http://localhost:8080/api/paypal/cancel",
                    "http://localhost:8080/api/paypal/success",
                    request.getOrderId()
            );

            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    return ApiResponse.<String>builder().result(link.getHref()).build();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ApiResponse.<String>builder().code(1).result("Lỗi không thanh toán paypal").build();
    }
    @GetMapping("/success")
    public RedirectView success(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId
    ) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                Transaction transaction = payment.getTransactions().get(0);
                String orderIdStr = transaction.getInvoiceNumber();
                long orderId = Long.parseLong(orderIdStr);
                orderService.updateIsPaid(orderId, true);
                return new RedirectView("http://localhost:5173/payment?success=true");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new RedirectView("http://localhost:5173/payment?success=false");
    }
    @GetMapping("/cancel")
    public RedirectView cancel() {
        return new RedirectView("http://localhost:5173/payment?success=false");
    }
}
