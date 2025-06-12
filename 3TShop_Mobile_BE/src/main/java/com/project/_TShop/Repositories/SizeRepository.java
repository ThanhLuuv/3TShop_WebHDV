package com.project._TShop.Repositories;

import com.project._TShop.Entities.Color;
import com.project._TShop.Entities.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    @Query("SELECT s FROM Size s WHERE s.size_id = :size_id")
    Optional<Size> findBySizeId(@Param("size_id") int size_id);
}
