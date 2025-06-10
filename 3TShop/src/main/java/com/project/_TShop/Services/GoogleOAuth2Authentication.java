package com.project._TShop.Services;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Auth_Provider;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.RoleRepository;
import com.project._TShop.Response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;

@Component("GOOGLE")
public class GoogleOAuth2Authentication implements AuthenticationStrategy {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private CartRepository cartRepository;


    @Override
    public Response authenticate(Object data) {
        OAuth2User oAuth2User = (OAuth2User) data;
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Account account = accountRepo.findByEmail(email).orElseGet(() -> {
            Account newAccount = new Account();
            newAccount.setEmail(email);
            newAccount.setUsername(name);
            newAccount.setAuth_provider(String.valueOf(Auth_Provider.GOOGLE));
            newAccount.setStatus(true);
            newAccount.setCreatedAt(new Date());
            newAccount.setRoles(Collections.singleton(roleRepo.findByName("USER").orElseThrow()));
            return accountRepo.save(newAccount);
        });

        cartRepository.findByAccount(account).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setAccount(account);
            return cartRepository.save(cart);
        });

        String token = jwtService.generateToken(account);
        System.out.println("token: "+token);
        Response response = new Response();
        response.setStatus(200);
        response.setToken(token);
        return response;
    }
}
