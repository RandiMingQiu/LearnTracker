package com.learntracker.controller;


import com.learntracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/register")
    public String register(String username,String password){
        userService.register(username,password);
        return "注册成功！";
    }
}
