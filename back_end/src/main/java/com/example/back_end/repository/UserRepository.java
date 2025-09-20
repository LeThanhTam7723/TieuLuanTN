package com.example.back_end.repository;

import com.example.back_end.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    Optional<User> findUserByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByPhone(String phone);

    @Override
    <S extends User> List<S> findAll(Example<S> example);

    Optional<User> findUserById(Long id);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}

