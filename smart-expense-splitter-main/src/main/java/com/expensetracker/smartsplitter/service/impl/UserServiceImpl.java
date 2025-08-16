package com.expensetracker.smartsplitter.service.impl;

import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import com.expensetracker.smartsplitter.model.Role;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.repository.UserRepository;
import com.expensetracker.smartsplitter.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private ModelMapper modelMapper;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public  UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper,BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public UserDto register(RegisterRequest request) {
        request.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        User  user = modelMapper.map(request,User.class);
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        userRepository.save(user);
        return modelMapper.map(user,UserDto.class);

    }

    @Override
    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return modelMapper.map(user, UserDto.class);
    }


    @Override
    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public List<UserDto> findAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> dtos = users.stream().map(user -> modelMapper.map(user,UserDto.class)).collect(Collectors.toList());
        return dtos;
    }
}
