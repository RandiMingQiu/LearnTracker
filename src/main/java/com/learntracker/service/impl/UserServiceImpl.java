package com.learntracker.service.impl;

import com.learntracker.service.UserService;
import org.springframework.stereotype.Service;

@Service
//意思就是把这个类交给Spring管理
//定义函数具体的执行逻辑
public class UserServiceImpl implements UserService {

    @Override
    public void register(String username,String password){
        System.out.println("注册用户"+username);
    }
}
