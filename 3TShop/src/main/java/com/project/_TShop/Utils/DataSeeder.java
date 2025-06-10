// package com.project._TShop.Utils;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import com.project._TShop.Repository.UserRepository;
// import com.project._TShop.Entity.Account;

// @Component
// public class DataSeeder implements CommandLineRunner {

//     private final UserRepository userRepository;

//     public DataSeeder(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public void run(String... args) throws Exception {
//         if (userRepository.count() == 0) {
//             Account admin = new Account();
//             admin.setUsername("admin");
//             admin.setEmail("admin@example.com");
//             userRepository.save(admin);
//         }
//     }
// }
