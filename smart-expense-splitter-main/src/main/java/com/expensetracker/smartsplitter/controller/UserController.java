package com.expensetracker.smartsplitter.controller;

import com.expensetracker.smartsplitter.dto.RegisterRequest;
import com.expensetracker.smartsplitter.dto.UserDto;
import com.expensetracker.smartsplitter.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest registerRequest){
        UserDto user = userService.register(registerRequest);
        return new ResponseEntity<UserDto>(user,HttpStatus.CREATED);
    }

    @GetMapping("user/id/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id){
        return new ResponseEntity<UserDto>(userService.findById(id),HttpStatus.OK);
    }
    @GetMapping("user/email/{mail}")
    public  ResponseEntity<UserDto> findByEmail(@PathVariable String mail){
        return new ResponseEntity<UserDto>(userService.findByEmail(mail),HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        return new ResponseEntity<List<UserDto>>(userService.findAllUsers(),HttpStatus.OK);
    }
}
