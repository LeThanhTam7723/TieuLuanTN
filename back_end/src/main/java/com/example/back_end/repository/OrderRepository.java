package com.example.back_end.repository;

import com.example.back_end.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByIdUser_Id(Long userId);

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
}
