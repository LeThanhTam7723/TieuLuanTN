package com.example.back_end.controller;

import com.example.back_end.dto.OrderAdminDetailDto;
import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.request.order.OrderRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.response.order.OrderResponse;
import com.example.back_end.service.order.IOrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;

    /**
     * Method to create a new order
     *
     * @param request: Order creation request containing user info, shipping details, and items
     * @return JSON body contains success message if order created successfully
     */
    @PostMapping("/add")
    public ApiResponse<Void> createOrder(@RequestBody OrderCreateRequest request) {
        orderService.addOrder(request);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/individual/{userId}")
    public ApiResponse<List<OrderDto>> getOrderByUser(@PathVariable Long userId) {
        List<OrderDto> orderDtos = orderService.getOrderByUserId(userId);
        return ApiResponse.<List<OrderDto>>builder().result(orderDtos).build();
    }

    @GetMapping("/details/{orderId}")
    public ApiResponse<List<OrderDetailDto>> getOrderDetail(@PathVariable Long orderId) {
        List<OrderDetailDto> orderDtos = orderService.getOrderDetailsByOrderId(orderId);
        return ApiResponse.<List<OrderDetailDto>>builder().result(orderDtos).build();
    }


    /**
     * Method to get all orders with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of orders
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    /**
     * Method to get order by ID
     *
     * @param id: Order's id
     * @return JSON body contains detailed order information
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Method to update order status
     *
     * @param id:       Order's id
     * @param statusId: New status id to update
     * @return JSON body contains updated order information
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam int statusId) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusId));
    }

    /**
     * Method to get orders by user ID
     *
     * @param userId: User's id
     * @return JSON body contains list of orders for the specified user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @PutMapping("/update")
    public ApiResponse<Void> updateOrder(@RequestBody OrderRequest request) {
        orderService.updateOrder(request.getOrderId(), request.getStatusId());
        return ApiResponse.<Void>builder().build();
    }

    /**
     * Endpoint to get detailed order information for Admin.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param id The ID of the order to retrieve.
     * @return ResponseEntity containing OrderAdminDetailDto if found.
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<OrderAdminDetailDto> getOrderDetailsForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderDetailsForAdmin(id));
    }

    /**
     * Endpoint to search and filter orders for Admin.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param keyword   Optional keyword to search by receiver, phone, or order ID.
     * @param statusId  Optional status ID to filter by.
     * @param startDate Optional start date to filter orders.
     * @param endDate   Optional end date to filter orders.
     * @param pageable  Pagination information (page, size, sort).
     * @return ApiResponse containing a paginated list of OrderResponse.
     */
    @GetMapping("/admin/search")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ApiResponse<PageResponse<OrderResponse>> searchAndFilterOrders(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "statusId", required = false) Integer statusId,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .code(0)
                .message("Tìm kiếm và lọc đơn hàng thành công")
                .data(orderService.searchAndFilterOrders(keyword, statusId, startDate, endDate, pageable))
                .build();
    }
}
