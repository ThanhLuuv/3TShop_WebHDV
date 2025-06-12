package com.project._TShop.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project._TShop.Entities.Order;
import com.project._TShop.Entities.User;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer>{

    @Query("SELECT o FROM Order o WHERE o.user_id = :user")
    List<Order> findAllByUser(@Param("user") User user);
}