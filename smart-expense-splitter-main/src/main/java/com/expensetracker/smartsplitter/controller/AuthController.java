package com.expensetracker.smartsplitter.controller;

import com.expensetracker.smartsplitter.dto.AuthResponse;
import com.expensetracker.smartsplitter.dto.LoginRequest;
import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import com.expensetracker.smartsplitter.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
            return ResponseEntity.ok(authService.login(request));
        }

    @GetMapping("/me")
    public ResponseEntity<UserDto> currentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}

