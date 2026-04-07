package com.learntracker.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String uri = request.getRequestURI();

        // ✅ 1. 放行 OPTIONS 请求（关键‼️）
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // ✅ 2. 放行登录和注册
        if (uri.startsWith("/user/login") || uri.startsWith("/user/register")) {
            return true;
        }

        // ✅ 3. 获取 token
        String token = request.getHeader("Authorization");

        if (token == null || token.isEmpty()) {
            throw new RuntimeException("未登录");
        }

        // ✅ 4. 校验 token
        try {
            JwtUtil.parseToken(token);
        } catch (Exception e) {
            throw new RuntimeException("token无效");
        }

        return true;
    }
}
