package com.example.back_end.repository;

import com.example.back_end.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByUserId(Long userId);
    @Modifying
    @Query("""
        UPDATE Address a
        SET a.defaultAddress = false
        WHERE a.user.id = :userId
    """)
    void unsetAllDefaultAddresses(@Param("userId") Long userId);
}
