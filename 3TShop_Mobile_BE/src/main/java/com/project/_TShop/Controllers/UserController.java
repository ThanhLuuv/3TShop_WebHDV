package com.project._TShop.Controllers;

import com.project._TShop.DTO.UserDTO;
import com.project._TShop.Request.AuthenticationRequest;
import com.project._TShop.Request.ChangePasswordReq;
import com.project._TShop.Request.FogotPasswordRequest;
import com.project._TShop.Request.RegisterRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.AccountService;
import com.project._TShop.Services.AuthenticationService;
import com.project._TShop.Services.EmailService;
import com.project._TShop.Services.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor

public class UserController {

    private final AccountService accountService;
    private final UserService userService;


    @GetMapping("/get-user-info")
    public ResponseEntity<?> getUserInfo(){
        Response response = userService.getUserInfo();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-user-information")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getUserInformation(){
        Response response = userService.getUserInfoCustomer();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/edit-user-information")    
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> editInfor(@RequestBody UserDTO userDTO){
        Response response = userService.editInfor(userDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/change-password")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> changePassword(@RequestBody ChangePasswordReq request){
        System.out.print("ĐỔi mật khẩu" + request);
       Response response = accountService.changePassword(request);
       return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/statistics")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getStatistics(@RequestBody ChangePasswordReq request){
        System.out.print("ĐỔi mật khẩu" + request);
        Response response = accountService.changePassword(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
