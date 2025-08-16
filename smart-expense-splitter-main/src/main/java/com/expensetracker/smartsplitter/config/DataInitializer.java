package com.expensetracker.smartsplitter.config;

import com.expensetracker.smartsplitter.model.Role;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist to avoid duplicates
        if (userRepository.findByEmail("99220040214@klu.ac.in").isEmpty()) {
            User user1 = new User();
            user1.setEmail("99220040214@klu.ac.in");
            user1.setUsername("KLU_User");
            user1.setPassword(bCryptPasswordEncoder.encode("password123"));
            user1.setMobile("9922004021");
            user1.setRole(Role.USER);
            userRepository.save(user1);
            System.out.println("Created user: 99220040214@klu.ac.in");
        }

        if (userRepository.findByEmail("harshasrikarthikeyathumuluri@gmail.com").isEmpty()) {
            User user2 = new User();
            user2.setEmail("harshasrikarthikeyathumuluri@gmail.com");
            user2.setUsername("Harsha");
            user2.setPassword(bCryptPasswordEncoder.encode("Harsha@26"));
            user2.setMobile("9876543210");
            user2.setRole(Role.USER);
            userRepository.save(user2);
            System.out.println("Created user: harshasrikarthikeyathumuluri@gmail.com");
        }

        System.out.println("Data initialization completed!");
    }
}
