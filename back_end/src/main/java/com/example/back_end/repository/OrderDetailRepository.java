package com.example.back_end.repository;

import com.example.back_end.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
