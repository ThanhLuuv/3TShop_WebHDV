package com.project._TShop.Repositories;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface  AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailAndStatus(String email, boolean status);

    boolean existsByEmailOrUsername(String email, String username);

    Optional<Account>  findByRegistrationToken(String code);

    Optional<Account> findByResetPasswordToken(String token);

//    Account findByAccount(Optional<Account> account);
    boolean existsByEmail(String email);
}
