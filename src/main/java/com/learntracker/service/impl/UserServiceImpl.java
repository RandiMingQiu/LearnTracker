package com.learntracker.service.impl;

import com.learntracker.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public void register(String username,String password){
        System.out.println("注册用户"+username);
    }
}
