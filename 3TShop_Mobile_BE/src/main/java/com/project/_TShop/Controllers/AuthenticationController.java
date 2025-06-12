package com.project._TShop.Controllers;

import com.project._TShop.Entities.Account;
import com.project._TShop.Request.*;
import com.project._TShop.Response.AuthenticationResponse;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.AccountService;
import com.project._TShop.Services.AuthenticationFactory;
import com.project._TShop.Services.AuthenticationService;
import com.project._TShop.Services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor

public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final AccountService accountService;

    private final EmailService emailService;
    private final AuthenticationFactory authenticationFactory;


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request,HttpServletRequest req
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.register(request, req);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/register-mobile")
    public ResponseEntity<?> registerMobile(@RequestBody RegisterRequest request
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.registerMobile(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/verify-register-token")
    public ResponseEntity<?> verifyRegisterMobile(@RequestBody VerifyRegisterTokenRequest request
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.verifyRegisterMobile(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/verify-reset-password-token")
    public ResponseEntity<?> verifyResetPw(@RequestBody VerifyResetPwRequest request
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.verifyResetPw(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam("code") String code) {
        Response response = accountService.isValidRegistrationToken(code);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody FogotPasswordRequest request, HttpServletRequest req
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.updateResetPasswordToken(request, req);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/forgot-password-mobile")
    public ResponseEntity<?> forgotPasswordMobile(
            @RequestBody FogotPasswordRequest request
    ) throws MessagingException, UnsupportedEncodingException {
        Response response = authenticationService.updateResetPasswordTokenMobile(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("/reset-password-gate")
    public ResponseEntity<?> redirectToApp(@RequestParam("token") String token) {
        String deepLink = "myapp://reset-password?token=" + token;
        System.out.println("link: "+deepLink);
        String html = "<html><body>"
                + "<h3>Nhấn nút dưới đây để mở ứng dụng:</h3>"
                + "<a href=\"" + deepLink + "\"><button>Mở ứng dụng</button></a>"
                + "<p>Hoặc sao chép link: " + deepLink + "</p>"
                + "<script>"
                + "window.location.href = '" + deepLink + "';"
                + "</script>"
                + "</body></html>";
        return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body(html);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPasswordForm(@RequestBody ResetPasswordRequest request){
       Response response = authenticationService.updatePassword(request);
       return ResponseEntity.status(response.getStatus()).body(response);

    }
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        Response response = authenticationFactory.getStrategy("USERNAME_PASSWORD").authenticate(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        Response response = authenticationService.loginByGoogle(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
