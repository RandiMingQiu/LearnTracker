package com.learntracker.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String token = request.getHeader("Authorization");

        // 放行登录注册接口
        String uri = request.getRequestURI();
        if (uri.contains("/user/login") || uri.contains("/user/register")) {
            return true;
        }

        if (token == null || token.isEmpty()) {
            throw new RuntimeException("未登录");
        }

        try {
            JwtUtil.parseToken(token);
        } catch (Exception e) {
            throw new RuntimeException("token无效");
        }

        return true;
    }
}
