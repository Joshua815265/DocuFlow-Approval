package com.expensetracker.smartsplitter.service.impl;

import com.expensetracker.smartsplitter.config.JwtService;
import com.expensetracker.smartsplitter.dto.AuthResponse;
import com.expensetracker.smartsplitter.dto.LoginRequest;
import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import com.expensetracker.smartsplitter.exception.UsernameNotFoundException;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.repository.UserRepository;
import com.expensetracker.smartsplitter.service.AuthService;
import com.expensetracker.smartsplitter.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AuthResponse register(RegisterRequest request) {
        UserDto userDto = userService.register(request);
        String token = jwtService.generateToken(userDto.getEmail());

        return new AuthResponse(token, userDto);
    }
    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        UserDto userDto = modelMapper.map(user, UserDto.class);

        return new AuthResponse(token, userDto);
    }

    @Override
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDto.class);
    }
}

