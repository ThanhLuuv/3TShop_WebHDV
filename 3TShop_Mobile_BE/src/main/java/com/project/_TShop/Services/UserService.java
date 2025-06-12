package com.project._TShop.Services;


import com.project._TShop.DTO.AccountDTO;
import com.project._TShop.DTO.UserDTO;
import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.User;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.UserRepository;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final AccountRepository accountRepo;


    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("username: "+((UserDetails) authentication.getPrincipal()).getUsername());

        if (!authentication.isAuthenticated()) {
//            System.out.println("username: "+((UserDetails) authentication.getPrincipal()).getUsername());
            return Optional.empty();
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        System.out.println("username: "+ username);
        Optional<Account> account = accountRepo.findByUsername(username);

        return userRepo.findByAccount_Username(username);
    }

    public Response getUserInfo() {
        Response response = new Response();
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isEmpty()) {
            response.setStatus(201);
            response.setMessage("message: Not found User Info");
        } else {
            response.setStatus(200);
            response.setUserDTO(Utils.mapUser(currentUser.get()));
        }
        return response;
    }

    public Response getUserInfoCustomer() {
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Optional<User> currentUser = getCurrentUser();
            if (currentUser.isEmpty()) {
                response.setStatus(202);
                response.setMessage("Not found User Info");
                Account account = accountRepo.findByUsername(username)
                    .orElseThrow(()-> new RuntimeException("Not found accout"));
                AccountDTO accountDTO = new AccountDTO();
                accountDTO.setEmail(account.getEmail());
                accountDTO.setUsername(account.getUsername());
                accountDTO.setCreateAt(account.getCreatedAt());
                response.setAccountDTO(accountDTO);
            } else {
                response.setStatus(200);
                response.setUserDTO(Utils.mapUser(currentUser.get()));
            }
        }catch(RuntimeException e){
            response.setStatus(400);
            response.setMessage(e.getMessage());
        }catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        
        return response;
    }

//    @Transactional
//    public Response editInfor(UserDTO userDTO) {
//        Response response = new Response();
//        try {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String username = authentication.getName();
//            Account account = accountRepo.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Not found account"));
//
//            Optional<User> optionalUser = userRepo.findByAccount(account);
//            User currentUser = optionalUser.orElseThrow(() -> new RuntimeException("Not found User Info"));
//
//            String currentEmail = account.getEmail();
//            String currentPhone = currentUser.getPhone();
//
//            String newEmail = userDTO.getEmail();
//            if (newEmail != null && !newEmail.equals(currentEmail)) {
//                boolean emailExistsInAccount = accountRepo.existsByEmail(newEmail);
//                boolean emailExistsInUser = userRepo.existsByEmail(newEmail);
//
//                if (emailExistsInAccount || emailExistsInUser) {
//                    response.setStatus(409);
//                    response.setMessage("Email already exists");
//                    return response;
//                }
//
//                account.setEmail(newEmail);
//                accountRepo.save(account);
//            }
//
//            String newPhone = userDTO.getPhone();
//            if (newPhone != null && !newPhone.equals(currentPhone)) {
//                boolean phoneExistsInUser = userRepo.existsByPhone(newPhone);
//
//                if (phoneExistsInUser) {
//                    response.setStatus(408);
//                    response.setMessage("Phone number already exists");
//                    return response;
//                }
//
//                currentUser.setPhone(newPhone);
//            }
//
//            if (userDTO.getF_name() != null) currentUser.setF_name(userDTO.getF_name());
//            if (userDTO.getEmail() != null) currentUser.setEmail(userDTO.getEmail());
//            if (userDTO.getL_name() != null) currentUser.setL_name(userDTO.getL_name());
//            if (userDTO.getDate_of_birth() != null) currentUser.setDate_of_birth(userDTO.getDate_of_birth());
//            currentUser.setGender(userDTO.isGender());
//
//            userRepo.save(currentUser);
//
//            response.setStatus(200);
//            response.setMessage("User information updated successfully");
//            response.setUserDTO(Utils.mapUser(currentUser));
//
//        } catch (RuntimeException e) {
//            response.setStatus(400);
//            response.setMessage(e.getMessage());
//        } catch (Exception e) {
//            response.setStatus(500);
//            response.setMessage("Server error");
//        }
//
//        return response;
//    }
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public Response editInfor(UserDTO userDTO) {
    Response response = new Response();
    try {

        System.out.print("email" +userDTO.getEmail());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Not found account"));

        User currentUser = userRepo.findByAccount(account).orElseGet(() -> {
            User newUser = new User();
            newUser.setAccount(account);
            // Gán các giá trị mặc định khi tạo mới
            newUser.setEmail(userDTO.getEmail());
            newUser.setPhone(userDTO.getPhone());
            newUser.setF_name(userDTO.getF_name());
            newUser.setL_name(userDTO.getL_name());
            newUser.setDate_of_birth(userDTO.getDate_of_birth());
            newUser.setGender(userDTO.isGender());
            return newUser;
        });

        String currentEmail = account.getEmail();
        String newEmail = userDTO.getEmail();
        if (newEmail != null && !newEmail.equals(currentEmail)) {
            boolean emailExistsInAccount = accountRepo.existsByEmail(newEmail);
            boolean emailExistsInUser = userRepo.existsByEmail(newEmail);

            if (emailExistsInAccount || emailExistsInUser) {
                response.setStatus(409);
                response.setMessage("Email already exists");
                return response;
            }

            account.setEmail(newEmail);
            accountRepo.save(account);
        }

        // Kiểm tra và cập nhật số điện thoại
        String currentPhone = currentUser.getPhone();
        String newPhone = userDTO.getPhone();
        if (newPhone != null && !newPhone.equals(currentPhone)) {
            boolean phoneExistsInUser = userRepo.existsByPhone(newPhone);

            if (phoneExistsInUser) {
                response.setStatus(408);
                response.setMessage("Phone number already exists");
                return response;
            }

            currentUser.setPhone(newPhone);
        }

        if (userRepo.findByAccount(account).isEmpty()) {
            boolean phoneExistsInUser = userRepo.existsByPhone(newPhone);
            if (phoneExistsInUser) {
                response.setStatus(408);
                response.setMessage("Phone number already exists");
                return response;
            }
            currentUser.setPhone(newPhone);
        }

        // Cập nhật các thông tin khác
        if (userDTO.getF_name() != null) currentUser.setF_name(userDTO.getF_name());
        if (userDTO.getL_name() != null) currentUser.setL_name(userDTO.getL_name());
        if (userDTO.getDate_of_birth() != null) currentUser.setDate_of_birth(userDTO.getDate_of_birth());
        currentUser.setGender(userDTO.isGender());

        // Lưu User vào cơ sở dữ liệu
        userRepo.save(currentUser);

        response.setStatus(200);
        response.setMessage("User information updated successfully");
        response.setUserDTO(Utils.mapUser(currentUser));
    } catch (RuntimeException e) {
        response.setStatus(400);
        response.setMessage(e.getMessage());
    } catch (Exception e) {
        response.setStatus(500);
        System.out.print(e.toString());
        response.setMessage("Server error");
    }

    return response;
}
}

