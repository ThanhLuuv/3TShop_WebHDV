package com.project._TShop.Services;

import com.project._TShop.Entities.Account;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Request.AuthenticationRequest;
import com.project._TShop.Response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("USERNAME_PASSWORD")
@RequiredArgsConstructor
public class UsernamePasswordAuthentication implements AuthenticationStrategy{


    private final AccountRepository accountRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Response authenticate(Object data) {
        AuthenticationRequest request = (AuthenticationRequest) data;
        Response response = new Response();

        Optional<Account> optionalAccount = accountRepo.findByUsername(request.getUsername());
        if (optionalAccount.isEmpty()) {
            response.setStatus(202);
            response.setMessage("Username not found");
            return response;
        }

        Account account = optionalAccount.get();

        if (!account.isStatus()) {
            response.setStatus(203);
            response.setMessage("Account not verified");
            return response;
        }

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            response.setStatus(201);
            response.setMessage("Invalid credentials");
            return response;
        }

        String jwtToken = jwtService.generateToken(account);
        response.setStatus(200);
        response.setToken(jwtToken);

        return response;
    }
}
