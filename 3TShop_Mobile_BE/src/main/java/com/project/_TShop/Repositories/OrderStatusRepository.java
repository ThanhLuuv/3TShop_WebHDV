package com.project._TShop.Repositories;

import com.project._TShop.Entities.Order;
import com.project._TShop.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project._TShop.Entities.Order_Status;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderStatusRepository extends JpaRepository<Order_Status, Integer>{

    Optional<List<Order_Status>> findAllByStatus(int status);
    @Query("SELECT os FROM Order_Status os WHERE os.status = :status AND os.order_id.user_id.user_id = :userId")
    List<Order_Status> findAllByStatusAndUserId(@Param("status") int status, @Param("userId") Integer userId);



    @Query("SELECT o FROM Order_Status o WHERE o.order_id = :order")
    Optional<Order_Status> findByOrder(Order order);
//    @Query("SELECT o FROM Order o WHERE o.order_id IN :orderIds AND o.user_id = :user")
//    List<Order> findAllByOrderIdInAndUserId(@Param("orderIds") List<Integer> orderIds, @Param("user") User user);

    @Query("SELECT os FROM Order_Status os WHERE FUNCTION('MONTH', os.created_at) = :month " +
            "AND FUNCTION('YEAR', os.created_at) = :year AND os.status = 3")
    Optional<List<Order_Status>> findByStatusAndMonthYear(@Param("month") int month, @Param("year") int year);
}
