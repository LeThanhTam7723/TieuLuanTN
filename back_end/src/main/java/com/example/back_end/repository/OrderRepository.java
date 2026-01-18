package com.example.back_end.repository;

import com.example.back_end.dto.response.analytics.RevenueResponse;
import com.example.back_end.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByIdUser_IdOrderByDateOrderDesc(Long userId);

    @Query("SELECT o FROM Order o WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(o.receiver) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(o.id AS string) LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:statusId IS NULL OR o.idStatus.id = :statusId) AND " +
            "(:startDate IS NULL OR o.dateOrder >= :startDate) AND " +
            "(:endDate IS NULL OR o.dateOrder <= :endDate)")
    Page<Order> findOrdersByCriteria(
            @Param("keyword") String keyword,
            @Param("statusId") Integer statusId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.isPaid = true")
    BigDecimal getTotalRevenuePaidOrders();

//    @Query("""
//        SELECT new com.example.back_end.dto.response.analytics.RevenueResponse(
//            MONTH(o.dateOrder),
//            SUM(o.total)
//        )
//        FROM Order o
//        WHERE o.dateOrder >= :startDate
//        AND o.isPaid = true
//        GROUP BY MONTH(o.dateOrder)
//        ORDER BY MONTH(o.dateOrder)
//        """)
//    List<RevenueResponse> getRevenueLast6Months(LocalDate startDate);

//    @Query(value = """
//        SELECT
//            LPAD(CONCAT(MONTH(o.date_order)), 2, '0') AS month,
//            SUM(o.total) AS revenue
//        FROM orders o
//        WHERE YEAR(o.date_order) = YEAR(NOW())
//        GROUP BY month
//        ORDER BY month
//        """, nativeQuery = true)
//    List<Object[]> getRevenueLast6Months();
    @Query(value = """
    WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01') AS m
        UNION ALL
        SELECT DATE_ADD(m, INTERVAL 1 MONTH)
        FROM months
        WHERE m < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    )
    SELECT 
        DATE_FORMAT(m.m, '%m') AS month,
        COALESCE(SUM(o.total), 0) AS revenue
    FROM months m
    LEFT JOIN orders o 
        ON DATE_FORMAT(o.date_order, '%Y-%m') = DATE_FORMAT(m.m, '%Y-%m')
        AND o.is_paid = 1
    GROUP BY month
    ORDER BY month
    """, nativeQuery = true)
    List<Object[]> getRevenueLast6Months();


}

