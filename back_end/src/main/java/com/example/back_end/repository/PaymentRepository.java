package com.example.back_end.repository;

import com.example.back_end.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentMethod,Integer> {
    boolean existsPaymentMethodByTypePayment(String typePayment);
}
