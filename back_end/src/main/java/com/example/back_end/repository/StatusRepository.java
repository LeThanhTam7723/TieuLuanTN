package com.example.back_end.repository;

import com.example.back_end.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status,Integer> {
}
