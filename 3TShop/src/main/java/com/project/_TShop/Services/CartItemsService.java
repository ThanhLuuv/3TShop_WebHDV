package com.project._TShop.Services;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Cart_Items;
import com.project._TShop.Entities.Color;
import com.project._TShop.Entities.Product;
import com.project._TShop.Entities.Size;
import com.project._TShop.Entities.Specifications;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartItemsRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.ColorRepository;
import com.project._TShop.Repositories.ProductRepository;
import com.project._TShop.Repositories.SizeRepository;
import com.project._TShop.Repositories.SpecificationsRepository;
import com.project._TShop.Request.CartItemRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;

@Service
public class CartItemsService {
    @Autowired
    CartItemsRepository cartItemsRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    SizeRepository sizeRepository;

    @Autowired
    ColorRepository colorRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    SpecificationsRepository specificationsRepository;

    public Response addToCart(CartItemRequest cartItemRequest) {
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
            // Color color = colorRepository.findById(cartItemRequest.getColorId())
            //     .orElseThrow(() -> new RuntimeException("Color not found"));
            // Size size = sizeRepository.findById(cartItemRequest.getSizeId())
            //     .orElseThrow(() -> new RuntimeException("Size not found"));
            Specifications specifications = specificationsRepository.findById(cartItemRequest.getSpec_id())
                .orElseThrow(() -> new RuntimeException("Specifications not found"));
            Cart cart = cartRepository.findByAccount(account)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setAccount(account);
                    return cartRepository.save(newCart);
                });
            Cart_Items cartItem = cartItemsRepository.findByCartAndSpecifications(cart, specifications)
                .orElseGet(() -> new Cart_Items(
                        cartItemRequest.getQuantity(),
                        cart,
                        specifications
                ));
            if (cartItem.getCart_items_id() != null) {
                cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
            }
            cartItemsRepository.save(cartItem);
            response.setStatus(200);
            response.setMessage("Success add to cart");
        } catch (RuntimeException e) {
            response.setStatus(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response deleteCartItem(Integer id) {
        Response response = new Response();
        try {
            Cart_Items cart_Items = cartItemsRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Not found cart item"));
            cartItemsRepository.delete(cart_Items);
            response.setStatus(200);
            response.setMessage("Delete success");
        } catch (RuntimeException e) {
            response.setStatus(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response getByAccount() {
        Response response = new Response();
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("username là "+username);
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            Cart cart = cartRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
            List<Cart_Items> cartItems = cartItemsRepository.findByCart(cart);
            response.setStatus(200);
            response.setCart_ItemsDTOList(Utils.mapCartItems(cartItems));
            response.setMessage("Success get cart");
        } catch (RuntimeException e) {
            response.setStatus(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }


}
