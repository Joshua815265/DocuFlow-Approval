package com.expensetracker.smartsplitter.service;

import com.expensetracker.smartsplitter.dto.AuthResponse;
import com.expensetracker.smartsplitter.dto.LoginRequest;
import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser();

}
