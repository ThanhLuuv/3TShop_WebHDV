package com.project._TShop.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.project._TShop.Entities.Product;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findTop10ByOrderBySoldDesc();

    // @Query("SELECT p FROM Product p ORDER BY p.created_at DESC")
    // List<Product> findTop10ByOrderByCreatedAtDesc();

    @Query(value = "SELECT * FROM Product ORDER BY created_at DESC LIMIT 10", nativeQuery = true)
    List<Product> findTop10ByCreatedAtDescNative();

    @Query(value = "SELECT * FROM product WHERE category_id = ?1", nativeQuery = true)
    List<Product> findByCategory(Integer id);


    @Query("SELECT p FROM Product p WHERE p.product_id = :product_id")
    Optional<Product> findByProductId(Integer product_id);
    @Query(value = "SELECT * FROM product WHERE name COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', :productName, '%')", nativeQuery = true)
    Optional<List<Product>> findByNameContaining(@Param("productName") String productName);

    @Query("""
           SELECT DISTINCT p 
           FROM Product p
           JOIN Specifications s ON p.product_id = s.product.product_id
           WHERE p.status = 1
           AND s.quantity > 0
           """)
    List<Product> findAvailableProducts();

    List<Product> findByNameContainingIgnoreCase(String name);
}
