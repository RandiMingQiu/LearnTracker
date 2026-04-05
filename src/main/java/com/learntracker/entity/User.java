package com.learntracker.entity;

import jakarta.persistence.*;

@Entity//这个类=数据库表
@Table(name="Users")//对应数据库里的Users表
public class User {
    @Id//主键
    @GeneratedValue(strategy = GenerationType.IDENTITY)//自增
    private Long id;

    private String username;

    private String password;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
