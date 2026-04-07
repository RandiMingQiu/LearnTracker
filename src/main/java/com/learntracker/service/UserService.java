package com.learntracker.service;

import com.learntracker.dto.LoginDTO;
import com.learntracker.dto.RegisterDTO;
import com.learntracker.vo.LoginVO;

public interface UserService {

    void register(RegisterDTO dto);

    LoginVO login(LoginDTO dto);

    String getCurrentUser(String token);
}
