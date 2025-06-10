package com.project._TShop.Services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Auth_Provider;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Role;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartRepository;
import com.project._TShop.Repositories.RoleRepository;
import com.project._TShop.Request.*;
import com.project._TShop.Response.AuthenticationResponse;
import com.project._TShop.Response.Response;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import net.bytebuddy.utility.RandomString;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.UnsupportedEncodingException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AccountRepository accountRepo;
    private final RoleRepository roleRepo;

    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    public Response register(RegisterRequest request, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        Response response = new Response();

        if(isEmailOrUsernameExists(request)){
            response.setStatus(209);
            response.setMessage("Email or username is used");
            return response;
        }
        Collection<Role> roles = new ArrayList<>();
        Optional<Role> optionalRole = roleRepo.findByName("USER");
        if (optionalRole.isPresent()) {
            roles.add(optionalRole.get());
        } else {
            response.setStatus(201);
            response.setMessage("Default Role not found");
            return response;
        }
        String registrationToken = RandomString.make(50);
        var user = Account.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .resetPasswordToken(null)
                .registrationToken(registrationToken)
                .email(request.getEmail())
                .createdAt(new Date())
                .auth_provider(String.valueOf(Auth_Provider.LOCAL))
                .roles(roles)
                .status(false)
                .build();
        accountRepo.save(user);
        emailService.sendVerificationEmail(user, req);
        var jwtToken = jwtService.generateToken(user);
        response.setStatus(200);
        response.setToken(jwtToken);
        return response;
    }
    public Response registerMobile(RegisterRequest request) throws MessagingException, UnsupportedEncodingException {
        Response response = new Response();

        if(isEmailOrUsernameExists(request)){
            response.setStatus(209);
            response.setMessage("Email or username is used");
            return response;
        }
        Collection<Role> roles = new ArrayList<>();
        Optional<Role> optionalRole = roleRepo.findByName("USER");
        if (optionalRole.isPresent()) {
            roles.add(optionalRole.get());
        } else {
            response.setStatus(201);
            response.setMessage("Default Role not found");
            return response;
        }
        String registrationToken = String.valueOf((int) (Math.random() * 900000) + 100000);

        // Tính thời gian hết hạn (10 phút từ hiện tại)
        Date registrationTokenExpiry = new Date(System.currentTimeMillis() + 10 * 60 * 1000);
        var user = Account.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .resetPasswordToken(null)
                .registrationToken(registrationToken)
                .registrationTokenExpiry(registrationTokenExpiry)
                .email(request.getEmail())
                .createdAt(new Date())
                .auth_provider(String.valueOf(Auth_Provider.LOCAL))
                .roles(roles)
                .status(false)
                .build();
        accountRepo.save(user);
        emailService.sendOtpEmail(user);
        var jwtToken = jwtService.generateToken(user);
        response.setStatus(200);
        response.setToken(jwtToken);
        return response;
    }

    public Response verifyRegisterMobile(VerifyRegisterTokenRequest request) {
        Response response = new Response();
        Optional<Account> optionalAccount = accountRepo.findByEmail(request.getEmail());
        if (!optionalAccount.isPresent()) {
            response.setStatus(201);
            response.setMessage("Email không tồn tại");
            return response;
        }

        Account user = optionalAccount.get();

        if (!user.getRegistrationToken().equals(request.getRequestrationToken())) {
            response.setStatus(202);
            response.setMessage("Mã OTP không đúng");
            return response;
        }

        if (new Date().after(user.getRegistrationTokenExpiry())) {
            response.setStatus(203);
            response.setMessage("Mã OTP đã hết hạn");
            return response;
        }

        user.setStatus(true);
        user.setRegistrationToken(null);
        user.setRegistrationTokenExpiry(null);
        user.setStatus(true);
        var cart = Cart.builder()
                .account(optionalAccount.get())
                .build();
        accountRepo.save(user);
        cartRepository.save(cart);

        String jwtToken = jwtService.generateToken(user);
        response.setStatus(200);
        response.setMessage("Xác nhận OTP thành công");
        response.setToken(jwtToken);
        return response;
    }
    public boolean isEmailOrUsernameExists(RegisterRequest request) {
        return accountRepo.existsByEmailOrUsername(request.getEmail(), request.getUsername());
    }

    public boolean isEmailExists(FogotPasswordRequest request) {
        return accountRepo.findByEmail(request.getEmail()).isPresent();
    }
    public boolean isEmailExistAndEnable(FogotPasswordRequest request) {
        return accountRepo.findByEmailAndStatus(request.getEmail(), true).isPresent();
    }

    public Response updateResetPasswordToken(FogotPasswordRequest request, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        System.out.println("Mail: "+ request.getEmail());
        Response response = new Response();
        if(!isEmailExistAndEnable(request)){
            response.setStatus(201);
            response.setMessage("No registration found for this email, or the account has not been verified.");
        }
        Optional<Account> optionalAccount = accountRepo.findByEmail(request.getEmail());
        if (optionalAccount.isPresent()) {
            optionalAccount.get().setResetPasswordToken(RandomString.make(50));
            accountRepo.save(optionalAccount.get());
            emailService.sendEmailToResetPassword(optionalAccount.get(), req);
            response.setStatus(200);
            response.setMessage("Update Reset Password Token and Send mail success");
        } else {
            response.setStatus(202);
            response.setMessage("Account not found");
        }
        return response;
    }
    public Response updateResetPasswordTokenMobile(FogotPasswordRequest request, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        System.out.println("Mail: "+ request.getEmail());
        Response response = new Response();
        if(!isEmailExistAndEnable(request)){
            response.setStatus(201);
            response.setMessage("No registration found for this email, or the account has not been verified.");
        }
        Optional<Account> optionalAccount = accountRepo.findByEmail(request.getEmail());
        if (optionalAccount.isPresent()) {
            optionalAccount.get().setResetPasswordToken(RandomString.make(50));
            accountRepo.save(optionalAccount.get());
            emailService.sendEmailToResetPasswordMobile(optionalAccount.get(), req);
            response.setStatus(200);
            response.setMessage("Update Reset Password Token and Send mail success");
        } else {
            response.setStatus(202);
            response.setMessage("Account not found");
        }
        return response;
    }

    public Response updatePassword(ResetPasswordRequest request) {
        System.out.println("New Password: " + request.getNewPassword());
        System.out.println("request token: " + request.getToken());

        Response response = new Response();
        Optional<Account> optionalAccount = accountRepo.findByResetPasswordToken(request.getToken());
        System.out.println("Account found: " + optionalAccount);
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setResetPasswordToken(null);
            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepo.save(account);
            response.setStatus(200);
            response.setMessage("Update Password success");
        } else {
            response.setStatus(201);
            response.setMessage("Account not found");
        }
        return response;
    }


    public Response authenticate(AuthenticationRequest request) {
        Response response = new Response();

        Optional<Account> optionalAccount = accountRepo.findByUsername(request.getUsername());
        if (optionalAccount.isEmpty()) {
            response.setStatus(202);
            response.setMessage("Username not found");
            return response;
        }
        if (!optionalAccount.get().isStatus()) {
            response.setStatus(203);
            response.setMessage("Your account is not verified. Please verify your account.");
            return response;
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            response.setStatus(201);
            response.setMessage("Invalid username or password");
            return response;
        }
        var jwtToken = jwtService.generateToken(optionalAccount.get());
        response.setStatus(200);
        response.setToken(jwtToken);
      return response;
    }

    public Response loginByGoogle(Map<String, String> request) {
        Response response = new Response();
        String idToken = request.get("idToken");
        System.out.println("idToken: "+idToken);


        GoogleIdToken.Payload payload = verifyGoogleIdToken(idToken);
        if (payload == null) {
            response.setStatus(201);
            response.setMessage("Invalid ID Token");
            return response;
        }

        String email = payload.getEmail();
        String username = (String) payload.get("name");

        Account account = accountRepo.findByEmail(email).orElseGet(() -> {
            Collection<Role> roles = new ArrayList<>();
            Optional<Role> optionalRole = roleRepo.findByName("USER");
            roles.add(optionalRole.get());
            Account newAccount = new Account();
            newAccount.setEmail(email);
            newAccount.setUsername(username);
            newAccount.setAuth_provider(String.valueOf(Auth_Provider.GOOGLE));
            newAccount.setStatus(true);
            newAccount.setCreatedAt(new Date());
            newAccount.setRoles(roles);
            return accountRepo.save(newAccount);
        });

        cartRepository.findByAccount(account)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setAccount(account);
                    return cartRepository.save(newCart);
                });

        String token = jwtService.generateToken(account);
        response.setStatus(200);
        response.setToken(token);
        return response;
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("329726609553-0v2id8560hjcs1c30ho1fbo7lkt2nj4b.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            return (googleIdToken != null) ? googleIdToken.getPayload() : null;
        } catch (Exception e) {
            return null;
        }
    }


}
