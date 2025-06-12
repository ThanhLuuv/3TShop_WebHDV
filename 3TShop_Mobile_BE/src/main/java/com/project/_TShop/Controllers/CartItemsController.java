package com.project._TShop.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.project._TShop.Request.CartItemRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.CartItemsService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/cart-items")
public class CartItemsController {
    @Autowired
    CartItemsService cartItemsService;
    
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> addCartItem(@RequestBody CartItemRequest cartItemRequest){
        Response response = cartItemsService.addToCart(cartItemRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> deleteCartItem(@PathVariable("id") Integer id){
        Response response = cartItemsService.deleteCartItem(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> updateQuantity(@PathVariable("id") Integer id, @RequestBody CartItemRequest cartItemRequest){
        Response response = cartItemsService.updateQuantity(id, cartItemRequest.getQuantity());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getById(@PathVariable("id") Integer id){
        Response response = cartItemsService.getById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/by-ids")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getCartItemsByIds(@RequestBody List<Integer> cartItemIds) {
        Response response = cartItemsService.getCartItemsByIds(cartItemIds);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-by-account")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getByAccount(){
        Response response = cartItemsService.getByAccount();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
