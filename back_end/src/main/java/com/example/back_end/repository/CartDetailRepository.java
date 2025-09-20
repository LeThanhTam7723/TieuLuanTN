package com.example.back_end.repository;

import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail,Long> {
    Optional<CartDetail> findByIdCartAndIdProduct_Id(Cart idCart, Long idProduct);
    List<CartDetail> findAllByIdCart(Cart idCart);
    void deleteAllByIdCart(Cart idCart);
}
