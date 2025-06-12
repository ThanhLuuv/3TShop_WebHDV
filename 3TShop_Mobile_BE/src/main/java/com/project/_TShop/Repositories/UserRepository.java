package com.project._TShop.Repositories;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByAccount_Username(String username);

    Optional<User> findByAccount(Account account);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
