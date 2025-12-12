package com.example.back_end.service.order;

import com.example.back_end.dto.OrderAdminDetailDto;
import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.StatusDto;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.*;
import com.example.back_end.mapper.OrderDetailMapper;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.mapper.ProductImageMapper;
import com.example.back_end.dto.response.order.OrderResponse;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductMapper;
import com.example.back_end.repository.*;
import com.example.back_end.service.product.IProductImageService;
import com.example.back_end.service.product.ProductImageService;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderDetailMapper orderDetailMapper;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ModelMapper modelMapper;
    private final IUserService userService;
    private final PaymentRepository paymentRepository;
    private final StatusRepository statusRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderMapper orderMapper;
    private final IProductImageService productImageService;
    private final ProductImageMapper productImageMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public OrderResponse addOrder(OrderCreateRequest request) {
        UserResponse currentUser = userService.getCurrentUser();
        System.out.println(request.getOrderItems());
        Cart cart = cartRepository.findByUser_IdAndIsOrdered(currentUser.getId(),false)
                .orElseThrow(() -> new IllegalArgumentException("Cart không tồn tại cho User này."));
        List<Long> cartItemIds = request.getOrderItems();
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new IllegalArgumentException("Không có sản phẩm nào được chọn để đặt hàng.");
        }
        List<CartDetail> cartDetails = cartDetailRepository.findAllById(cartItemIds);
        for (CartDetail detail : cartDetails) {
            if (!detail.getIdCart().getId().equals(cart.getId())) {
                throw new IllegalArgumentException("Phát hiện sản phẩm không thuộc giỏ hàng của bạn.");
            }
        }

        if (cartDetails.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy các sản phẩm cần đặt.");
        }
        PaymentMethod paymentMethod = paymentRepository.findById(request.getIdPaymentMethod())
                .orElseThrow(() -> new IllegalArgumentException("Phương thức thanh toán không hợp lệ."));
        Status status = statusRepository.findById(request.getIdStatus())
                .orElseThrow(() -> new IllegalArgumentException("Trạng thái không tồn tại."));
        Order order = new Order();
        order.setIdUser(userService.getUserById(currentUser.getId()));
        order.setDateOrder(LocalDate.now());
        order.setAddress(request.getAddress());
        order.setIdPaymentMethod(paymentMethod);
        order.setIdStatus(status);
        order.setReceiver(request.getReceiver());
        order.setPhone(request.getPhone());
        order.setTotal(request.getTotal());
        order=orderRepository.save(order);
        OrderResponse response = modelMapper.map(order, OrderResponse.class);
        System.out.println("Đơn hàng mới tạo"+response);

        for (CartDetail cartDetail : cartDetails) {
            ProductVariant product = cartDetail.getIdProduct();
            Integer cartQuantity = cartDetail.getQuantity();
//            System.out.println(product.getId());

            OrderDetail oderDetail = new OrderDetail();
            oderDetail.setIdOrder(order);
            oderDetail.setIdProduct(product);
            oderDetail.setQuantity(cartQuantity);
            oderDetail.setTotalPrice(
                    product.getPrice().multiply(BigDecimal.valueOf(cartQuantity))
            );

            orderDetailRepository.save(oderDetail);
        }
        cartDetailRepository.deleteAll(cartDetails);
        return response;
    }

    @Override
    public List<OrderDetailDto> getOrderDetailsByOrderId(Long orderId) {
        List<OrderDetail>orderDetails= orderDetailRepository.findByIdOrder_Id(orderId);
        List<OrderDetailDto> orderDetailDtos= orderDetails.stream().map(orderDetailMapper::toDto).collect(Collectors.toList());
        for (OrderDetailDto a : orderDetailDtos){
            Product product = productRepository.getReferenceById(a.getIdProduct().getProduct().getId());
            ProductSummary productSummary = productMapper.toSummary(product);
            a.getIdProduct().setProduct(productSummary);
        }
        return orderDetailDtos;
    }

    @Override
    public List<OrderDto> getOrderByUserId(Long userId) {
        List<Order> orders =  orderRepository.findByIdUser_Id(userId);
        List<OrderDto> orderDtos = orders.stream().map((element) -> modelMapper.map(element, OrderDto.class)).collect(Collectors.toList());
        for(OrderDto a : orderDtos){
            a.setOrderDetails(getOrderDetailsByOrderId(a.getIdOrder()));
        }
        return orderDtos;
    }

    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(orderResponses)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return modelMapper.map(order, OrderResponse.class);
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, int statusId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new AppException(ErrorCode.STATUS_NOT_FOUND));
        
        order.setIdStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderResponse.class);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByIdUser_Id(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrder(Long orderId,int statusId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new AppException(ErrorCode.STATUS_NOT_FOUND));
        order.setIdStatus(status);
        orderRepository.save(order);
    }

    @Override
    public OrderAdminDetailDto getOrderDetailsForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        List<OrderDetail> orderDetails = orderDetailRepository.findByIdOrder_Id(orderId);

        // Tính tổng giá trị đơn hàng từ chi tiết đơn hàng
        BigDecimal totalOrderValue = orderDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Map Order entity sang OrderAdminDetailDto bằng ModelMapper
        OrderAdminDetailDto adminDetailDto = modelMapper.map(order, OrderAdminDetailDto.class);

        // Map danh sách OrderDetail entities sang OrderDetailDto list
        List<OrderDetailDto> orderDetailDtos = orderDetails.stream()
                .map(detail -> modelMapper.map(detail, OrderDetailDto.class))
                .collect(Collectors.toList());

        adminDetailDto.setOrderDetails(orderDetailDtos);
        adminDetailDto.setTotalOrderValue(totalOrderValue);

        return adminDetailDto;
    }

    @Override
    public PageResponse<OrderResponse> searchAndFilterOrders(
            String keyword,
            Integer statusId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Page<Order> orderPage = orderRepository.findOrdersByCriteria(keyword, statusId, startDate, endDate, pageable);

        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(orderResponses)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public void updateIsPaid(Long orderId, boolean paidStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setPaid(paidStatus);
        orderRepository.save(order);
    }
    // update trạng thái thanh toán.

}
