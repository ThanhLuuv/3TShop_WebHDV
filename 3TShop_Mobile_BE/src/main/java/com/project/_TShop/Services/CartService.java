package com.project._TShop.Services;


import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Cart_Items;
import com.project._TShop.Entities.User;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartItemsRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.UserRepository;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final UserRepository userRepo;
    private final AccountRepository accountRepository;
    private final CartItemsRepository cartItemsRepository;
    private final CartRepository cartRepository;


//    public Optional<User> getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return Optional.empty();
//        }
//        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
//        return Optional.ofNullable(userRepo.findByAccount_Username(username));
//    }
//
//    public Response getUserInfo() {
//        Response response = new Response();
//        Optional<User> currentUser = getCurrentUser();
//        if (currentUser.isEmpty()) {
//            response.setStatus(404);
//            response.setMessage("message: Not found User Info");
//        } else {
//            response.setStatus(200);
//            response.setUserDTO(Utils.mapUser(currentUser.get()));
//        }
//        return response;
//    }

    public Response getByUsername(String username) {
        Response response = new Response();
        try {
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            Cart cart = cartRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
            List<Cart_Items> cartItems = cartItemsRepository.findByCart(cart);
            response.setStatus(200);
            response.setMessage("Get cart success");
            response.setCart_ItemsDTOList(Utils.mapCartItems(cartItems));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Account not found")) {
                response.setStatus(201);
                response.setMessage("Not found account");
            } else if (e.getMessage().equals("Cart not found")) {
                response.setStatus(202);
                response.setMessage("Get cart error");
            }
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

}

