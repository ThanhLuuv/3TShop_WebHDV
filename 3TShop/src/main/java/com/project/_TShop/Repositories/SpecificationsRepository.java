package com.project._TShop.Repositories;

import java.util.List;
import java.util.Optional;
import com.project._TShop.Entities.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project._TShop.Entities.Color;
import com.project._TShop.Entities.Product;
import com.project._TShop.Entities.Size;
import com.project._TShop.Entities.Specifications;
import com.project._TShop.Entities.Account;
import org.springframework.stereotype.Repository;


@Repository
public interface SpecificationsRepository extends JpaRepository<Specifications, Integer> {

    @Query(value = "SELECT * FROM Specifications WHERE Specifications.product_id = :product_id", nativeQuery = true)
    Optional<List<Specifications>> findAllByProductId(Integer product_id);

    @Query("SELECT s FROM Specifications s WHERE s.specifications_id = :specifications_id")
    Optional<Specifications> findBySpecificationsId(Integer specifications_id);
    List<Specifications> findByProduct(Product product);
    @Query("SELECT s FROM Specifications s WHERE s.color = :color AND s.size_id = :size AND s.product = :product")
    Optional<Specifications> findByColorAndSizeAndProduct(
        @Param("color") Color color,
        @Param("size") Size size,
        @Param("product") Product product
    );
    List<Specifications> findByProductAndStatus(Product product, int status);
    // @Query("SELECT s FROM Specifications s WHERE s.product.product_id = :productId AND s.quantity > :quantity")
    // List<Specifications> findByProductIdAndQuantityGreaterThan(@Param("productId") Integer productId, @Param("quantity") int quantity);
}
