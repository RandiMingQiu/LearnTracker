package com.learntracker.controller;

import com.learntracker.common.result.Result;
import com.learntracker.dto.LoginDTO;
import com.learntracker.dto.RegisterDTO;
import com.learntracker.service.UserService;
import com.learntracker.vo.LoginVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result<?> register(@RequestBody @Valid RegisterDTO dto) {
        userService.register(dto);
        return Result.success();
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody @Valid LoginDTO dto) {
        return Result.success(userService.login(dto));
    }

    @GetMapping("/me")
    public Result<String> me(@RequestHeader("Authorization") String token) {
        return Result.success(userService.getCurrentUser(token));
    }
}