package com.project._TShop.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project._TShop.Response.Response;
import com.project._TShop.Services.CartService;
import com.project._TShop.Services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor

public class CartController {
    private final CartService cartService;

    @GetMapping("/get-by-username")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getCartById(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Response response = cartService.getByUsername(username);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
