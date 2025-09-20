package com.example.back_end.repository;

import com.example.back_end.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite,Long> {
    List<Favorite> findByIdUser_Id(Long idUser);
    void deleteByIdUser_IdAndIdProduct_Id(Long idUser, Long idProduct);
    boolean existsByIdUser_IdAndIdProduct_Id(Long idUser, Long idProduct);
//    void deleteAllByIdUser(User user);
}
