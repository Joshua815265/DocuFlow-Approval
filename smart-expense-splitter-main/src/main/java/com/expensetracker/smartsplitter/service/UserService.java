package com.expensetracker.smartsplitter.service;

import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserDto register(RegisterRequest request);
    UserDto findById(Long id);
    UserDto findByEmail(String email);
    List<UserDto> findAllUsers();
}
