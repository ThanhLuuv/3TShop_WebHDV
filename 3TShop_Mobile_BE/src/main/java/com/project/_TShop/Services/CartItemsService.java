package com.project._TShop.Services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Response updateQuantity(int cartItemID, int quantity) {
        Response response = new Response();
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            Cart cart = cartRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            Cart_Items cartItem = cartItemsRepository.findById(cartItemID)
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));

            // Kiểm tra xem cartItem có thuộc về cart của người dùng không
            if (!cartItem.getCart().getCart_id().equals(cart.getCart_id())) {
                throw new RuntimeException("Unauthorized access to cart item");
            }

            // Kiểm tra tồn kho
            int stock = cartItem.getSpecifications().getQuantity();
            if (quantity > stock) {
                throw new RuntimeException("Số lượng vượt quá tồn kho hiện tại");
            }

            cartItem.setQuantity(quantity);
            cartItemsRepository.save(cartItem);

            List<Cart_Items> cartItems = cartItemsRepository.findByCart(cart);

            response.setStatus(200);
            response.setMessage("Cập nhật số lượng thành công");
            response.setCart_ItemsDTOList(Utils.mapCartItems(cartItems));
        } catch (RuntimeException e) {
            response.setStatus(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Lỗi máy chủ");
        }
        return response;
    }

    public Response getCartItemsByIds(List<Integer> cartItemIds) {
        Response response = new Response();
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            Cart cart = cartRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            List<Cart_Items> cartItems = cartItemsRepository.findAllById(cartItemIds);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("No cart items found for provided IDs");
            }

            // Kiểm tra quyền truy cập: tất cả cart items phải thuộc cart của user
            List<Cart_Items> validCartItems = cartItems.stream()
                    .filter(item -> item.getCart().getCart_id().equals(cart.getCart_id()))
                    .collect(Collectors.toList());

            if (validCartItems.isEmpty()) {
                throw new RuntimeException("No valid cart items found for this user");
            }

            response.setStatus(200);
            response.setMessage("Success get cart items by IDs");
            response.setCart_ItemsDTOList(Utils.mapCartItems(validCartItems));
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

    public Response getById(Integer id) {
        Response response = new Response();
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            Cart cart = cartRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            Cart_Items cartItem = cartItemsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));

            // Kiểm tra quyền truy cập: cartItem phải thuộc cart của user hiện tại
            if (!cartItem.getCart().getCart_id().equals(cart.getCart_id())) {
                throw new RuntimeException("Unauthorized access to cart item");
            }

            response.setStatus(200);
            response.setMessage("Success");
            response.setCart_ItemsDTO(Utils.mapCart_Items(cartItem)); // Hàm này bạn cần viết trong `Utils`
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
