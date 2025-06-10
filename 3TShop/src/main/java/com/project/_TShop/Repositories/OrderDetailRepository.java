package com.project._TShop.Repositories;

import com.project._TShop.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project._TShop.Entities.Order_Detail;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface OrderDetailRepository extends JpaRepository<Order_Detail, Integer>{

    Optional<List<Order_Detail>> findAllByOrder(Order order);

    List<Order_Detail> findByOrder(Order order);
}
