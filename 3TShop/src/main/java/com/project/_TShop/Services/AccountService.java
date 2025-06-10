package com.project._TShop.Services;

import com.project._TShop.Entities.*;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.RoleRepository;
import com.project._TShop.Repositories.UserRepository;
import com.project._TShop.Request.ChangePasswordReq;
import com.project._TShop.Request.RegisterRequest;
import com.project._TShop.Response.AuthenticationResponse;
import com.project._TShop.Response.Response;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepo;


    public Response isValidRegistrationToken(String code) {
        Response response = new Response();
        Optional<Account> accountOptional = accountRepo.findByRegistrationToken(code);
        if(accountOptional.isPresent()){
            accountOptional.get().setStatus(true);
            var cart = Cart.builder()
                            .account(accountOptional.get())
                            .build();


            accountRepo.save(accountOptional.get());
            cartRepo.save(cart);
            response.setStatus(200);
            response.setMessage("Verify Account success");
        }else {
            response.setStatus(201);
            response.setMessage("Verify token is not exist");
        }
       return response;
    }

    public Response changePassword(ChangePasswordReq request) {
        Response response = new Response();
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.print("User name là :" +username);
            Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    
            if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
                response.setStatus(202);
                response.setMessage("Mật khẩu hiện tại không đúng");
                return response;
            }
    
            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepo.save(account);
    
            response.setStatus(200);
            response.setMessage("Đổi mật khẩu thành công");
        }catch (RuntimeException e) {
            System.out.print(e.toString());
            response.setStatus(400);
            response.setMessage("Lỗi hệ thống: " + e.getMessage());
        } 
        catch (Exception e) {
            System.out.print(e.toString());
            response.setStatus(500);
            response.setMessage("Lỗi hệ thống: " + e.getMessage());
        }
        return response;
    }
}

