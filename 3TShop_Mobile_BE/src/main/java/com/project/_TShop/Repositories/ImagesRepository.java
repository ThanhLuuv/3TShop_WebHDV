package com.project._TShop.Repositories;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Images;
import com.project._TShop.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImagesRepository extends JpaRepository<Images, Integer> {


}
