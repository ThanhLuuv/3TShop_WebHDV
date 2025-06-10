package com.project._TShop.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Cart_Items;
import com.project._TShop.Entities.Specifications;

public interface CartItemsRepository extends JpaRepository<Cart_Items, Integer>{
    List<Cart_Items> findByCart(Cart cart);
    void deleteBySpecifications(Specifications specifications);
    Optional<Cart_Items> findByCartAndSpecifications(Cart cart, Specifications specifications);
}
