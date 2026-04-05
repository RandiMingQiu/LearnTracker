package com.learntracker.controller;


import com.learntracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;//接口类型的变量，里面装的是实现类对象

    @GetMapping("/register")
    public String register(String username,String password){
        userService.register(username,password);
        //实际执行的是UserServiceImpl.register()
        return "注册成功！";
    }
}
