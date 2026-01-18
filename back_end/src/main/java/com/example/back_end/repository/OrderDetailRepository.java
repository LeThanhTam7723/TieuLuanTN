package com.example.back_end.repository;

import com.example.back_end.entity.OrderDetail;
import com.example.back_end.entity.Review;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
    List<OrderDetail> findByIdOrder_Id(Long orderId);
    @Query("""
        SELECT pv, SUM(od.quantity)
        FROM OrderDetail od
        JOIN od.idProduct pv
        GROUP BY pv
        ORDER BY SUM(od.quantity) DESC
        """)
    List<Object[]> findTopSellingVariants();

    // Kiểm tra item đã có refund chưa
    boolean existsByIdAndRefundIsNotNull(Integer id);
    Optional<OrderDetail> findByRefund_Id(Long refundId);
    @Modifying
    @Query("""
        UPDATE OrderDetail od
        SET od.review = :review
        WHERE od.id = :orderDetailId
    """)
    void updateReview(
            @Param("orderDetailId") Long orderDetailId,
            @Param("review") Review review
    );
}
