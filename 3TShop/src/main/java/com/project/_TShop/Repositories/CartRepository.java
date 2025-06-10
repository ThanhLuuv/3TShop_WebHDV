package com.project._TShop.Repositories;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByAccount(Account account);
}
