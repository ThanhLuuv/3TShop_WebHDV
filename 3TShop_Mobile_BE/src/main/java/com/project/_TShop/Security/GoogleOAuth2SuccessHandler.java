package com.project._TShop.Security;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Auth_Provider;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Role;
import com.project._TShop.Exceptions.ResourceNotFoundException;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.RoleRepository;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.AuthenticationFactory;
import com.project._TShop.Services.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final AccountRepository accountRepo;
    private final JwtService jwtService;
    private final RoleRepository roleRepo;
    private final CartRepository cartRepository;
    private final AuthenticationFactory authenticationFactory;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Response responseData = authenticationFactory.getStrategy("GOOGLE").authenticate(oAuth2User);
        String token = responseData.getToken();
        response.sendRedirect("http://localhost:3003/login?token=" + token);
    }
}

