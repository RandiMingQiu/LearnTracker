package com.learntracker.vo;

import lombok.Data;

@Data
public class LoginVO {
    private String token;

    public LoginVO() {} // ✅ 手动加无参构造


    public LoginVO(String token) {
        this.token = token;
    }
}
