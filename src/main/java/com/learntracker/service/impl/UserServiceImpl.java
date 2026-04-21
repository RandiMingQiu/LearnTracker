package com.learntracker.service.impl;

import com.learntracker.config.JwtUtil;
import com.learntracker.dto.LoginDTO;
import com.learntracker.dto.RegisterDTO;
import com.learntracker.entity.User;
import com.learntracker.repository.UserRepository;
import com.learntracker.service.UserService;
import com.learntracker.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void register(RegisterDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt()));
        user.setEmail(dto.getEmail());
        userRepository.save(user);
    }

    @Override
    public LoginVO login(LoginDTO dto) {

        User user = userRepository.findByUsername(dto.getUsername())
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("用户名不存在");
        }

        if (!BCrypt.checkpw(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        String token = JwtUtil.generateToken(user.getUsername());
        return new LoginVO(token);
    }

    @Override
    public String getCurrentUser(String token) {
        return JwtUtil.parseToken(token);
    }
}