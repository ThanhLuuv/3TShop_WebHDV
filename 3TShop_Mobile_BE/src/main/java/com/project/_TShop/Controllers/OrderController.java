package com.project._TShop.Controllers;

import java.util.List;

import com.project._TShop.DTO.OrderDTO;
import com.project._TShop.DTO.Order_StatusDTO;
import com.project._TShop.Request.ChangeSatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.project._TShop.Request.OrderDetailRequest;
import com.project._TShop.Request.OrderRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/add")

    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> createNewOrder(@RequestBody OrderRequest orderRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.print("Dữ liệu là: " + orderRequest);
        Response response = orderService.createOrder(username, orderRequest.getIdAddress(), orderRequest.getNote(), orderRequest.getFee(), orderRequest.getOrderRequests());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllOrder(){
        Response response = orderService.getOrders(0);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("/get-waiting-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getWaitingOrders(){
        Response response = orderService.getOrders(1);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("/get-delivering-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getDeliveringOrders(){
        Response response = orderService.getOrders(2);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-delivered-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getDeliveredOrders(){
        Response response = orderService.getOrders(3);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("/get-cancelled-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getCancelledOrders(){
        Response response = orderService.getOrders(4);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/change-status")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> changeStatus(
            @RequestBody ChangeSatusRequest changeSatusRequest
    ){
        Response response = orderService.changeStatusOfOrder(changeSatusRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> changeStatus(@PathVariable("id") int id){
        Response response = orderService.getOrderById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-by-user/{status}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getByUser(@PathVariable("status") int status){
        Response response = orderService.getOrderByStatus(status);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
