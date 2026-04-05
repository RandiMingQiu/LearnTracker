package com.learntracker.controller;


import com.learntracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;//里面装的是Spring注入的UserServiceImpl对象

    @GetMapping("test")
    public String test(String username,String password){
        userService.register(username,password);
        return "ok";
    }
}
