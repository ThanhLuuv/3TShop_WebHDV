package com.project._TShop.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project._TShop.Entities.Delevery_Infomation;
import com.project._TShop.Entities.User;

public interface DeleveryInformationRepository extends JpaRepository<Delevery_Infomation, Integer>{
    @Query("SELECT d FROM Delevery_Infomation d WHERE d.user_id = :user")
    List<Delevery_Infomation> findByUser(@Param("user") User user);

    @Query("SELECT d FROM Delevery_Infomation d WHERE d.user_id = :user AND d.is_default = true")
    Delevery_Infomation findDefaultByUser(@Param("user") User user);

}
